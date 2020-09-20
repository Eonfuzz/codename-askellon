import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { SoundRef } from "app/types/sound-ref";
import { Vector3 } from "app/types/vector3";
import { Unit, Effect } from "w3ts/index";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { Quick } from "lib/Quick";
import { SFX_BANSHEE_MISSILE, SFX_DEMONHUNTER_MISSILE } from "resources/sfx-paths";

class MiningEvent {
    drillStartSound = new SoundRef("Sounds\\Ships\\LaserDrillStart.wav", false, false);
    drillEndSound = new SoundRef("Sounds\\Ships\\LaserDrillEnd.wav", false, false);
    drillLoopSound = new SoundRef("Sounds\\Ships\\LaserDrill.wav", true, false);

    beamMoveSpeed: number = 20;
    beamLaserTicker: number = 0;
    beamTicks = 0;
    beamOrigin: Vector3;
    beamLaserCurrentPoint: Vector3;
    beamLaserTargetPoint: Vector3;

    beam: lightning;

    source: Unit;
    target: Unit;

    beamStartEffect: Effect;
    beamEndEffect: Effect;

    constructor(source: Unit, target: Unit) {
        this.source = source;
        this.target = target;

        this.beamOrigin = Vector3.fromWidget(source.handle).projectTowards2D(target.facing, 45);
        this.beamOrigin.z = 100;

        this.beamLaserCurrentPoint = Vector3.fromWidget(target.handle);
        this.beamLaserTargetPoint = Vector3.fromWidget(target.handle).multiply( new Vector3(GetRandomReal(-1, 1), GetRandomReal(-1, 1), GetRandomReal(-1, 1)).multiplyN(50));;

        this.beam = AddLightningEx("SPNL", false, 
            this.beamOrigin.x, this.beamOrigin.x, this.beamOrigin.z, 
            this.beamLaserCurrentPoint.x, this.beamLaserCurrentPoint.y, this.beamLaserCurrentPoint.z
        );
        this.drillStartSound.playSoundOnPont(this.beamOrigin.x, this.beamOrigin.y, 15);
        this.drillLoopSound.playSoundOnPont(this.beamOrigin.x, this.beamOrigin.y, 10);

        this.beamStartEffect = new Effect(SFX_BANSHEE_MISSILE, this.beamOrigin.x, this.beamOrigin.y);
        this.beamStartEffect.z = 45;

        this.beamEndEffect = new Effect(SFX_DEMONHUNTER_MISSILE, this.beamLaserCurrentPoint.x, this.beamLaserCurrentPoint.y);
        this.beamEndEffect.z = this.beamLaserCurrentPoint.z;
    }

    step(delta) {
        // Increase move speed of the beam
        this.beamMoveSpeed += 10 * delta;

        // Set beam origin
        this.beamOrigin = Vector3.fromWidget(this.source.handle).projectTowards2D(this.source.facing, 45);
        this.beamOrigin.z = 90;

        this.beamStartEffect.x = this.beamOrigin.x;
        this.beamStartEffect.y = this.beamOrigin.y;
        this.beamStartEffect.z = 90;

        const deltaPoint = this.beamLaserTargetPoint.subtract(this.beamLaserCurrentPoint).normalise().multiplyN(this.beamMoveSpeed * delta);
        this.beamLaserCurrentPoint = this.beamLaserCurrentPoint.add(deltaPoint);

        // Move lightning
        const s = this.beamOrigin;
        const e = this.beamLaserCurrentPoint;
        MoveLightningEx(this.beam, true, s.x, s.y, s.z, e.x, e.y, e.z);

        this.beamEndEffect.x = this.beamLaserCurrentPoint.x;
        this.beamEndEffect.y = this.beamLaserCurrentPoint.y;
        this.beamEndEffect.z = this.beamLaserCurrentPoint.z;


        this.beamLaserTicker += delta;
        // Update target loc
        if (this.beamLaserTicker > 0.5) {
            this.beamLaserTicker -= 0.5;
            this.beamTicks += 1;

            if (this.beamTicks > 4) {
                this.beamMoveSpeed = 20;
                const nTargetLoc = Vector3.fromWidget(this.target.handle);
                this.beamLaserTargetPoint = nTargetLoc.add(
                    new Vector3(GetRandomReal(-1, 1), GetRandomReal(-1, 1), GetRandomReal(-1, 1)).normalise().multiplyN(45 * this.target.selectionScale));
            }
            const minerals = this.source.getItemInSlot(0);
            const charges = GetItemCharges(minerals);
            if (charges < 250) {
                SetItemCharges(minerals, charges + 1);
            }
            UnitDamageTarget(this.source.handle, this.target.handle, 30, false, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_MAGIC, WEAPON_TYPE_WHOKNOWS);
            if (!UnitAlive(this.target.handle)) return false;
        }
        return true;
    }

    destroy() {
        DestroyLightning(this.beam);
        this.drillEndSound.playSoundOnPont(this.source.x, this.source.y, 15);
        this.drillStartSound.stopSound();
        this.drillLoopSound.stopSound(true);
        this.beamStartEffect.destroy();
        this.beamEndEffect.destroy();
    }
}

export class SpaceMiningEntity extends Entity {

    private static instance: SpaceMiningEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new SpaceMiningEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private item: MiningEvent[] = [];

    constructor() {
        super();

        EventEntity.listen(new EventListener(EVENT_TYPE.SHIP_STARTS_MINING, (self, data) => this.add(data.source, data.data.target)));
        EventEntity.listen(new EventListener(EVENT_TYPE.SHIP_STOPS_MINING, (self, data) => this.end(data.source, data.data.target)));
    }

    _timerDelay = 0.03;
    step() {
        for (let index = 0; index < this.item.length; index++) {
            const miningEvent = this.item[index];
            if (!miningEvent.step(this._timerDelay)) {
                miningEvent.destroy();
                Quick.Slice(this.item, index--);
            }
        }
    }

    private add(source: Unit, target: Unit) {
        this.item.push( new MiningEvent(source, target) );
    }

    private end(source: Unit, target: Unit) {
        for (let index = 0; index < this.item.length; index++) {
            const element = this.item[index];
            if (element.source === source && element.target === target) {
                element.destroy();
                return Quick.Slice(this.item, index);
            }
        }
    }
}