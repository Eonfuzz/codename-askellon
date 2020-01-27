import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { Log } from "../../../lib/serilog/serilog";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { FilterIsEnemyAndAlive } from "../../../resources/filters";

/** @noSelfInFile **/
const DAMAGE_PER_SECOND = 100;
const ABILITY_SLOW_ID = FourCC('A00B');

const MISSILE_SPEED = 400;
const MISSILE_ARC_HEIGHT = 800;
const MISSILE_LAUNCH_SFX = 'Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl';
const MISSILE_SFX = 'Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl';

const POOL_SFX = 'war3mapImported\\ToxicField.mdx';
const POOL_DURATION = 6;
const POOL_AREA = 350;

export class AcidPoolAbility implements Ability {

    private casterUnit: unit | undefined;
    private targetLoc: Vector3 | undefined;
    private timeElapsed: number;

    private poolLocation: Vector3 | undefined;
    private sfx: effect | undefined;

    private castingPlayer: player | undefined;
    private damageGroup = CreateGroup();

    // Used for optimisation
    private lastDelta = 0;
    private checkForSlowEvery = 0.3;
    private timeElapsedSinceLastSlowCheck = 0.5;

    constructor() {
        this.timeElapsed = 0;
    }

    public initialise(module: AbilityModule) {
        this.casterUnit = GetTriggerUnit();
        this.targetLoc =  new Vector3(GetSpellTargetX(), GetSpellTargetY(), 0);
        this.targetLoc.z = module.game.getZFromXY(this.targetLoc.x, this.targetLoc.y);
        this.castingPlayer = GetOwningPlayer(this.casterUnit);

        const polarPoint = vectorFromUnit(this.casterUnit).applyPolarOffset(GetUnitFacing(this.casterUnit), 80);
        const startLoc = new Vector3(polarPoint.x, polarPoint.y, 30);

        const deltaTarget = this.targetLoc.subtract(startLoc);
        

        const projectile = new Projectile(
            this.casterUnit,
            startLoc,
            new ProjectileTargetStatic(deltaTarget),
            new ProjectileMoverParabolic(startLoc, this.targetLoc, Deg2Rad(GetRandomReal(30,70)))
        )
        .onDeath((proj: Projectile) => { this.createPool(proj.getPosition()); })
        .onCollide(() => true);

        projectile.addEffect(MISSILE_SFX, new Vector3(0, 0, 0), deltaTarget.normalise(), 1);

        const sfx = AddSpecialEffect(MISSILE_LAUNCH_SFX, polarPoint.x, polarPoint.y);
        BlzSetSpecialEffectHeight(sfx, -30);
        DestroyEffect(sfx);

        module.game.weaponModule.addProjectile(projectile);

        return true;
    };

    private createPool(atWhere: Vector3) {
        this.poolLocation = atWhere;
        this.sfx = AddSpecialEffect(POOL_SFX, atWhere.x, atWhere.y);
        BlzSetSpecialEffectTimeScale(this.sfx, 0.01);
        BlzSetSpecialEffectScale(this.sfx, 1.3);
    }

    public process(abMod: AbilityModule, delta: number) {

        if (this.poolLocation && this.castingPlayer) {
            this.timeElapsed += delta;
            this.timeElapsedSinceLastSlowCheck += delta;
            GroupEnumUnitsInRange(
                this.damageGroup, 
                this.poolLocation.x, 
                this.poolLocation.y,
                POOL_AREA,
                FilterIsEnemyAndAlive(this.castingPlayer)
            );
            this.lastDelta = delta;

            ForGroup(this.damageGroup, () => this.damageUnit());
            if (this.timeElapsedSinceLastSlowCheck >= this.checkForSlowEvery) {
                ForGroup(this.damageGroup, () => this.slowUnit(abMod));
                this.timeElapsedSinceLastSlowCheck = 0;
            }
        }

        return this.timeElapsed < POOL_DURATION;
    };

    private damageUnit() {
        if (this.casterUnit) {
            const unit = GetEnumUnit();
            UnitDamageTarget(this.casterUnit, 
                unit, 
                DAMAGE_PER_SECOND * this.lastDelta, 
                true, 
                true, 
                ATTACK_TYPE_MAGIC, 
                DAMAGE_TYPE_ACID, 
                WEAPON_TYPE_WHOKNOWS
            );
        }
    }

    private slowUnit(abMod: AbilityModule) {
        // Log.Information("Applying slow!");

        const unit = GetEnumUnit();
        abMod.game.useDummyFor((dummy: unit) => {
            SetUnitX(dummy, GetUnitX(unit));
            SetUnitY(dummy, GetUnitY(unit) + 50);
            IssueTargetOrder(dummy, 'slow', GetEnumUnit());
        }, ABILITY_SLOW_ID);
    }
    
    public destroy(module: AbilityModule) { 
        // Log.Information("Ending");
        this.sfx && BlzSetSpecialEffectTimeScale(this.sfx, 10);
        this.sfx && DestroyEffect(this.sfx);

        DestroyGroup(this.damageGroup);

        return true; 
    };
}