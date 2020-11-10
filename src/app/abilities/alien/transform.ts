/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { AlienForce } from "app/force/forces/alien-force";
import { SMART_ORDER_ID, ABIL_TRANSFORM_ALIEN_HUMAN, ABIL_TRANSFORM_HUMAN_ALIEN } from "resources/ability-ids";
import { Trigger, Unit, Timer, MapPlayer } from "w3ts";
import { Log } from "lib/serilog/serilog";
import { getZFromXY, getRandomBlood, CreateBlood, AddGhost, RemoveGhost } from "lib/utils";
import { WORM_ALIEN_FORM, CREWMEMBER_UNIT_ID } from "resources/unit-ids";
import { FilterIsAlive } from "resources/filters";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { ForceEntity } from "app/force/force-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { AbilityHooks } from "../ability-hooks";


const CREATE_SFX_EVERY = 0.06;
const MEAT_SFX = [
    "Abilities\\Weapons\\MeatwagonMissile\\MeatwagonMissile.mdl", 
    // "Units\\Undead\\Abomination\\AbominationExplosion.mdl",
];
const SFX_HUMAN_BLOOD = "Objects\\Spawnmodels\\Orc\\OrcLargeDeathExplode\\OrcLargeDeathExplode.mdl";
const SFX_ALIEN_BLOOD = "Objects\\Spawnmodels\\Undead\\UndeadLargeDeathExplode\\UndeadLargeDeathExplode.mdl";
const SFX_BLOOD_EXPLODE = "Units\\Undead\\Abomination\\AbominationExplosion.mdl";

const MEAT_AOE = 450;
const MEAT_AOE_MIN = 150;
const DURATION_TO_ALIEN = 0.5;
const DURATION_TO_HUMAN = 0.5;

export class TransformAbility implements Ability {

    private casterUnit: Unit | undefined;
    private timeElapsed: number;
    private timeElapsedSinceSFX: number = CREATE_SFX_EVERY;

    private orderTrigger = new Trigger();
    private previousOrder: number | undefined;
    private previousOrderTarget: Vector2 | undefined;

    private toAlien: boolean = true;
    private duration: number;

    constructor(toAlienFromHuman: boolean) {
        this.timeElapsed = 0;
        this.toAlien = toAlienFromHuman;
        this.duration = (this.toAlien ? DURATION_TO_ALIEN : DURATION_TO_HUMAN);
    }

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        // Log.Information("Casting transform!");

        // Create order trigger to track last issued order
        this.orderTrigger.registerUnitEvent(this.casterUnit, EVENT_UNIT_ISSUED_POINT_ORDER);
        // this.orderTrigger.registerUnitEvent(this.casterUnit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        this.orderTrigger.addCondition(Condition(() => GetIssuedOrderId() === SMART_ORDER_ID));
        this.orderTrigger.addAction(() => {
            this.previousOrder = GetIssuedOrderId();
            this.previousOrderTarget = new Vector2(GetOrderPointX(), GetOrderPointY());
        });
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;
        this.timeElapsedSinceSFX += delta;

        if (this.casterUnit.isAlive() === false) return false;

        if (this.timeElapsedSinceSFX >= CREATE_SFX_EVERY && this.casterUnit) {
            this.timeElapsedSinceSFX = 0;
            const tLoc = vectorFromUnit(this.casterUnit.handle);

            const unitHeight = getZFromXY(tLoc.x, tLoc.y);
            const startLoc = new Vector3(tLoc.x, tLoc.y, unitHeight + 80)

            const newTarget = new Vector3(
                startLoc.x + this.getRandomOffset(),
                startLoc.y + this.getRandomOffset(),
                unitHeight
            );

            const projStartLoc = new Vector3(startLoc.x, startLoc.y, unitHeight + 20);
            const projectile = new Projectile(
                this.casterUnit.handle, 
                projStartLoc,
                new ProjectileTargetStatic(newTarget.subtract(startLoc)),
                new ProjectileMoverParabolic(projStartLoc, newTarget, Deg2Rad(GetRandomReal(60,85)))
            )
            .onDeath((proj: Projectile) => this.bloodSplash(proj.getPosition()))
            .onCollide(() => true);

            projectile.addEffect(this.getRandomSFX(), new Vector3(0, 0, 0), newTarget.subtract(startLoc).normalise(), 1);

            const bloodSfx = AddSpecialEffect(this.getBloodEffect(), startLoc.x, startLoc.y);
            BlzSetSpecialEffectZ(bloodSfx, startLoc.z - 30);
            DestroyEffect(bloodSfx);

            WeaponEntity.getInstance().addProjectile(projectile);
        }
        return this.timeElapsed < this.duration;
    };

    private getRandomOffset(): number {
        const isNegative = GetRandomInt(0, 1);
        return (isNegative == 1 ? -1 : 1) * Math.max(MEAT_AOE_MIN, GetRandomInt(0, MEAT_AOE));
    }

    private getBloodEffect(): string {
        const deltaPercent = this.timeElapsed / this.duration;
        const t = GetRandomReal(deltaPercent, deltaPercent * 2);
        if (this.toAlien) {
            return t > 0.5 ? SFX_ALIEN_BLOOD : SFX_HUMAN_BLOOD;
        }
        return t > 0.5 ? SFX_HUMAN_BLOOD : SFX_ALIEN_BLOOD;
    }

    private getRandomSFX() {
        return MEAT_SFX[GetRandomInt(0, MEAT_SFX.length-1)]
    }

    private bloodSplash(where: Vector3) {
        // Create a blood effect
        // CreateBlood(where.x, where.y);
        return true;
    }
    
    public destroy() {
        if (this.casterUnit && this.casterUnit.isAlive()) {

            const alienForce = PlayerStateFactory.getForce(ALIEN_FORCE_NAME) as AlienForce;
            const alien = alienForce.transform(this.casterUnit.owner, this.toAlien);
            if (!alien) return;

            // Select nearby units and scare 'em
            const scareGroup = CreateGroup();
            GroupEnumUnitsInRange(
                scareGroup, 
                this.casterUnit.x, 
                this.casterUnit.y,
                1800,
                FilterIsAlive(this.casterUnit.owner)
            );
            ForGroup(scareGroup, () => {
                const unit = GetEnumUnit();

                const pData = PlayerStateFactory.get(MapPlayer.fromHandle(GetOwningPlayer(unit)));
                const crewmember = pData.getCrewmember();
                const isCrew = crewmember && crewmember.unit.handle === unit;
                if (isCrew) {
                    crewmember.addDespair(new BuffInstanceDuration(this.casterUnit, 20));
                }
            });

            DestroyGroup(scareGroup);


            // If we have an existing order send it to the new unit
            if (this.previousOrder && this.previousOrderTarget) {
                IssuePointOrderById(alien.handle, this.previousOrder, this.previousOrderTarget.x, this.previousOrderTarget.y);
            }
            
            // If we are Alien Worm we need to go invisible for 1 second
            if (alien.typeId === WORM_ALIEN_FORM) {
                AddGhost(alien);
                const t = new Timer();
                t.start(2, false, () => RemoveGhost(alien));
            }

            // if (this.toAlien) {
            //     const group = CreateGroup();
            //     GroupEnumUnitsInRange(
            //         group, 
            //         this.casterUnit.x, 
            //         this.casterUnit.y,
            //         1200,
            //         FilterIsAlive(this.casterUnit.owner)
            //     );

            //     ForGroup(group, () => {
            //         const owningPlayer = MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit()));

            //         if (!PlayerStateFactory.isAlienAI(owningPlayer)) {
            //             ForceEntity.getInstance().aggressionBetweenTwoPlayers(
            //                 this.casterUnit.owner, 
            //                 owningPlayer
            //             );
            //         }
            //     });

            //     DestroyGroup(group);
            // }

            // Delete order trigger
            this.orderTrigger.destroy();
        }
        return true; 
    };
}