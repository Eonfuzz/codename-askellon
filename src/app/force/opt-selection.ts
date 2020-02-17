/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { CrewmemberForce } from "./crewmember-force";
import { AlienForce } from "./alien-force";
import { ObserverForce } from "./observer-force";
import { Trigger } from "app/types/jass-overrides/trigger";
import { COL_VENTS, COL_GOOD, COL_BAD } from "resources/colours";
import { ForceModule } from "./force-module";
import { STR_OPT_HUMAN, STR_OPT_ALIEN, STR_OPT_MESSAGE } from "resources/strings";

enum OPT_TYPES {
    HUMAN = 'p',
    ALIEN = 'a'
}

const OPTS_AVAILABLE = [OPT_TYPES.HUMAN, OPT_TYPES.ALIEN];

export class OptSelection {

    dialog: dialog = DialogCreate();
    clickTrigger: Trigger = new Trigger();

    private optVsButton: Map<OPT_TYPES, button> = new Map();
    private buttonVsOpt: Map<button, OPT_TYPES> = new Map();

    private playersInOpt: Map<OPT_TYPES, player[]> = new Map();
    private optsForPlayer: Map<player, OPT_TYPES[]> = new Map();

    private playerOptPower: Map<player, number> = new Map();

    /**
     * Sets the player's opt power
     * @param optPower 
     */
    public setOptPower(who: player, optPower: number) {
        this.playerOptPower.set(who, optPower);
    }

    /**
     * Returns opt power if set, default is 10 otherwise
     * @param player 
     */
    public getOptPower(player: player) {
        return this.playerOptPower.get(player) || 10;
    }

    /**
     * Asks for opts
     */
    public askPlayerOpts(forces: ForceModule) {
        DialogSetMessage(this.dialog, STR_OPT_MESSAGE);

        OPTS_AVAILABLE.forEach((opt, i) => {
            const tooltip = this.getButtonText(opt);
            const button = DialogAddButton(this.dialog, tooltip, GetLocalizedHotkey(opt));

            this.optVsButton.set(opt, button);
            this.buttonVsOpt.set(button, opt);
        });

        this.clickTrigger.RegisterDialogEventBJ(this.dialog);
        this.clickTrigger.AddAction(() => this.onDialogClick());
        forces.getActivePlayers().forEach(player => DialogDisplay(player, this.dialog, true));
    }

    private onDialogClick() {
        const dialog = GetClickedDialog();
        const button = GetClickedButton();
        const player = GetTriggerPlayer();

        const optType = this.buttonVsOpt.get(button);

        // Back out if the selected button has no variables
        if (!optType) return Log.Warning("Opt selected with variables");
        
        // Make sure the opt array exists
        if (!this.playersInOpt.has(optType)) this.playersInOpt.set(optType, []);

        // Also update the opts for players array
        if (!this.optsForPlayer.has(player)) this.optsForPlayer.set(player, []);

        // Now add or remove the player from the opt array as necessary
        const playersOptedList = this.playersInOpt.get(optType);
        if (playersOptedList) {
            const idx = playersOptedList.indexOf(player);
            if (idx >= 0) playersOptedList.splice(idx, 1);
            else playersOptedList.push(player);
        }

        const optsForPlayerList = this.optsForPlayer.get(player);
        if (optsForPlayerList) {
            const idx = optsForPlayerList.indexOf(optType);
            if (idx >= 0) optsForPlayerList.splice(idx, 1);
            else optsForPlayerList.push(optType);
        }
    }

    /**
     * Updates the dialog's display
     */
    public updateDialog() {

        // Get players opt power
        // Divide opt power among buttons

        let opts: { player: player, power: number, opted: OPT_TYPES[]}[] = [];

        DialogClear(this.dialog);

        OPTS_AVAILABLE.forEach(opt => {
            const playersOpted = this.playersInOpt.get(opt);
            
            let text = this.getButtonText(opt);
            let totalOptPower = 0;

            if (playersOpted) {
                // Increase the opt value per opt
                playersOpted.forEach(p => {
                    const opts = this.optsForPlayer.get(p)
                    const numOpts = opts ? opts.length : 0;
                    totalOptPower += this.getOptPower(p) / numOpts;
                })
            }

            if (totalOptPower > 0) {
                text += `( ${totalOptPower} )`
            }


            const button = DialogAddButton(this.dialog, text, GetLocalizedHotkey(opt));

            this.optVsButton.set(opt, button);
            this.buttonVsOpt.set(button, opt);
        });
    }

    /**
     * Returns a buttons text based on opt type
     * Used to refer to the resources file
     * @param type 
     */
    private getButtonText(type: OPT_TYPES) {
        switch (type) {
            case OPT_TYPES.HUMAN: return STR_OPT_HUMAN;
            case OPT_TYPES.ALIEN: return STR_OPT_ALIEN;
        }
    }
}
