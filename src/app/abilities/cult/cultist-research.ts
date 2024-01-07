import { AbilityWithDone } from "../ability-type";
import { Effect, Force, Item, MapPlayer, Unit } from "w3ts/index";
import { Vector3 } from "app/types/vector3";
import { getZFromXY, MessageAllPlayers } from "lib/utils";
import { PlayNewSoundAt } from "lib/translators";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME, CREW_FORCE_NAME, CULT_FORCE_NAME } from "app/force/forces/force-names";
import { SFX_DARK_HARVEST, SFX_DARK_RITUAL, SFX_VOID_DISK } from "resources/sfx-paths";
import { FilterIsAlive } from "resources/filters";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { BUFF_ID } from "resources/buff-ids";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { PlayerState } from "app/force/player-type";
import { CultistForce } from "app/force/forces/cultist/cultist-force";
import { Log } from "lib/serilog/serilog";
import { ABIL_CULTIST_T1_GLUTTONY, ABIL_CULTIST_T1_GRAVE_GIFT, ABIL_CULTIST_T1_PERNICIOUS_POWER, ABIL_CULTIST_T2_DELICIOUS_DECAY } from "resources/ability-ids";
import { CrewmemberForce } from "app/force/forces/crewmember-force";
import { Players } from "w3ts/globals/index";
import { ChatEntity } from "app/chat/chat-entity";
import { COLOUR_CULT } from "app/force/forces/cultist/constants";
import { Vector2 } from "app/types/vector2";
import { Timers } from "app/timer-type";
import { ITEM_CEREMONIAL_DAGGER } from "resources/item-ids";


export class CultistResearchAbility extends AbilityWithDone {
    private owningCultHuman!: Unit;
    private altar!: Unit;
    private spellId!: number;
    private tier: number;
    private timeElapsed: number = 0;
    private playAnimAt: number = 0;
    private stopAnimAfter: number = 1;

    constructor(abilTier: number) {
        super();
        this.tier = abilTier;
        this.spellId = GetSpellAbilityId();
    }

    public init() {
        super.init();
        
        const cultForce = PlayerStateFactory.getForce(CULT_FORCE_NAME) as CultistForce;
        const altarOwner = cultForce.getActiveUnitFor(this.casterUnit.owner);
        const altar = cultForce.getPlayerAltar(this.casterUnit.owner.id);

        if (altar == undefined) return false;            
        if (altarOwner == undefined) return false;
        if (altarOwner == undefined) return false;
        
        this.altar = altar;
        this.owningCultHuman = altarOwner;

        // Run setup
        this.setup();
        return true;
    };

    public setup() {
        SelectUnitForPlayerSingle(this.owningCultHuman.handle, this.owningCultHuman.owner.handle);
        
        this.casterUnit.removeAbility(ABIL_CULTIST_T1_GLUTTONY);
        this.casterUnit.removeAbility(ABIL_CULTIST_T1_GRAVE_GIFT);
        this.casterUnit.removeAbility(ABIL_CULTIST_T1_PERNICIOUS_POWER);
        this.altar.setAnimation(6);

        this.playAnimAt = 4.8 + (this.tier - 1) * 4;        
                
        const cultForce = PlayerStateFactory.getForce(CULT_FORCE_NAME) as CultistForce;
        cultForce.onCultistResearch(this.casterUnit, this.spellId, this.tier);
    }

    public step(delta: number) {
        this.timeElapsed += delta;
        if (this.playAnimAt >= 0) {
            this.playAnimAt -= delta;
            if (this.playAnimAt < 0) {
                this.altar.setAnimation(7);
            }
        }
        else if (this.stopAnimAfter >= 0) {
            this.stopAnimAfter -= delta;
            if (this.stopAnimAfter < 0) {
                this.altar.setAnimation("stand");
                this.done = true;
            }
        }
    };

    public destroy() {
        /**
         * Curse all players
         */
        if (this.spellId === ABIL_CULTIST_T1_GRAVE_GIFT) {
            Players.forEach(p => {
                if (p.slotState === PLAYER_SLOT_STATE_PLAYING && p.controller === MAP_CONTROL_USER) {
                    const pData = PlayerStateFactory.get(p);
                    if (pData != undefined) {
                        const crew = pData.getCrewmember();
                        if (crew && crew.unit.isAlive() && this.owningCultHuman.handle !== crew.unit.handle) {
                            DynamicBuffEntity.add(
                                BUFF_ID.MADNESS, 
                                crew.unit,
                                new BuffInstanceDuration(this.owningCultHuman, 300)
                            );
                            ChatEntity.getInstance().postMessageFor([crew.unit.owner], "?", COLOUR_CULT, "The chant echos in your skull, faint whispers and violent dreams.");
                        }
                    }
                }
            })
        }
        else if (this.spellId === ABIL_CULTIST_T1_GLUTTONY) {
            const p = this.owningCultHuman.owner;
            p.setState(PLAYER_STATE_RESOURCE_GOLD, 
                p.getState(PLAYER_STATE_RESOURCE_GOLD) + 1000);
        }
        else if (this.spellId === ABIL_CULTIST_T1_PERNICIOUS_POWER) {
            const cultForce = PlayerStateFactory.getForce(CULT_FORCE_NAME) as CultistForce;
            cultForce.setPlayerHasPerniciousPower(this.owningCultHuman.owner, true);
        }
        else if (this.spellId === ABIL_CULTIST_T2_DELICIOUS_DECAY) {
            const pData = PlayerStateFactory.get(this.owningCultHuman.owner);
            
            const unit = pData.getUnit();
            const spawnLoc = Vector2.fromWidget(this.altar.handle);
            const deltaLoc = spawnLoc.add( Vector2.fromWidget(unit.handle).subtract(spawnLoc).multiplyN(0.5));
            const sfx = new Effect(SFX_VOID_DISK, deltaLoc.x, deltaLoc.y);
            sfx.scale = 0.8;
            sfx.setColor(150, 20, 30);
            Timers.addTimedAction(1, () => {
                sfx.destroy();
                const i = CreateItem(ITEM_CEREMONIAL_DAGGER, deltaLoc.x, deltaLoc.y);
                if (UnitInventoryCount(unit.handle) < UnitInventorySize(unit.handle)) {
                    unit.addItem(Item.fromHandle(i));
                }
            });
        }
        return true;
    };
}