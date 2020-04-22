import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";
import { MapPlayer, Unit } from "w3ts";
import { getZFromXY } from "lib/utils";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance";

/** @noSelfInFile **/
const EXPLOSION_BASE_DAMAGE = 20;
const EXPLOSION_AOE = 300;
const MISSILE_LAND_SFX = 'Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl'
const MISSILE_SFX = 'war3mapImported\\Chain Grenade Blue.mdx';


export class CryoGrenadeAbility implements Ability {

    private casterUnit: Unit | undefined;
    private targetLoc: Vector3 | undefined;

    private castingPlayer: MapPlayer | undefined;
    private damageGroup = CreateGroup();

    constructor() {}

    public initialise(module: AbilityModule) {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.castingPlayer = this.casterUnit.owner;

        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = module.game.getZFromXY(this.targetLoc.x, this.targetLoc.y);

        const polarPoint = vectorFromUnit(this.casterUnit.handle).applyPolarOffset(this.casterUnit.facing, 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, module.game.getZFromXY(polarPoint.x, polarPoint.y)+30);

        const deltaTarget = this.targetLoc.subtract(startLoc);       

        const projectile = new Projectile(
            this.casterUnit.handle,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(45))
        )
        .onDeath((proj: Projectile) => { this.explode(module, proj.getPosition()); })
        .onCollide(() => true);

        projectile.addEffect(MISSILE_SFX, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        module.game.weaponModule.addProjectile(projectile);

        return true;
    };

    private explode(module: AbilityModule, atWhere: Vector3) {
        let sfx = AddSpecialEffect(MISSILE_LAND_SFX, atWhere.x, atWhere.y);
        BlzSetSpecialEffectZ(sfx, getZFromXY(atWhere.x, atWhere.y));
        DestroyEffect(sfx);

        if (this.castingPlayer) {
            GroupEnumUnitsInRange(
                this.damageGroup, 
                atWhere.x, 
                atWhere.y,
                EXPLOSION_AOE,
                FilterIsEnemyAndAlive(this.castingPlayer)
            );
            ForGroup(this.damageGroup, () => this.damageUnit(module));
        }
    }

    public process(abMod: AbilityModule, delta: number) {
        return true;
    };

    private damageUnit(module: AbilityModule) {
        if (this.casterUnit) {
            const unit = GetEnumUnit();
            const crew = module.game.crewModule.getCrewmemberForUnit(Unit.fromHandle(unit));
            let damageMult = 1;
            if (crew) damageMult = crew.getDamageBonusMult();

            module.game.buffModule.addBuff(
                BUFF_ID.FLASH_FREEZE, 
                Unit.fromHandle(unit), 
                new BuffInstanceDuration(Unit.fromHandle(unit), module.game.getTimeStamp(), 10)
            );
            
            UnitDamageTarget(this.casterUnit.handle, 
                unit, 
                EXPLOSION_BASE_DAMAGE * damageMult, 
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