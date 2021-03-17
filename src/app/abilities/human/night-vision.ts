import { Ability } from "../ability-type";
import { MapPlayer, Unit } from "w3ts";
import { VISION_TYPE } from "app/vision/vision-type";
import { WorldEntity } from "app/world/world-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { VisionFactory } from "app/vision/vision-factory";
import { FilterAnyUnit } from "../../../resources/filters";
import { SoundRef } from "app/types/sound-ref";
import { SOUND_STR_SONIC_RES } from "resources/sounds";
import { Vector2, vectorFromUnit } from "../../types/vector2";

const DURATION = 25;
const RADIUS = 1200;
const REFRESH_RATE = 1;
const DESTRUCT_ID = FourCC('B010');

export class NightVisionAbility implements Ability {

    private oldVis: VISION_TYPE = VISION_TYPE.HUMAN;

    private casterUnit: Unit | undefined;
    private castingPlayer: MapPlayer | undefined;
    private checkMovementGroup = CreateGroup();
    private refreshTime = REFRESH_RATE;
    private locationData = [];
    private destructableList = [];
    private destructableListMax = 0;
    private remainingDuration = DURATION;
    private locallyVisible: boolean;
    private sound = new SoundRef(SOUND_STR_SONIC_RES, false, false);

    constructor() {}

    public initialise() {
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.castingPlayer = this.casterUnit.owner;
        this.locallyVisible = GetTriggerPlayer() == GetLocalPlayer();
        this.sound.playSoundOnUnit(this.casterUnit.handle, 127, true);
        const z = WorldEntity.getInstance().getUnitZone(this.casterUnit);
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.casterUnit);
        if (z && crew) {
            this.oldVis = VisionFactory.getInstance().getPlayerVision(this.castingPlayer);
            VisionFactory.getInstance().setPlayervision(this.castingPlayer, VISION_TYPE.NIGHT_VISION);
            z.onEnter(this.casterUnit);
        }
        return true;
    };

    public process(delta: number) {
        if (this.refreshTime >= REFRESH_RATE) {
            this.removeDestructables();
            this.refreshTime = 0;
            
            //Create a temporary group using the units within the effect radius
            let tempGroup = CreateGroup();
            GroupEnumUnitsInRange(
                    tempGroup, 
                    this.casterUnit.x, 
                    this.casterUnit.y, 
                    RADIUS, 
                    FilterAnyUnit()
            );
            
            //Compare temporary group with previous temporary group and delete location data for units
            //no longer in range
            ForGroup(this.checkMovementGroup, () => {
                const enumUnit = GetEnumUnit();
                GroupRemoveUnit(this.checkMovementGroup, enumUnit);
                if (IsUnitInGroup(enumUnit, tempGroup) == false) {
                    delete this.locationData[Unit.fromHandle(enumUnit).id];
                }
                return true;
            });
            
            //Go thru the temporary group and see if they are NOT visible and moving. If both conditions are met
            //create the destructable visible only to the casting player
            //then update unit location data and add them to the checkMovementGroup
            ForGroup(tempGroup, () => {
                const enumUnit: Unit = Unit.fromEnum();
                if (!BlzIsUnitInvulnerable(enumUnit.handle) && !IsUnitVisible(enumUnit.handle,this.castingPlayer.handle)) {
                    GroupAddUnit(this.checkMovementGroup,enumUnit.handle);
                    let vec = vectorFromUnit(enumUnit.handle)
                    if (this.locationData[enumUnit.id] != null && (this.locationData[enumUnit.id].x != vec.x || this.locationData[enumUnit.id].y != vec.y)){
                        let tempDestructable = CreateDestructable(DESTRUCT_ID, enumUnit.x, enumUnit.y, 270, 1, 0);
                        ShowDestructable(tempDestructable, this.locallyVisible);
                        this.destructableList[this.destructableListMax] = tempDestructable;
                        this.destructableListMax++;
                    }
                    this.locationData[enumUnit.id] = vec;
                }
                return true;
            });
            DestroyGroup(tempGroup);
        }
        else {
            this.refreshTime += delta;
        }
        this.remainingDuration -= delta;
        return this.remainingDuration > 0;
    };

    public removeDestructables() {
        for (let i = 0; i < this.destructableListMax; ++i) {
            RemoveDestructable(this.destructableList[i]);
        };
        this.destructableListMax = 0;
        return true;
    };

    public destroy() { 
        DestroyGroup(this.checkMovementGroup);
        this.removeDestructables();
        this.sound.destroy();
        if (this.casterUnit) {
            const z = WorldEntity.getInstance().getUnitZone(this.casterUnit);
            const crew = CrewFactory.getInstance().getCrewmemberForUnit(this.casterUnit);
            if (z && crew) {
                VisionFactory.getInstance().setPlayervision(this.castingPlayer, this.oldVis);
                z.onEnter(this.casterUnit);
            }
        }
        return true; 
    };

}