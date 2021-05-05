import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { AskellonEntity } from "app/station/askellon-entity";
import { Timers } from "app/timer-type";
import { SoundRef } from "app/types/sound-ref";
import { Vector2 } from "app/types/vector2";
import { FogEntity } from "app/vision/fog-entity";
import { WorldEntity } from "app/world/world-entity";
import { ShipZone } from "app/world/zone-types/ship-zone";
import { DummyCast } from "lib/dummy";
import { Quick } from "lib/Quick";
import { Log } from "lib/serilog/serilog";
import { PlayNewSound } from "lib/translators";
import { getZFromXY, MessageAllPlayers } from "lib/utils";
import { ABIL_DUMMY_FLAMESTRIKE } from "resources/ability-ids";
import { COL_BAD, COL_GOOD, COL_MISC, COL_ORANGE } from "resources/colours";
import { SFX_BUILDING_EXPLOSION, SFX_EXPLOSION_GROUND, SFX_EXPLOSION_GROUND_NO_DIRT } from "resources/sfx-paths";
import { UNIT_ID_DEBRIS_1, UNIT_ID_DEBRIS_2, UNIT_ID_DEBRIS_3 } from "resources/unit-ids";
import { Players } from "w3ts/globals/index";
import { Effect, Timer, TimerDialog, Unit } from "w3ts/index";
import { Behaviour } from "../behaviour";
import { ABILITY_HOOK } from "../hook-types";

export class AskellonDamageBehaviour extends Behaviour {
    
    private askellonDamageSound1 = new SoundRef("Sounds\\ShipDamage\\GroanLong1.mp3", false, true);
    private askellonDamageSound2 = new SoundRef("Sounds\\ShipDamage\\GroanLong2.mp3", false, true);
    private askellonDestructionAlarm = new SoundRef("Sounds\\ShipDamage\\ShipDestructionAlarm.mp3", false, true);
    private askellonExplosion = new SoundRef("Sounds\\ShipDamage\\ShipExplosion.mp3", false, true);

    private previousShipLifePercent = 0;

    // keep track of damage taken within the last 5 seconds
    private damageTakenEachSecond: number[] = [0, 0, 0, 0, 0]
    private damgageCounter = 1;

    private isInMeltdown = false;

    private shipIsDead = false;

    constructor() {
        super();
        // MessageAllPlayers("Creating test behaviour");

        // At the start of the game we should cause some explosion for funsies
        // NOW done by the ship receiving damage at start of game
        this.causeMultipleDamageOnAskellon(5);
        // Timers.addTimedAction(10, () => this.causeMultipleDamageOnAskellon(5));
    }

    public onEvent(event: ABILITY_HOOK) {
        // MessageAllPlayers(`${this.forUnit.name} :: `+ABILITY_HOOK[event]);
        if (this.shipIsDead && event === ABILITY_HOOK.PostUnitTakesDamage) {
            BlzSetEventDamage(0);
        }
        else if (event === ABILITY_HOOK.PostUnitTakesDamage) {
            if (this.forUnit.invulnerable) return;
            
            this.damageTakenEachSecond[0] += GetEventDamage();
            this.checkDamageDealtEffects();

            // If we are less than 20% life we explode
            if ((this.forUnit.life - GetEventDamage()) / this.forUnit.maxLife <= 0.2) {
                BlzSetEventDamage(0);
                this.forUnit.paused = true;
                this.forUnit.invulnerable = true;
                this.forUnit.setVertexColor(100, 100, 100, 255);

                // TODO
                // Only for players on station
                // For now, everyone
                Players.forEach(p => {                    
                    FogEntity.transition(p, {
                        fStart: 1000,
                        fEnd: 2000,
                        density: 2,
                        r: 118, g: 49, b: 52
                    }, 10);
                });

                const t = new Timer();
                const dialog = new TimerDialog(t);
                dialog.setTitle(`Meltdown`);
                dialog.display = true;
                this.isInMeltdown = true;
                Timers.addTimedAction(72, () => {
                    this.askellonExplosion.playSound();
                });
                
                Timers.addTimedAction(82, () => {
                    CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 255.00, 255.00, 255.00, 0);           
                    EnableUserUI(true);
                                        
                    Timers.addTimedAction(1, () => {
                        GroupEnumUnitsInRect(CreateGroup(), 
                        gg_rct_stationtempvision,
                        Filter(() => {
                            const u = GetFilterUnit();
                            KillUnit(u);
                            return false;
                        }));
                    });
                });
                t.start(80, false, () => {
                    dialog.display = false;
                    this.askellonDestructionAlarm.destroy();

                    this.shipIsDead = true;
                    this.isInMeltdown = false;
                    CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 0.00, 0.00, 0.00, 0);           
                    EnableUserUI(true);
                    this.forUnit.addAbility(FourCC("Aloc"));

                    Players.forEach(p => {                    
                        FogEntity.reset(p, 10);
                    });
                });
                
                PlayNewSound("Sounds\\ShipDamage\\GroanLong2.mp3", 127);
                CinematicFadeBJ(bj_CINEFADETYPE_FADEOUTIN, 2, "ReplaceableTextures\\CameraMasks\\White_mask.blp", 100.00, 100.00, 90.00, 0);           
                EnableUserUI(true);
                
                this.askellonDestructionAlarm.setVolume(80);
                this.askellonDestructionAlarm.playSound();
            }
        }
    }

    /**
     * Iterate upon this instance of the aiblity
     */
    public step(deltaTime: number) {
        this.damgageCounter -= deltaTime;
        if (!this.isInMeltdown) {
            if (this.damgageCounter <= 0) {
                this.damgageCounter = 1;
                this.damageTakenEachSecond.pop();
                this.damageTakenEachSecond.unshift(0);
            }
        }
        else if (this.damgageCounter <= 0) {
            this.damgageCounter = 5;
            this.causeMultipleDamageOnAskellon(10);
        }
    }

    private checkDamageDealtEffects() {
        let sumVal = 0;
        this.damageTakenEachSecond.forEach(d => sumVal += d);
        const percent = this.forUnit.life / this.forUnit.maxLife;

        // If we've taken more than 1000 damage over 5 seconds
        if (sumVal > 1000) {
            // Clear damage dealt numbers
            this.damageTakenEachSecond = this.damageTakenEachSecond.map(() => 0);
            // Play damage sound
            if (GetRandomReal(0, 100) > 50) this.askellonDamageSound1.playSound();
            else this.askellonDamageSound2.playSound();

            let col = percent > 0.8 ? COL_GOOD : (percent > 0.6 ? COL_ORANGE : COL_BAD);
            let tag = percent > 0.8 ? `WARNING` : (percent > 0.6 ? `DANGER` : `CRITICAL`);

            MessageAllPlayers(`[${col}${tag}|r] Askellon hull taken massive damage`);
            MessageAllPlayers(`[${col}${tag}|r] Hull Integrity at ${col}${I2S(R2I(percent*100))}%|r`);
            this.causeMultipleDamageOnAskellon(10);
        }
        else if (percent < 0.75 && this.previousShipLifePercent >= 0.75) {
            // Just check we haven't hit any breakpoints
            let col = percent > 0.8 ? COL_GOOD : (percent > 0.6 ? COL_ORANGE : COL_BAD);
            let tag = percent > 0.8 ? `WARNING` : (percent > 0.6 ? `DANGER` : `CRITICAL`);

            MessageAllPlayers(`[${col}${tag}|r] Askellon integrity failing`);
            MessageAllPlayers(`[${col}${tag}|r] Hull Integrity at ${col}${I2S(R2I(percent*100))}%|r`);
            this.causeMultipleDamageOnAskellon(16);
        }
        else if (percent < 0.5 && this.previousShipLifePercent >= 0.5) {
            // Just check we haven't hit any breakpoints
            let col = percent > 0.8 ? COL_GOOD : (percent > 0.6 ? COL_ORANGE : COL_BAD);
            let tag = percent > 0.8 ? `WARNING` : (percent > 0.6 ? `DANGER` : `CRITICAL`);

            MessageAllPlayers(`[${col}${tag}|r] Askellon integrity failing`);
            MessageAllPlayers(`[${col}${tag}|r] Hull Integrity at ${col}${I2S(R2I(percent*100))}%|r`);
            this.causeMultipleDamageOnAskellon(28);
        }
        else if (percent < 0.3 && this.previousShipLifePercent >= 0.3) {
            // Just check we haven't hit any breakpoints
            let col = percent > 0.8 ? COL_GOOD : (percent > 0.6 ? COL_ORANGE : COL_BAD);
            let tag = percent > 0.8 ? `WARNING` : (percent > 0.6 ? `DANGER` : `CRITICAL`);

            MessageAllPlayers(`[${col}${tag}|r] Askellon integrity failing`);
            MessageAllPlayers(`[${col}${tag}|r] Hull Integrity at ${col}${I2S(R2I(percent*100))}%|r`);
            this.causeMultipleDamageOnAskellon(50);
        }


        this.previousShipLifePercent = this.forUnit.life / this.forUnit.maxLife;
    }

    private causeMultipleDamageOnAskellon(howMany: number) {
        let i = 0;
        while (i <= howMany) {
            i++;
            Timers.addTimedAction(GetRandomReal(0, 10), () => this.causeDamageOnAskellon());
        }
    }

    private causeDamageOnAskellon() {
        // get a random "zone"
        const zones = WorldEntity.getInstance().askellon.allFloors;
        const rZone = Quick.GetRandomFromArray(zones, 1)[0];

        Log.Verbose(`Spawning Debris in ${rZone.id}`);

        if (this.isInMeltdown && rZone instanceof ShipZone) {
            rZone.powerGenerators.forEach(g => {
                if (g.life >= 0.4 && g.invulnerable === false) {
                    g.damageTarget(g.handle, 50, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
                } 
            });
        }

        const point = rZone.getRandomPointInZone(100);
        this.explodeDamageCreateDebris(point);
    }

    private explodeDamageCreateDebris(where: Vector2) {
        const z = getZFromXY(where.x, where.y);
        const explodeVariation = GetRandomInt(1,3);

        DummyCast(unit => {
            SetUnitAbilityLevel(unit, ABIL_DUMMY_FLAMESTRIKE, explodeVariation);

            SetUnitX(unit, where.x);
            SetUnitY(unit, where.y + 50);
            IssuePointOrder(unit, 'flamestrike', where.x, where.y);
            
        }, ABIL_DUMMY_FLAMESTRIKE);

        CameraSetSourceNoise(5, 50);
        Timers.addTimedAction(4, () => {                
            // Create explosive SFX!

            let sfx = new Effect(SFX_BUILDING_EXPLOSION, where.x, where.y);
            sfx.z = z + 5;
            sfx.destroy();

            let offset = 50 + explodeVariation * 50;
            this.forUnit.damageAt(0.1, 100+50*explodeVariation, where.x, where.y, 200, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
            
            

            Timers.addTimedAction(0.2, () => {
                PlayNewSound("Sounds\\ExplosionBassHeavy.mp3", 127);
                CameraSetSourceNoise(0, 0);

                let isNegative = GetRandomReal(0, 1) >= 0.5;
                let mirrorLoc = Vector2.fromWidget(this.forUnit.handle).applyPolarOffset(isNegative ? -this.forUnit.facing+GetRandomReal(-30, 30) : this.forUnit.facing, GetRandomReal(0, 300));

                let sfx = new Effect(SFX_EXPLOSION_GROUND_NO_DIRT, mirrorLoc.x+GetRandomReal(-100, 100), mirrorLoc.y+GetRandomReal(-100, 100));
                sfx.destroy();
                this.forUnit.damageTarget(this.forUnit.handle, 50, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_DEATH, WEAPON_TYPE_WHOKNOWS);
                // subtract the damage dealt from the damage ticker
                // This is so that we stop chain reactions
                this.damageTakenEachSecond[0] -= 50;

                let i = 0;
                while (i < 360) {
                    const p = where.applyPolarOffset(i, offset);
                    let sfx = new Effect(SFX_EXPLOSION_GROUND, p.x, p.y);
                    sfx.setYaw(GetRandomReal(0, 360));
                    sfx.z = z + 5;
                    sfx.destroy();
                    
                    i += 360 / 6;
                }

                let uType = explodeVariation === 1 ? UNIT_ID_DEBRIS_1 
                    : (explodeVariation === 2 ? UNIT_ID_DEBRIS_2 : UNIT_ID_DEBRIS_3);
                
                let debris = new Unit(PlayerStateFactory.NeutralPassive, uType, where.x, where.y, GetRandomReal(0, 360));
                debris.name = `Debris|n${COL_MISC}Destroy this|r`;
                SetUnitAnimation(debris.handle, "birth");
                QueueUnitAnimation(debris.handle,"stand");
                debris.owner = PlayerStateFactory.StationProperty;
            });
        })
    }

    public doDestroy() {
        if (!this.forUnit.isAlive()) return true;
        return false;
    }

    public destroy() {}
}