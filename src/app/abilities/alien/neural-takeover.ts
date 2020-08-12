import { Ability } from "../ability-type";
import { Unit } from "w3ts/index";
import { FilterIsAlive } from "resources/filters";
import { Log } from "lib/serilog/serilog";
import { ForceEntity } from "app/force/force-entity";
import { ChatEntity } from "app/chat/chat-entity";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";

export class NeuralTakeoverAbility implements Ability {
    
    public initialise() {
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
            IssuePointOrder(unit.handle, "shockwave", targetLoc.x, targetLoc.y);
        }
        else {
            ChatEntity.getInstance().postMessage(caster.owner, "Alien", "Can't interface with another alien");
        }

        DestroyGroup(findGroup);
        return true;
    };

    
    public process(delta: number) {
        return false;
    }

    public destroy() {
        return true;
    }
}