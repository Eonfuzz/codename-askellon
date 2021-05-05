import { Effect, Unit } from "w3ts/index";
import { Timers } from "app/timer-type";
import { Log } from "lib/serilog/serilog";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { Vector2 } from "app/types/vector2";
import { SoundRef } from "app/types/sound-ref";
import { ZONE_TYPE } from "app/world/zone-id";
import { WorldEntity } from "app/world/world-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { COL_MISC } from "resources/colours";
import { PlayerState } from "app/force/player-type";
import { PlayNewSoundOnUnit } from "lib/translators";
import { SOUND_STR_ATTACH, SOUND_STR_SONIC_RES } from "resources/sounds";
import { SFX_WEAK_SHIELD } from "resources/sfx-paths";
import { getZFromXY } from "lib/utils";

const PATHING_BLOCKER_BOTH = FourCC('YTfb');

export class Door {

    public unit: Unit;
    public isOpen: boolean;
    public isDead: boolean = false;
    public isPowered: boolean = true;

    // Can the door receive update requests?
    private canUpdate: boolean = true;
    private pathingBlockers: destructable[] = [];

    // TODO
    private lockedFor = 0;
    private width = 600;
    // How much of the width can open
    private openableWidth = 450;
    private pathingTileSize = 32;

    private doorOpenSound = new SoundRef("Sounds\\DoorOpen.wav", false, false);
    private doorCloseSound = new SoundRef("Sounds\\DoorClose.wav", false, false);

    private doorFloor: ZONE_TYPE;

    constructor(unit: Unit, isOpen = false) {
        this.unit = unit,
        this.isOpen = isOpen;
        this.updatingPathingBlockers(isOpen);
        this.checkOwnership();

        EventEntity.listen(new EventListener(EVENT_TYPE.STATION_SECURITY_DISABLED, (event, data) => {
            if (data.data.unit === this.unit) {
                this.isDead = true;
                this.update(true, true);
                this.checkOwnership();
                this.unit.setVertexColor(100, 100, 100, 255);
            }
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.STATION_SECURITY_ENABLED, (event, data) => {
            if (data.data.unit === this.unit) {
                this.isDead = false;
                this.checkOwnership();
                this.unit.setVertexColor(255, 255, 255, 255);
            }
        }));

        EventEntity.listen(new EventListener(EVENT_TYPE.FLOOR_GAINS_POWER, (event, data) => {
            if ((data.data.floor as ZONE_TYPE) === this.doorFloor) {
                this.isPowered = true;
                this.checkOwnership();
            }
        }));
        EventEntity.listen(new EventListener(EVENT_TYPE.FLOOR_LOSES_POWER, (event, data) => {
            if ((data.data.floor as ZONE_TYPE) === this.doorFloor) {
                this.isPowered = false;
                this.checkOwnership();
            }
        }));

        const inZone = WorldEntity.getInstance().getPointZone(this.unit.x, this.unit.y);
        if (inZone) {
            this.doorFloor = inZone.id;
        }
        else {
            Log.Error("Door got no zone, pls fix");
            this.unit.setVertexColor(255, 0, 0, 120);
        }
    }


    update(isOpen: boolean, ignoreConditions: boolean = false): boolean {
        if (!ignoreConditions && (!this.canUpdate || !this.isPowered) || this.isOpen === isOpen) return false;

        try {
            const nearbyUnitGroup = CreateGroup();
            GroupEnumUnitsInRange(nearbyUnitGroup, this.unit.x, this.unit.y, 800, Filter(() => {
                const u = GetFilterUnit();
                const o = GetOwningPlayer(u);
                return GetPlayerId(o) < 20;
            }));

            this.unit.setAnimation(isOpen ? 1 : 3);
            this.isOpen = isOpen;
            this.canUpdate = false;

            ForGroup(nearbyUnitGroup, () => {
                UnitShareVision(this.unit.handle, GetOwningPlayer(GetEnumUnit()), true);
                if (isOpen) {
                    this.doorOpenSound.playSoundOnUnit(GetEnumUnit(), 25);
                }
                else {
                    this.doorCloseSound.playSoundOnUnit(GetEnumUnit(), 25);
                }
            })


            Timers.addTimedAction(1, () => {
                this.updatingPathingBlockers(isOpen);
                Timers.addTimedAction(0.3, () => {
                    this.canUpdate = true;
                    this.unit.addAnimationProps("alternate", isOpen);
                    this.checkOwnership();
                    ForGroup(nearbyUnitGroup, () => {
                        UnitShareVision(this.unit.handle, GetOwningPlayer(GetEnumUnit()), false);
                    });
                    DestroyGroup(nearbyUnitGroup);
                });
            });
        }
        catch(e) {
            Log.Error(e);
        }

        return true;
    }

    private checkOwnership() {
        this.unit.owner = PlayerStateFactory.NeutralPassive;
        if (this.isDead || !this.isPowered) {
            this.unit.name = `Security Door|n${COL_MISC}${this.isDead ? 'Broken' : 'Unpowered; Right Click to force open'}`;
        }
        else if (this.lockedFor > 0) {
            this.unit.name =  `Security Door|n${COL_MISC}Locked Remotely`;
        }
        else {
            this.unit.name = `Security Door`;
        }        
        Timers.addTimedAction(0, () => this.unit.owner = PlayerStateFactory.StationProperty);
    }

    doorSearchGroup = CreateGroup();
    /**
     * Searches for nearby units, and opens the door if necessary
     */
    public search(delta: number) {

        if (this.lockedFor > 0 && !this.isDead) {
            this.lockedFor -= delta;

            if (this.isOpen) this.update(false, true);
            // Don't continue
            return;
        }

        // Don't auto update it the door is dead
        // Don't update if the door is unpowered
        if (this.isDead && !this.isOpen) this.update(true, true);
        else if (this.isDead) return;
        if (!this.isPowered) return;


        GroupEnumUnitsInRange(this.doorSearchGroup, this.unit.x, this.unit.y, 450, Filter(() => {
            const u = GetFilterUnit();
            const o = GetOwningPlayer(u);
            return GetPlayerId(o) < 20 && IsUnitVisible(u, o);
        }));

        const count = CountUnitsInGroup(this.doorSearchGroup);
        if (this.isOpen && count === 0) {
            this.update(false);
        }
        else if (!this.isOpen && count > 0) {
            this.update(true);
        }

    }

    updatingPathingBlockers(isOpen: boolean) {
        // Remove all old blockers
        for (let index = 0; index < this.pathingBlockers.length; index++) {
            const blocker = this.pathingBlockers[index];
            RemoveDestructable(blocker);
        }

        this.pathingBlockers.splice(0, this.pathingBlockers.length - 1);


        const faceVec = new Vector2(
            Cos((this.unit.facing + 90) * bj_DEGTORAD),
            Sin((this.unit.facing + 90) * bj_DEGTORAD)
        );

        let distance = 0;
        let iterator = Vector2.fromWidget(this.unit.handle).subtract(faceVec.multiplyN(this.width/2));
        let iteration = faceVec.multiplyN(this.pathingTileSize * 2);


        while (distance < (this.width + this.pathingTileSize)) {
            if (isOpen && (distance > ((this.width - this.openableWidth) / 2)) && (distance < ((this.width + this.openableWidth) / 2))) {
            }
            else {
                const pblocker = CreateDestructable(PATHING_BLOCKER_BOTH, iterator.x, iterator.y, 0, 1, 0);   
                this.pathingBlockers.push(pblocker); 
            }

            iterator = iterator.add(iteration);
            distance += iteration.getLength();
        }
    }

    public isLocked(): boolean {
        return this.lockedFor > 0;
    }

    public lockFor(howLong: number) {
        this.lockedFor = howLong;

        const sfx = new Effect(SFX_WEAK_SHIELD, this.unit.x, this.unit.y);
        sfx.z = getZFromXY(this.unit.x, this.unit.y) + 40;
        sfx.scale = 2;

        const snd = new SoundRef(SOUND_STR_SONIC_RES, false);
        SetSoundPitch(snd.sound, 1.4);
        snd.playSoundOnUnit(this.unit.handle, 127, true);

        this.update(false, true);
        this.checkOwnership();

        Timers.addTimedAction(10, () => {
            sfx.destroy();
        })
        Timers.addTimedAction(15.5, () => {
            this.checkOwnership();
        })
    }
}