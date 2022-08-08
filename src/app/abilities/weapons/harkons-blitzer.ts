import { Vector3 } from "../../types/vector3";
import { Projectile } from "../../weapons/projectile/projectile";
import { ProjectileTargetStatic } from "../../weapons/projectile/projectile-target";
import { MapPlayer, Unit } from "w3ts";
import { getPointsInRangeWithSpread, getZFromXY } from "lib/utils";
import { SFX_SHOCKWAVE } from "resources/sfx-paths";
import { PlayNewSoundOnUnit } from "lib/translators";
import { Timers } from "app/timer-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { ForceEntity } from "app/force/force-entity";
import { GunAbility } from "./gun-ability";

export class HarkonsBlitzerAbility extends GunAbility {

    private targetLoc: Vector3 | undefined;

    private castingPlayer: MapPlayer | undefined;
    private damageGroup = CreateGroup();
    private unitsHit = new Map<number, number>();

    private spreadAOE = 240;
    private bulletDistance = 240;
    
    constructor(isSecondaryAbility: boolean = false) {
        super();
    }

    public init() {
        super.init();

        this.castingPlayer = this.casterUnit.owner;
        this.targetLoc =  new Vector3(this.targetLocation.x, this.targetLocation.y, 0);
        this.targetLoc.z = getZFromXY(this.targetLoc.x, this.targetLoc.y);

        const casterLoc = Vector3.fromWidget(this.casterUnit.handle)
            .projectTowardsGunModel(this.casterUnit.handle);


        // Clear units hit
        this.unitsHit.clear();

        const sound = PlayNewSoundOnUnit("Sounds\\ShotgunShoot.mp3", this.casterUnit, 50);
        const NUM_BULLETS = 6;

        const angleDeg = casterLoc.angle2Dto(this.targetLoc);

        const deltaLocs = getPointsInRangeWithSpread(
            angleDeg - 18,
            angleDeg + 18,
            NUM_BULLETS,
            this.bulletDistance,
            1.3
        );

        const centerTargetLoc = casterLoc.projectTowards2D(angleDeg, this.bulletDistance*1.9);
        centerTargetLoc.z = getZFromXY(centerTargetLoc.x, centerTargetLoc.y);

        // Do nothing if the central projectile hits
        this.fireProjectile(casterLoc, centerTargetLoc, true);
        
        deltaLocs.forEach((loc, index) => {
            const nX = casterLoc.x + loc.x;
            const nY = casterLoc.y + loc.y;
            const targetLoc = new Vector3(nX, nY, getZFromXY(nX, nY));
            this.fireProjectile(casterLoc, targetLoc, false)
        });

        Timers.addTimedAction(1.6, () => PlayNewSoundOnUnit("Sounds\\ShotgunPump.wav", this.casterUnit, 30));

        return true;
    }
    
    public step(delta: number) {
        return true;
    };

    
    private fireProjectile(casterLoc: Vector3, targetLocation: Vector3, isCentralProjectile: boolean): void {

        let deltaTarget = targetLocation.subtract(casterLoc);

        let projectile = new Projectile(
            this.casterUnit.handle,
            casterLoc, 
            new ProjectileTargetStatic(deltaTarget)
        );
        
        BlzSetSpecialEffectAlpha(projectile.addEffect(
            isCentralProjectile ? SFX_SHOCKWAVE : "war3mapImported\\Bullet.mdx",
            new Vector3(0, 0, 0),
            deltaTarget.normalise(),
            isCentralProjectile ? 0.6 : 1.4
        ), 100);

        projectile
            .setCollisionRadius(20)
            .setVelocity(isCentralProjectile ? 2400 : 2250)
            .onCollide((projectile: Projectile, collidesWith: unit) => {
                this.onProjectileCollide(projectile, collidesWith);
            });
        
        EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: this.casterUnit, data: { projectile }});
    }

    private onProjectileCollide(projectile: Projectile, collidesWith: unit) {
        projectile.setDestroy(true);
        
        const timesUnitHit = this.unitsHit.get(GetHandleId(collidesWith)) || 0;
        this.unitsHit.set(GetHandleId(collidesWith), timesUnitHit + 1);

        const damage = this.getDamage(this.casterUnit) / Pow(1.25, timesUnitHit);
        UnitDamageTarget(
            projectile.source, 
            collidesWith, 
            damage, 
            false, 
            true, 
            ATTACK_TYPE_PIERCE, 
            DAMAGE_TYPE_NORMAL, 
            WEAPON_TYPE_WOOD_MEDIUM_STAB
        );
        ForceEntity.getInstance().aggressionBetweenTwoPlayers(this.casterUnit.owner, MapPlayer.fromHandle(GetOwningPlayer(collidesWith)));
    }

    public getDamage(unit: Unit): number {
        return MathRound(35 * this.getDamageBonusMult());
    }

    public destroy() { 
        DestroyGroup(this.damageGroup);
        return true; 
    };
}
