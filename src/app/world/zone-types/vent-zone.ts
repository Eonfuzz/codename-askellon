import { ZONE_TYPE, ZONE_TYPE_TO_ZONE_NAME } from "../zone-id";
import { Unit } from "w3ts/handles/unit";
import { MapPlayer, Timer, Region, Rectangle } from "w3ts";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ABIL_GENE_NIGHTEYE } from "resources/ability-ids";
import { VisionFactory } from "app/vision/vision-factory";
import { VISION_PENALTY } from "app/vision/vision-type";
import { BuffInstanceCallback } from "app/buff/buff-instance-callback-type";
import { CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { ZoneWithExits } from "./zone-with-exits";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { SFX_CARRION_SWARM_HIT } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";
import { SoundRef } from "app/types/sound-ref";

export class VentZone extends ZoneWithExits {
    protected hasOxygen: boolean = true;

    private gasPreparing = false;
    private gasActive = false;
    private gasTicker = 0;
    private gasLoopSound = new SoundRef("Sounds\\GasLoop.wav", true, true);
    private fogEffects = [];


    constructor(id: ZONE_TYPE) {
        super(id);

        // Get get light sources and power gens based on ID
        this.allRects.forEach(r => {
            this.fogEffects.push(AddWeatherEffect(r, FourCC('FDwh')));
            EnableWeatherEffect(this.fogEffects[this.fogEffects.length-1], true);
        });

        // Listen to gas events
        EventEntity.listen(new EventListener(EVENT_TYPE.SYSTEM_PREPARES_VENT_PURGE, (self, event) => {
            this.gasPreparing = true;
            this.gasLoopSound.setVolume(0);
            this.gasLoopSound.playSound();
            this.unitsInside.forEach(u => {
                if (MapPlayer.fromLocal() === u.owner) {
                    this.gasLoopSound.setVolume(15);
                }
            });
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.SYSTEM_STARTS_VENT_PURGE, (self, event) => {
            // Destroy old effects
            this.fogEffects.forEach(f => {
                EnableWeatherEffect(f, false);
                RemoveWeatherEffect(f);
            });
            this.fogEffects = [];

            this.gasPreparing = false;
            this.gasActive = true;
            this.allRects.forEach(r => {
                this.fogEffects.push(AddWeatherEffect(r, FourCC('FDgh')));
                EnableWeatherEffect(this.fogEffects[this.fogEffects.length-1], true);
                EnableWeatherEffect(GetLastCreatedWeatherEffect(), true);
                this.fogEffects.push(AddWeatherEffect(r, FourCC('FDrh')));
                EnableWeatherEffect(this.fogEffects[this.fogEffects.length-1], true);
                EnableWeatherEffect(GetLastCreatedWeatherEffect(), true);
            });
        }));
        // Listen to gas events
        EventEntity.listen(new EventListener(EVENT_TYPE.SYSTEM_STOPS_VENT_PURGE, (self, event) => {
            this.gasActive = false;
            this.gasLoopSound.stopSound();
            this.fogEffects.forEach(f => {
                EnableWeatherEffect(f, false);
                RemoveWeatherEffect(f);
            });
            this.fogEffects = [];
            
            this.allRects.forEach(r => {
                this.fogEffects.push(AddWeatherEffect(r, FourCC('FDwh')));
                EnableWeatherEffect(this.fogEffects[this.fogEffects.length-1], true);
            });
        }));
    }

    public onLeave(unit: Unit) {
        super.onLeave(unit);

        if (unit.typeId === CREWMEMBER_UNIT_ID) {
            if (MapPlayer.fromLocal() === unit.owner) {
                this.gasLoopSound.setVolume(0);
            }
        }
    }

    public onEnter(unit: Unit) {
        super.onEnter(unit);
        if (unit.typeId === CREWMEMBER_UNIT_ID) {
            if ((this.gasPreparing || this.gasActive) && MapPlayer.fromLocal() === unit.owner) {
                this.gasLoopSound.setVolume(15);
            }

            // If no oxy apply oxy loss
            // TODO
            // If no power apply power loss
            this.applyVisionLoss(unit.owner)
        }
    }


    public step(delta: number) {    
        if (this.gasActive) {
            this.gasTicker += delta;

            if (this.gasTicker >= 0.5) {
                this.gasTicker = 0;
                for (let index = 0; index < this.unitsInside.length; index++) {
                    const unit = this.unitsInside[index];
                    UnitDamageTarget(unit.handle, unit.handle, 10 + unit.maxLife*0.02, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);

                    const sfx = AddSpecialEffect(SFX_CARRION_SWARM_HIT, unit.x, unit.y);
                    BlzSetSpecialEffectZ(sfx, getZFromXY(unit.x, unit.y) + 30);
                    DestroyEffect(sfx);
                }
            }
        }
            
    }

    /**
     * Visible power changes for local player
     * Will also update player vision status
     * @param player 
     * @param hasPower 
     * @param justChanged 
     */
    applyVisionLoss(player: MapPlayer) {
        const playerDetails = PlayerStateFactory.get(player);
        if (playerDetails) {
            const crewmember = playerDetails.getCrewmember();
            
            // IF we dont have power add despair to the unit
            if (crewmember && GetUnitAbilityLevel(crewmember.unit.handle, ABIL_GENE_NIGHTEYE) === 0) {
                crewmember.addDespair(new BuffInstanceCallback(crewmember.unit, () => {
                    const hasNighteye = GetUnitAbilityLevel(crewmember.unit.handle, ABIL_GENE_NIGHTEYE) > 0;

                    return !hasNighteye && this.unitsInside.indexOf(crewmember.unit) >= 0 && this.doCauseFear();
                }));
            }
        }

        // Remove the existing modifier (if any)
        if (this.playerLightingModifiers.has(player)) {
            const mod = this.playerLightingModifiers.get(player);
            this.playerLightingModifiers.delete(player);
            VisionFactory.getInstance().removeVisionModifier(mod);
        }

        this.playerLightingModifiers.set(player, 
            VisionFactory.getInstance().addVisionModifier(VISION_PENALTY.TERRAIN_DARK_AREA, player)
        );
    }

    public doCauseFear() { return true; }
}