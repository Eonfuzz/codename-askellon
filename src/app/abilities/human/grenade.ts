import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";

/** @noSelfInFile **/
const EXPLOSION_BASE_DAMAGE = 100;
const EXPLOSION_AOE = 200;
const ABILITY_GRENADE_LAUNCH = FourCC('A00B');

const MISSILE_LAUNCH_SFX = 'Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl';
const MISSILE_SFX = 'Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl';


export class GrenadeLaunchAbility implements Ability {

    private casterUnit: unit | undefined;
    private targetLoc: Vector3 | undefined;

    private castingPlayer: player | undefined;
    private damageGroup = CreateGroup();

    constructor() {}

    public initialise(module: AbilityModule) {
        this.casterUnit = GetTriggerUnit();
        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = module.game.getZFromXY(this.targetLoc.x, this.targetLoc.y);
        this.castingPlayer = GetOwningPlayer(this.casterUnit);

        const polarPoint = vectorFromUnit(this.casterUnit).applyPolarOffset(GetUnitFacing(this.casterUnit), 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, module.game.getZFromXY(polarPoint.x, polarPoint.y)+30);

        const deltaTarget = this.targetLoc.subtract(startLoc);       

        const projectile = new Projectile(
            this.casterUnit,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(GetRandomReal(15,30)))
        )
        .onDeath((proj: Projectile) => { this.explode(proj.getPosition()); })
        .onCollide(() => true);

        projectile.addEffect(MISSILE_SFX, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        const sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y);
        BlzSetSpecialEffectHeight(sfx, -30);
        DestroyEffect(sfx);

        module.game.weaponModule.addProjectile(projectile);

        return true;
    };

    private explode(atWhere: Vector3) {
        if (this.castingPlayer) {
            GroupEnumUnitsInRange(
                this.damageGroup, 
                atWhere.x, 
                atWhere.y,
                EXPLOSION_AOE,
                FilterIsEnemyAndAlive(this.castingPlayer)
            );
            ForGroup(this.damageGroup, () => this.damageUnit());
        }
    }

    public process(abMod: AbilityModule, delta: number) {
        return true;
    };

    private damageUnit() {
        if (this.casterUnit) {
            const unit = GetEnumUnit();
            UnitDamageTarget(this.casterUnit, 
                unit, 
                EXPLOSION_BASE_DAMAGE, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
        }
    }

    public destroy(module: AbilityModule) { 
        DestroyGroup(this.damageGroup);
        return true; 
    };
}