import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { MessageAllPlayers, getZFromXY } from "lib/utils";
import { COL_ORANGE, COL_INFO } from "resources/colours";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { WorldEntity } from "app/world/world-entity";
import { MapPlayer, Unit } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { SHIP_VOYAGER_UNIT } from "resources/unit-ids";
import { ForceEntity } from "app/force/force-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { SFX_LASER_3 } from "resources/sfx-paths";
import { ABIL_ASKELLON_BROADSIDE_LEFT, TECH_DUMMY_DIVERT_WEAPONS } from "resources/ability-ids";
import { Log } from "lib/serilog/serilog";
import { PlayNewSoundOnUnit } from "lib/translators";
import { Timers } from "app/timer-type";


export class LaserBroadsideAbility implements Ability {
    private timeElapsed = 0;

    private castingUnit: Unit;
    private isLeft: boolean;
    private shakingPlayers: MapPlayer[];
    private shotTiming = [0.1, 0.3, 0.5, 0.7, 0.9];
    private shotOffset = [150, 100, 50, 0, -50]

    private decayTimer = 1;

    constructor() {}

    public initialise() {
        this.castingUnit = Unit.fromHandle( GetTriggerUnit() );
        this.shakingPlayers = WorldEntity.getInstance().askellon.getPlayers();


        this.isLeft = GetSpellAbilityId() === ABIL_ASKELLON_BROADSIDE_LEFT;


        const tLevel = this.castingUnit.owner.getTechCount(TECH_DUMMY_DIVERT_WEAPONS, true);
        if ( tLevel > 0) {
            this.shotTiming.push(1.2);
            this.shotTiming.push(1.4);
            this.shotOffset.push(-100);
            this.shotOffset.push(-150);
        }


        this.shakingPlayers.forEach(p => {
            // Log.Information(`Player ${p.name}`)
            CameraSetSourceNoiseForPlayer(p.handle, 5, 50);
        });

        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        if (this.shotTiming.length === 0) {
            this.decayTimer -= delta;
            return this.decayTimer > 0;
        }

        else {

            const shotTiming = this.shotTiming[0];
            if (this.timeElapsed >= shotTiming) {
                const facing = this.castingUnit.facing;
                const broadsideFacing = facing + (this.isLeft ? 90 : -90);

                const uLoc = Vector2.fromWidget(this.castingUnit.handle)
                const pointOffset = uLoc.applyPolarOffset(broadsideFacing, 100).applyPolarOffset(facing, this.shotOffset[0]);

                this.shotTiming.splice(0, 1);
                this.shotOffset.splice(0, 1);
                    
                const snd = new SoundRef("Sounds\\ExplosionBassHeavy.mp3", false, true);
                this.shakingPlayers.forEach(p => {
                    // Log.Information(`Player ${p.name}`)
                    if (p.handle === GetLocalPlayer()) {
                        snd.setVolume(100);
                    } else {
                        snd.setVolume(0);
                    }
                });
                snd.playSound(true);
                
                Timers.addTimedAction(0.2, () => {
                    PlayNewSoundOnUnit("Sounds\\Laser5.mp3", this.castingUnit, 30);
                })

                const z = getZFromXY(pointOffset.x, pointOffset.y);
                const bulletLoc = new Vector3(pointOffset.x, pointOffset.y, z+5);
                const targetLoc = bulletLoc.projectTowards2D(broadsideFacing, 2500);
                targetLoc.z = z;

                const deltaTarget = targetLoc.subtract(bulletLoc);       

                const projectile = new Projectile(
                    this.castingUnit.handle,
                    bulletLoc,
                    new ProjectileTargetStatic(deltaTarget)
                )
                .setVelocity(1500)
                .overrideFilter((projectile: Projectile) => {
                    let unit = GetFilterUnit(); 
                    return GetWidgetLife(unit) > 0.405 && GetUnitTypeId(unit) === SHIP_VOYAGER_UNIT
                        && GetOwningPlayer(unit) !== this.castingUnit.owner.handle &&
                        IsUnitType(unit, UNIT_TYPE_MAGIC_IMMUNE) == false;
                })
                .onCollide((projectile, withWho) => this.onCollide(projectile, withWho));

                const effect = projectile.addEffect(SFX_LASER_3, new Vector3(0, 0, 0), deltaTarget.normalise(), 1.2);
                // BlzSetSpecialEffectColor(effect, 160, 140, 255);
                WeaponEntity.getInstance().addProjectile(projectile);
            }

            return true;
        }
    };

    private onCollide(projectile: Projectile, withWho: unit) {
        projectile.setDestroy(true);
        const targetUnit = Unit.fromHandle(withWho);
        ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.castingUnit.owner, targetUnit.owner);

        // Now deal damage

        // const crewmember = CrewFactory.getInstance().getCrewmemberForUnit(this.castingUnit);
        let damage = 200;

        UnitDamageTarget(
            this.castingUnit.handle, 
            targetUnit.handle, 
            damage, 
            false, 
            true, 
            ATTACK_TYPE_PIERCE, 
            DAMAGE_TYPE_NORMAL, 
            WEAPON_TYPE_WOOD_MEDIUM_STAB
        );
        return false;
    }

    public destroy() {
        this.shakingPlayers.forEach(p => {
            CameraSetSourceNoiseForPlayer(p.handle, 0, 0);
        });
        return true;
    };
}