import { AbilityWithDone } from "../ability-type";
import { Unit } from "w3ts/index";
import { FilterIsAlive } from "resources/filters";
import { Log } from "lib/serilog/serilog";
import { ForceEntity } from "app/force/force-entity";
import { ChatEntity } from "app/chat/chat-entity";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { WeaponEntityAttackType } from "app/weapons/weapon-attack-type";

export class NeuralTakeoverAbility extends AbilityWithDone {
    
    public init() {
        super.init();
        let unit: Unit;
        let caster = Unit.fromHandle(GetTriggerUnit());

        const findGroup = CreateGroup();
        GroupEnumUnitsInRange(findGroup, caster.x, caster.y, 10, FilterIsAlive(caster.owner));
        ForGroup(findGroup, () => {
            if (!unit) unit = Unit.fromHandle(GetEnumUnit());
        });

        // We have the neighbouring unit
        if (unit && ForceEntity.getInstance().canFight(caster.owner, unit.owner)) {
            const targetLoc = InputManager.getLastMouseCoordinate(caster.owner.handle);
            

            GroupEnumUnitsInRange(findGroup, caster.x, caster.y, 2500, FilterIsAlive(caster.owner));
            ForGroup(findGroup, () => {
                let u = Unit.fromHandle(GetEnumUnit());
                ForceEntity.getInstance().aggressionBetweenTwoPlayers(unit.owner, u.owner);
            });

            // The magic number gun order
            // IssuePointOrderById(unit.handle, 852663, targetLoc.x, targetLoc.y);
            const pData = PlayerStateFactory.get(unit.owner.id);
            const attackType = pData ? pData.getAttackType() : WeaponEntityAttackType.ATTACK;
            if (attackType === WeaponEntityAttackType.CAST) {
                IssuePointOrder(unit.handle, "shockwave", targetLoc.x, targetLoc.y);
            }
            else if (attackType === WeaponEntityAttackType.SMART) {
                InputManager.setLastMouseCoordinate(unit.owner.handle, targetLoc);
                IssueImmediateOrder(unit.handle, "shockwave");
            }
            else if (attackType === WeaponEntityAttackType.ATTACK) {
                let target: Unit;
                GroupEnumUnitsInRange(findGroup, targetLoc.x, targetLoc.y, 250, FilterIsAlive(caster.owner));
                ForGroup(findGroup, () => {
                    target = Unit.fromHandle(GetEnumUnit());
                });

                if (target) {
                    IssueTargetOrder(unit.handle, "attack", target.handle);
                }
            }
        }
        else {
            ChatEntity.getInstance().postMessage(caster.owner, "Alien", "Can't interface with another alien");
        }

        DestroyGroup(findGroup);
        this.done = true;
        return true;
    };

    
    public step(delta: number) {
        return false;
    }

    public destroy() {
        return true;
    }
}