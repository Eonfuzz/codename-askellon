/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { ALIEN_FORCE_NAME, AlienForce } from "app/force/alien-force";
import { SMART_ORDER_ID } from "resources/ability-ids";
import { Trigger, Unit } from "w3ts";


const CREATE_SFX_EVERY = 0.06;
const MEAT_SFX = [
    "Abilities\\Weapons\\MeatwagonMissile\\MeatwagonMissile.mdl", 
    // "Units\\Undead\\Abomination\\AbominationExplosion.mdl",
];
const SFX_HUMAN_BLOOD = "Objects\\Spawnmodels\\Orc\\OrcLargeDeathExplode\\OrcLargeDeathExplode.mdl";
const SFX_ALIEN_BLOOD = "Objects\\Spawnmodels\\Undead\\UndeadLargeDeathExplode\\UndeadLargeDeathExplode.mdl";
const SFX_BLOOD_EXPLODE = "Units\\Undead\\Abomination\\AbominationExplosion.mdl";

const MEAT_AOE = 950;
const MEAT_AOE_MIN = 150;
const DURATION_TO_ALIEN = 2;
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

    public initialise(abMod: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());

        // Create order trigger to track last issued order
        this.orderTrigger.registerUnitEvent(this.casterUnit, EVENT_UNIT_ISSUED_POINT_ORDER);
        // this.orderTrigger.registerUnitEvent(this.casterUnit, EVENT_UNIT_ISSUED_TARGET_ORDER);
        this.orderTrigger.addCondition(Condition(() => GetIssuedOrderId() === SMART_ORDER_ID));
        this.orderTrigger.addAction(() => {
            this.previousOrder = GetIssuedOrderId();
            this.previousOrderTarget = new Vector2(GetOrderPointX(), GetOrderPointY());
        })
        return true;
    };

    public process(abMod: AbilityModule, delta: number) {
        this.timeElapsed += delta;
        this.timeElapsedSinceSFX += delta;

        if (this.timeElapsedSinceSFX >= CREATE_SFX_EVERY && this.casterUnit) {
            this.timeElapsedSinceSFX = 0;
            const tLoc = vectorFromUnit(this.casterUnit.handle);

            const unitHeight = abMod.game.getZFromXY(tLoc.x, tLoc.y);
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
            .onDeath((proj: Projectile) => { this.bloodSplash(proj.getPosition()) })
            .onCollide(() => true);

            projectile.addEffect(this.getRandomSFX(), new Vector3(0, 0, 0), newTarget.subtract(startLoc).normalise(), 1);

            const bloodSfx = AddSpecialEffect(this.getBloodEffect(), startLoc.x, startLoc.y);
            BlzSetSpecialEffectZ(bloodSfx, startLoc.z - 30);
            DestroyEffect(bloodSfx);

            abMod.game.weaponModule.addProjectile(projectile);
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
        // const bloodSfx = AddSpecialEffect(SFX_BLOOD_EXPLODE, where.x, where.y);
        // BlzSetSpecialEffectZ(bloodSfx, where.z - 30);
        // DestroyEffect(bloodSfx);
    }
    
    public destroy(abMod: AbilityModule) {
        if (this.casterUnit) {

            const alienForce = abMod.game.forceModule.getForce(ALIEN_FORCE_NAME) as AlienForce;
            const alien = alienForce.transform(abMod.game, this.casterUnit.owner, this.toAlien);

            // If we have an existing order send it to the new unit
            if (this.previousOrder && this.previousOrderTarget) {
                IssuePointOrderById(alien.handle, this.previousOrder, this.previousOrderTarget.x, this.previousOrderTarget.y);
            }
            
            // Delete order trigger
            this.orderTrigger.destroy();
        }
        return true; 
    };
}