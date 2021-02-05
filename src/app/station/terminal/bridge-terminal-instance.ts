import { Terminal } from "./terminal-instance";
import { Unit } from "w3ts/index";
import { AskellonEntity } from "../askellon-entity";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { AskellonShip } from "app/space/ships/askellon-type";
import { Timers } from "app/timer-type";
import { ABIL_LEAVE_ASKELLON_CONTROLS } from "resources/ability-ids";
import { Log } from "lib/serilog/serilog";



export class BridgeTerminal extends Terminal {

    private doCancel = false;

    constructor(sourceUnit: Unit, baseUnit: Unit) {
        super(sourceUnit, baseUnit);
    }

    createTerminalUnit() {
        const askellonUnit = AskellonEntity.getInstance().askellonUnit;

        if (askellonUnit.owner !== PlayerStateFactory.NeutralPassive) {
            error("Askellon unit already being controlled");
        }
        
        this.terminalUnit = askellonUnit;
        askellonUnit.owner = this.sourceUnit.owner;

        SetCameraFieldForPlayer(this.sourceUnit.owner.handle, CAMERA_FIELD_TARGET_DISTANCE, 600, 0);
        Timers.addTimedAction(0, () => {
            SetCameraFieldForPlayer(this.sourceUnit.owner.handle, CAMERA_FIELD_TARGET_DISTANCE, 2400, 2);
            SelectUnitForPlayerSingle(this.terminalUnit.handle, this.terminalUnit.owner.handle);
            SetCameraBoundsToRectForPlayerBJ(this.terminalUnit.owner.handle, gg_rct_Space);
            if (this.sourceUnit.owner.handle === GetLocalPlayer()) { 
                BlzChangeMinimapTerrainTex("minimap-space.blp");
            }
            SetCameraPositionForPlayer(this.terminalUnit.owner.handle, this.terminalUnit.x, this.terminalUnit.y);
        });
    }

    step(delta: number): boolean {
        let result = true;
        
        // Need to make sure the owner still matches
        if (this.terminalUnit.owner != this.sourceUnit.owner) {
            result = false;
        }

        return this.doCancel ? false : result;
    }

    protected onCast() {

        const abil = GetSpellAbilityId();

        if (abil === ABIL_LEAVE_ASKELLON_CONTROLS) {
            this.doCancel = true;
        }
        else {
            super.onCast();
        }
    }

    protected onUnitUnselect() {  
        this.doCancel = true;
    }

    onDestroy() {
        this.terminalUnit.owner = PlayerStateFactory.NeutralPassive;
        this.unselectionTrigger.destroy();
        SetCameraBoundsToRectForPlayerBJ(this.sourceUnit.owner.handle, gg_rct_stationtempvision);
        if (this.sourceUnit.owner.handle === GetLocalPlayer()) {
            BlzChangeMinimapTerrainTex("war3mapPreviewAskellon.dds");
        }

        Timers.addTimedAction(0, () => {
            SetCameraFieldForPlayer(this.sourceUnit.owner.handle, CAMERA_FIELD_TARGET_DISTANCE, bj_CAMERA_DEFAULT_DISTANCE, 1);
            SelectUnitForPlayerSingle(this.sourceUnit.handle, this.sourceUnit.owner.handle);
            SetCameraPositionForPlayer(this.sourceUnit.owner.handle, this.sourceUnit.x, this.sourceUnit.y);
        });
    }
    
}