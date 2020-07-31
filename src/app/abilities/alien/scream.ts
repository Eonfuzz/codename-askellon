/** @noSelfInFile **/
import { Ability } from "../ability-type";
import { SoundRef } from "app/types/sound-ref";
import { Unit } from "w3ts/index";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { ForceEntity } from "app/force/force-entity";
import { WorldEntity } from "app/world/world-entity";

const screamSound =new SoundRef("Sounds\\Nazgul.wav", false, true);

export class ScreamAbility implements Ability {
    casterUnit: Unit;

    constructor() {}

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        return true;
    };

    public process(delta: number) {

        const world = WorldEntity.getInstance();
        // Get out current unit's zone
        const zone = world.getUnitZone(this.casterUnit);
        const pInZone = zone.getPlayersInZone();
        pInZone.forEach(player => {
            const pData = ForceEntity.getInstance().getPlayerDetails(player);
            if (pData && pData.getCrewmember()) {
                const crew = pData.getCrewmember();
                if (crew && crew.unit.isAlive()) {
                    crew.addDespair(new BuffInstanceDuration(this.casterUnit, 30));
                    if (GetLocalPlayer() === pData.player.handle) {
                        screamSound.playSound();
                    }
                    PingMinimapForPlayer(this.casterUnit.owner.handle, crew.unit.x, crew.unit.y, 5);
                }
            }
        });
        return false;
    };
    
    public destroy() {
        return true; 
    };
}