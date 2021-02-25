import { Hooks } from "lib/Hooks";
import { MapPlayer, Trigger } from "w3ts/index";
import { Players } from "w3ts/globals/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";

export class AntiMetaEntity {
    private static instance: AntiMetaEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new AntiMetaEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    public static start() {
        this.getInstance().init();
    }


    private triggerForPlayer = new Map<MapPlayer, Trigger>();
    private playerStateDisabled = new Map<MapPlayer, boolean>();
    private searchGroup = CreateGroup();

    /**
     * Begin stopping that meta knowledge!
     */
    public init() {
        // Players.forEach(player => {
        //     if (player.slotState === PLAYER_SLOT_STATE_PLAYING && player.controller === MAP_CONTROL_USER) {
        //         this.hook(player);
        //     }
        // });

            // // Move move triggers
            // // let isEnabled = false;
            // let group = CreateGroup();

            // const trigger = CreateTrigger();
            // TriggerRegisterPlayerMouseEventBJ(trigger, GetLocalPlayer(), bj_MOUSEEVENTTYPE_MOVE);
            // TriggerAddAction(trigger, () => {
            //     let foundAlienUnit = false;

            // });
            // trigger.registerPlayerMouseEvent(MapPlayer.fromLocal(), bj_MOUSEEVENTTYPE_MOVE);
            // trigger.addAction(() => {
            //     try {
            //         // const mouseFocus = BlzGetMouseFocusUnit();

                    
            //     }
            //     catch(e) {
            //         Log.Error(e);
            //     }
            // });
            // InputManager.addKeyboardPressCallback(OSKEY_LEFT, (key) => {
            //     if (GetLocalPlayer() === key.triggeringPlayer) {
            //         isEnabled = false;
            //         EnablePreSelect(true, false);
            //     }
            // });
            // InputManager.addKeyboardPressCallback(OSKEY_UP, (key) => {
            //     if (GetLocalPlayer() === key.triggeringPlayer) {
            //         isEnabled = false;
            //         EnablePreSelect(true, false);
            //     }
            // });
            // InputManager.addKeyboardPressCallback(OSKEY_RIGHT, (key) => {
            //     if (GetLocalPlayer() === key.triggeringPlayer) {
            //         isEnabled = false;
            //         EnablePreSelect(true, false);
            //     }
            // });
            // InputManager.addKeyboardPressCallback(OSKEY_DOWN, (key) => {
            //     if (GetLocalPlayer() === key.triggeringPlayer) {
            //         isEnabled = false;
            //         EnablePreSelect(true, false);
            //     }
            // });
    }
    //heckin test
    hook(who: MapPlayer) {
        const trigger = new Trigger();
        this.triggerForPlayer.set(who, trigger);

        trigger.registerPlayerMouseEvent(who, bj_MOUSEEVENTTYPE_MOVE);
        trigger.addAction(() => {
            const wasDisabled = this.playerStateDisabled.get(who);
            const x = BlzGetTriggerPlayerMouseX();
            const y = BlzGetTriggerPlayerMouseY();
            let foundAlienUnit = false;

            GroupEnumUnitsInRange(this.searchGroup, x, y, 128, null);
            let unit = FirstOfGroup(this.searchGroup);
            while (!foundAlienUnit && unit) {                        
                const p = who;
                const pData = PlayerStateFactory.get(p);

                // Only enable if we are NOT looking at an ALIEN player
                const force = pData && pData.getForce();
                foundAlienUnit = foundAlienUnit || 
                    (force && force.is(ALIEN_FORCE_NAME) && (force as AlienForce).getAlienFormForPlayer(p).handle === unit);
                GroupRemoveUnit(this.searchGroup, unit);
                unit = FirstOfGroup(this.searchGroup);
            }

            if (wasDisabled !== foundAlienUnit) {
                // Log.Information("Moused over alien? "+foundAlienUnit);
                this.playerStateDisabled.set(who, foundAlienUnit);
                if (GetLocalPlayer() === who.handle) EnablePreSelect(true, !foundAlienUnit);
            }
        });
    }
}