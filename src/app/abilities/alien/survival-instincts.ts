import { AbilityWithDone } from "../ability-type";
import { vectorFromUnit } from "../../types/vector2";
import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "../../weapons/projectile/projectile-target";
import { Trigger, Unit, Timer, MapPlayer } from "w3ts";
import { getZFromXY, AddGhost, RemoveGhost, CreateBlood } from "lib/utils";
import { FilterIsAlive } from "resources/filters";
import { ForceEntity } from "app/force/force-entity";
import { WeaponEntity } from "app/weapons/weapon-entity"
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_MINION_SWARMLING } from "resources/unit-ids";
import { WorldEntity } from "app/world/world-entity";
import { BUFF_ID_REGENERATION } from "resources/buff-ids";


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
const DURATION_TO_HUMAN = 0.5;

export class SurvivalInstinctsAbility extends AbilityWithDone {

    private timeElapsed: number = 0;
    private timeElapsedSinceSFX: number = CREATE_SFX_EVERY;

    private duration: number  = DURATION_TO_HUMAN;

    public init() {
        super.init();

        const group = CreateGroup();
        GroupEnumUnitsInRange(
            group, 
            this.casterUnit.x, 
            this.casterUnit.y,
            1200,
            FilterIsAlive(this.casterUnit.owner)
        );

        ForGroup(group, () => {
            ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                this.casterUnit.owner, 
                MapPlayer.fromHandle(GetOwningPlayer(GetEnumUnit()))
            );
        });

        DestroyGroup(group);

        return true;
    };

    public step(delta: number) {
        this.timeElapsed += delta;
        this.timeElapsedSinceSFX += delta;

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

        if (this.timeElapsed > this.duration) {
            this.done = true;
        }
    };

    private getRandomOffset(): number {
        const isNegative = GetRandomInt(0, 1);
        return (isNegative == 1 ? -1 : 1) * Math.max(MEAT_AOE_MIN, GetRandomInt(0, MEAT_AOE));
    }

    private getBloodEffect(): string {
        const deltaPercent = this.timeElapsed / this.duration;
        const t = GetRandomReal(deltaPercent, deltaPercent * 2);
        return t > 0.5 ? SFX_HUMAN_BLOOD : SFX_ALIEN_BLOOD;
    }

    private getRandomSFX() {
        return MEAT_SFX[GetRandomInt(0, MEAT_SFX.length-1)]
    }

    private bloodSplash(where: Vector3) {
        const zone = WorldEntity.getInstance().getPointZone(where.x, where.y);   
        if (zone) {
            CreateUnit(PlayerStateFactory.AlienAIPlayer1.handle, ALIEN_MINION_SWARMLING, where.x, where.y, GetRandomReal(0, 360));
            UnitApplyTimedLife(GetLastCreatedUnit(), BUFF_ID_REGENERATION, 15);
        }
        return true;
    }
    
    public destroy() {
        if (this.casterUnit) {

            AddGhost(this.casterUnit);

            const t = new Timer();
            t.start(2, false, () => {
                RemoveGhost(this.casterUnit);
                t.destroy();
            });
        }
        return true; 
    };
}