import { Vector3 } from "../../types/vector3";
import { Vector2, vectorFromUnit } from "../../types/vector2";
import { BURST_RIFLE_EXTENDED, BURST_RIFLE_ITEM, MINIGUN_EXTENDED, MINIGUN_ITEM } from "../../../resources/weapon-tooltips";
import { ArmableUnit, ArmableUnitWithItem } from "./unit-has-weapon";
import { getZFromXY, terrainIsPathable } from "lib/utils";
import { MapPlayer, Force, Timer, Unit, Effect } from "w3ts/index";
import { SoundRef } from "app/types/sound-ref";
import { ABIL_WEP_MINIGUN, ABIL_WEP_NEOKATANA } from "resources/ability-ids";
import { ITEM_WEP_MINIGUN } from "resources/item-ids";
import { GunItem } from "./gun-item";
import { Timers } from "app/timer-type";
import { getYawPitchRollFromVector } from "lib/translators";
import { FilterIsAlive } from "resources/filters";
import { ForceEntity } from "app/force/force-entity";

export class WepNeokatana extends GunItem {

    private slashSound = new SoundRef("Sounds\\Slash.mp3", false);
    private slashSound2 = new SoundRef("Sounds\\Slash.mp3", false);
    private thunder1 = new SoundRef("Sounds\\Thunder1.mp3", false);
    private thunder2 = new SoundRef("Sounds\\Thunder2.mp3", false);
    
    gunPath = "Weapons\\MarineKatana.mdx";
    sfx = "Models\\sfx\\animeslashfinal.mdx";

    private castOrderId: number;
    private targetLoc: Vector3;

    private timer: Timer;
    private durationElapsed: number;
    private hasSlashed1 = false;
    private hasSlashed2 = false;

    constructor(item: item, equippedTo: ArmableUnitWithItem) {
        super(item, equippedTo);
        // Define spread and bullet distance
        this.spreadAOE = 375;
        this.bulletDistance = 30;
    }

    public applyWeaponAttackValues(unit: Unit) {
        this.equippedTo.unit.setBaseDamage(this.getDamage(unit) - 1, 0);
        unit.acquireRange = 128;
        BlzSetUnitWeaponRealField(this.equippedTo.unit.handle, UNIT_WEAPON_RF_ATTACK_RANGE, 1, 128);
        BlzSetUnitWeaponIntegerField(this.equippedTo.unit.handle, UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE, 0, 2);
        unit.setAttackCooldown( 
            BlzGetAbilityCooldown(this.getAbilityId(), unit.getAbilityLevel(this.getAbilityId())), 
            0
        );
    }
    
    public onShoot(unit: Unit, targetLocation: Vector3): void {
        super.onShoot(unit, targetLocation);

        unit.setTimeScale(1.3);
        Timers.addTimedAction(0, () => unit.setAnimation(11));

        this.castOrderId = unit.currentOrder;
        this.slashSound.playSoundOnUnit(unit.handle, 20);
        this.thunder1.playSoundOnUnit(unit.handle, 50);

        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);
        this.targetLoc = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);
        let movement = targetDistance.normalise().multiplyN(900);

        const rotData = getYawPitchRollFromVector(new Vector3(targetDistance.x, targetDistance.y, 0));
        unit.pauseEx(true);

        const sfx = new Effect(this.sfx, this.targetLoc.x, this.targetLoc.y);
        sfx.scale = 1.2;
        sfx.setTimeScale(0.6);
        sfx.setColor(50, 255, 100);
        sfx.z = getZFromXY(this.targetLoc.x, this.targetLoc.y) + 100;
        
        sfx.setYaw(rotData.yaw + -50 * bj_DEGTORAD);
        sfx.setRoll(rotData.roll+ 180 * bj_DEGTORAD);
        sfx.setPitch(rotData.pitch);
        sfx.destroy();
        
        this.hasSlashed1 = false;
        this.hasSlashed2 = false;

        
        this.timer = new Timer();
        this.durationElapsed = 0;

        this.timer.start(0.03, true, () => {
            const nX = unit.x + movement.x * 0.03;
            const nY = unit.y + movement.y * 0.03;
            this.durationElapsed += 0.03;

            if (this.durationElapsed > 0.3 && !this.hasSlashed1) {
                this.hasSlashed1 = true;
                // Deal slash damage
                this.doSlashDamage();
            }
            else if (this.durationElapsed > 4.3 && !this.hasSlashed2) {
                this.hasSlashed2 = true;
                // Deal slash damage
                this.doSlashDamage();
            }

            if (terrainIsPathable(nX, nY)) {
                unit.x = nX;
                unit.y = nY;
                movement = movement.multiplyN(0.9);
            }
        });

        Timers.addTimedAction(0.4, () => {
            this.secondSlash(unit, targetLocation, rotData);
            unit.setTimeScale(1);
            unit.pauseEx(false);
            Timers.addTimedAction(0.3, () => {
                this.timer.pause();
                this.timer.destroy();
            });
        });
    };

    public secondSlash(unit: Unit, targetLocation: Vector3, rotData: any) {

        let casterLoc = new Vector3(unit.x, unit.y, getZFromXY(unit.x, unit.y)).projectTowardsGunModel(unit.handle);
        let targetDistance = new Vector2(targetLocation.x - casterLoc.x, targetLocation.y - casterLoc.y).normalise().multiplyN(this.bulletDistance);
        this.targetLoc = new Vector3(targetDistance.x + casterLoc.x, targetDistance.y + casterLoc.y, targetLocation.z);

        this.slashSound2.playSoundOnUnit(unit.handle, 20);
        this.thunder2.playSoundOnUnit(unit.handle, 50);
        const sfx = new Effect(this.sfx, this.targetLoc.x, this.targetLoc.y);
        sfx.scale = 1;
        sfx.setTimeScale(0.6);
        sfx.setColor(50, 255, 100);
        sfx.z = getZFromXY(this.targetLoc.x, this.targetLoc.y) + 100;
        
        sfx.setYaw(rotData.yaw + -50 * bj_DEGTORAD);
        sfx.setRoll(rotData.roll + 25 * bj_DEGTORAD);
        sfx.setPitch(rotData.pitch);
        sfx.destroy();
    }

    private searchGroup = CreateGroup();
    private doSlashDamage() {
        if (this.equippedTo && this.equippedTo.unit) {
            const radius = 120;
            const u = this.equippedTo.unit;
            const uLoc = Vector3.fromWidget(u.handle);
            const posLoc = uLoc.projectTowards2D(u.facing - 30, radius);

            // Now group all units infront and deal damage
            GroupEnumUnitsInRange(
                this.searchGroup, 
                posLoc.x, 
                posLoc.y,
                radius,
                FilterIsAlive(u.owner)
            );
            ForGroup(this.searchGroup, () => {
                const unit = GetEnumUnit();
                const p = MapPlayer.fromHandle(GetOwningPlayer(unit));
                if (!ForceEntity.getInstance().aggressionBetweenTwoPlayers(u.owner, p)) return;
                // damage unit by 35
                UnitDamageTarget(u.handle, 
                    unit, 
                    this.getDamage(u), 
                    true, 
                    true, 
                    ATTACK_TYPE_MAGIC, 
                    DAMAGE_TYPE_ACID, 
                    WEAPON_TYPE_WHOKNOWS
                );
            });
        }
    }

    public onAdd(caster: ArmableUnitWithItem) {
        super.onAdd(caster);        
        this.equippedTo.unit.addAnimationProps("swim", true);
    }

    public onRemove() {
        this.equippedTo.unit.addAnimationProps("swim", false);
        super.onRemove();
    }

    protected getTooltip(unit: Unit) {
        const damage = this.getDamage(unit);
        const newTooltip = MINIGUN_EXTENDED(this, damage);
        return newTooltip;
    }

    protected getItemTooltip(unit: Unit): string {
        const damage = this.getDamage(unit);
        return MINIGUN_ITEM(this, damage);
    }


    public getDamage(unit: Unit): number {
        return MathRound( 56 * this.getDamageBonusMult());
    }

    public getAbilityId() { return ABIL_WEP_NEOKATANA; }
    public getItemId() { return ITEM_WEP_MINIGUN; }
}