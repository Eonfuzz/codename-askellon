import { Ability } from "../ability-type";
import { Effect, Group, Item, MapPlayer, Unit } from "w3ts/index";
import { ITEM_GENETIC_SAMPLE, ITEM_GENETIC_SAMPLE_INFESTED, ITEM_MINERAL_REACTIVE, ITEM_MINERAL_VALUABLE, ITEM_REMOTE_BOMB } from "resources/item-ids";
import { Vector2 } from "app/types/vector2";
import { ConveyorEntity } from "app/conveyor/conveyor-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { UNIT_ID_REMOTE_BOMB } from "resources/unit-ids";
import { getZFromXY, MessagePlayer, terrainIsPathable } from "lib/utils";
import { COL_GOLD } from "resources/colours";
import { InputManager } from "lib/TreeLib/InputManager/InputManager";
import { MouseInputContainer } from "lib/TreeLib/InputManager/MouseInputContainer";
import { MouseCallback } from "lib/TreeLib/InputManager/MouseCallback";
import { PlayNewSoundAt } from "lib/translators";
import { Log } from "lib/serilog/serilog";
import { SFX_BLUE_BALL } from "resources/sfx-paths";
import { FilterAnyUnit, FilterIsAlive } from "resources/filters";
import { ForceEntity } from "app/force/force-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { GameTimeElapsed } from "app/types/game-time-elapsed";

export class PlaceBombAbility implements Ability {

    private unit: Unit;
    private player: MapPlayer;
    private bomb: Unit;

    private detonating = false;
    private detonated = false;

    private detonationDuration = 3.5;
    private detonatingTimer = this.detonationDuration;

    private checkTicker = 2;

    private mouseHook: MouseCallback;
    private orbEffect: Effect;

    private g = new Group();

    private placementTimestamp: number;

    constructor() {}

    public initialise() {
        this.unit = Unit.fromHandle(GetTriggerUnit());
        this.player = this.unit.owner;

        const targetLoc = new Vector2( GetSpellTargetX(), GetSpellTargetY() );

        if (terrainIsPathable(targetLoc.x, targetLoc.y)) {
            this.g.enumUnitsInRangeCounted(targetLoc.x, targetLoc.y, 350, () => GetUnitTypeId(GetFilterUnit()) === FourCC('n001'), 1);

            if (this.g.size >= 1) {
                MessagePlayer(this.unit.owner, `${COL_GOLD}Cannot Place Near Elevator|r`);
            }
            else {
                this.bomb = new Unit(this.player, UNIT_ID_REMOTE_BOMB, targetLoc.x, targetLoc.y, bj_UNIT_FACING);
            }
        }
        else {
            MessagePlayer(this.unit.owner, `${COL_GOLD}Cannot Build There|r`);
        }

        if (!this.bomb) {
            this.unit.issueImmediateOrder("stop");
            this.unit.addItem( new Item(ITEM_REMOTE_BOMB, this.unit.x, this.unit.y) );
            return false;
        }


        this.placementTimestamp = GameTimeElapsed.getTime();

        // Now add mouse hook
        const cbCont = InputManager.addMouseReleaseCallback(MOUSE_BUTTON_TYPE_LEFT, key => {
            if (key.triggeringPlayer == this.player.handle) {
                this.onClickSearch(key.position);
            }
        });

        this.mouseHook = cbCont.callbacks[cbCont.callbacks.length -1];

        return true;
    };

    public process(delta: number) {

        if (!this.detonating) {
            this.checkTicker += delta;
            if (this.checkTicker > 2) {
                this.checkTicker = 0;
                                
                return !this.detonated && this.bomb.isAlive();
            }
        }
        else if (this.unit.isAlive()) {
            this.detonatingTimer -= delta;

            const p = (this.detonationDuration - this.detonatingTimer) / this.detonationDuration;
            this.orbEffect.scale = 0.3 * p;
            this.orbEffect.z = getZFromXY(this.bomb.x, this.bomb.y) + 75 * p;
            
            this.checkTicker += delta;
            if (this.checkTicker > 0.15) {
                this.checkTicker = 0;
                
                const sfx = AddSpecialEffect("war3mapImported\\DustWave.mdx", this.bomb.x, this.bomb.y);
                BlzSetSpecialEffectHeight(sfx,  getZFromXY(this.bomb.x, this.bomb.y) + 5);
                BlzSetSpecialEffectYaw(sfx, GetRandomInt(0, 360) * bj_DEGTORAD);
                BlzSetSpecialEffectAlpha(sfx, 40);
                BlzSetSpecialEffectScale(sfx, 1.5*p);
                BlzSetSpecialEffectTimeScale(sfx, 0.9);
                BlzSetSpecialEffectTime(sfx, 0);
                DestroyEffect(sfx);
            }


            if (this.detonatingTimer <= 0) {
                this.explode();
                return false;
            }

        }
        return true;
    };

    private onClickSearch(targetLoc: Vector2) {
        const d = targetLoc.distanceTo( Vector2.fromWidget(this.bomb.handle) );
        if (d <= 75) {
            this.onClick();
        }
    };

    private onClick() {
        if (GameTimeElapsed.getTime() - this.placementTimestamp <= 3) return;

        // We are exploding, Remove the callbacks
        InputManager.removeMouseCallback(this.mouseHook);
        this.mouseHook = undefined;

        // Remove our bomb's permanent invisibility
        this.bomb.removeAbility(FourCC('Apiv'));

        // Create and play an explosion sound
        PlayNewSoundAt("Sounds\\RemoteBombCharge.wav", this.bomb.x, this.bomb.y, 127);

        // We are detonating
        this.detonating = true;
        this.orbEffect = new Effect(SFX_BLUE_BALL, this.bomb.x, this.bomb.y);
        this.orbEffect.z = getZFromXY(this.bomb.x, this.bomb.y);
        this.orbEffect.scale = 0;
    }

    
    private explode() {
        if (this.bomb.isAlive()) {
            PlayNewSoundAt("Sounds\\FusionExplosion.wav", this.bomb.x, this.bomb.y, 127);    
            this.bomb.show = false;     
            this.bomb.kill();
            this.detonated = true;

            const sfx = AddSpecialEffect("Objects\\Spawnmodels\\NightElf\\NECancelDeath\\NECancelDeath.mdl", this.bomb.x, this.bomb.y);
            BlzSetSpecialEffectScale(sfx, 2);
            DestroyEffect(sfx);

            GroupEnumUnitsInRange(
                this.g.handle, 
                this.bomb.x, 
                this.bomb.y,
                350,
                FilterAnyUnit()
            );

            this.g.for(() => this.doDamage());
            this.g.clear();
        }
    }


    public doDamage() {
        const unit = Unit.fromHandle(GetEnumUnit());

        // Check to make sure we are allowed aggression between the two teams
        const aggressionAllowed = this.unit.owner === unit.owner 
            || ForceEntity.getInstance().aggressionBetweenTwoPlayers(
                this.unit.owner, 
                unit.owner
            );

        // If we aren't allowed aggression we stop
        // Prevents griefing etc
        if (!aggressionAllowed) return;

        // Otherwise continue onwards
        const crew = CrewFactory.getInstance().getCrewmemberForUnit(unit);
        let damageMult = 1;
        if (crew) damageMult = crew.getDamageBonusMult();

        this.unit.damageTarget(
            unit.handle, 
            350 * damageMult, 
            true, 
            true, 
            ATTACK_TYPE_MAGIC, 
            DAMAGE_TYPE_ACID, 
            WEAPON_TYPE_WHOKNOWS
        )

    }


    public destroy() {
        if (this.mouseHook) InputManager.removeMouseCallback(this.mouseHook);
        if (this.bomb.isAlive()) this.bomb.destroy();
        this.g.destroy();

        if (this.orbEffect) this.orbEffect.destroy();
        return true;
    };
}