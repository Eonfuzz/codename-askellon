/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { CrewmemberForce } from "./crewmember-force";
import { AlienForce } from "./alien-force";
import { ObserverForce } from "./observer-force";
import { Trigger, MapPlayer, Dialog, DialogButton } from "w3ts";
import { COL_GOOD, COL_BAD, COL_MISC, COL_ALIEN } from "resources/colours";
import { ForceModule } from "./force-module";
import { STR_OPT_HUMAN, STR_OPT_ALIEN, STR_OPT_MESSAGE } from "resources/strings";

export enum OPT_TYPES {
    PROTAGANIST = "Protagainst",
    ANTAGONST = "Antagonist",
    NEUTRAL = "Neutral"
}

export interface OptSelectOption {
    // The name of the role opt
    name: string,

    // The text displayed during selection
    text: string,

    // The hotkey for the opt
    hotkey: string,

    // What type of opt is this
    type: OPT_TYPES,

    // This must ALWAYS be selected
    // Only the main antagonist should have this selected
    isRequired: boolean,

    // The amount of times this role must be picked
    // Leave undefined for infinite
    count?: number,

    // 0..100 chance for the role to exist
    // No effect if isRequired = true
    chanceToExist: number,

    // Balancing  cost
    // unused
    balanceCost?: { protag: number, antag: number, neutral: number};
}

export interface OptResult { player: MapPlayer, role: OptSelectOption };

export class OptSelection {

    dialog: Dialog = new Dialog();
    clickTrigger: Trigger = new Trigger();

    private players: MapPlayer[] = [];

    private optVsButton: Map<OptSelectOption, DialogButton> = new Map();
    private buttonVsOpt: Map<DialogButton, OptSelectOption> = new Map();

    private playersInOpt: Map<OptSelectOption, MapPlayer[]> = new Map();
    private optsForPlayer: Map<MapPlayer, OptSelectOption[]> = new Map();

    private playerOptPower: Map<MapPlayer, number> = new Map();

    private optsPossible: OptSelectOption[] = [];

    // The default opt to be used (read: human)
    private defaultOpt: OptSelectOption;

    constructor(defaultOpt: OptSelectOption) {
        this.defaultOpt = defaultOpt;
    }
    
    /**
     * Adds a new opt option to the display list
     * @param what 
     */
    public addOpt(what: OptSelectOption) {
        this.optsPossible.push(what)
    }

    /**
     * Sets the player's opt power
     * @param optPower 
     */
    public setOptPower(who: MapPlayer, optPower: number) {
        this.playerOptPower.set(who, optPower);
    }

    /**
     * Returns opt power if set, default is 10 otherwise
     * @param player 
     */
    public getOptPower(player: MapPlayer) {
        return this.playerOptPower.get(player) || 10;
    }

    /**
     * Asks for opts
     */
    public askPlayerOpts(forces: ForceModule) {
        let allOpts = this.optsPossible.slice();
        allOpts.push(this.defaultOpt);

        this.players = forces.getActivePlayers();
        this.players.forEach(p => this.dialog.display(p, true));

        this.dialog.setMessage(STR_OPT_MESSAGE);

        allOpts.forEach((opt, i) => {

            const tooltip = opt.text;
            const button = this.dialog.addButton(this.getTypePefix(opt.type)+tooltip, GetLocalizedHotkey(opt.hotkey));

            this.optVsButton.set(opt, button);
            this.buttonVsOpt.set(button, opt);
        });

        this.clickTrigger.registerDialogEvent(this.dialog);
        this.clickTrigger.addAction(() => this.onDialogClick());
        this.players.forEach(player => this.dialog.display(player, true));
    }

    private onDialogClick() {        
        const dialog = this.dialog;
        const button = DialogButton.fromHandle(GetClickedButton());
        const player = MapPlayer.fromHandle(GetTriggerPlayer());

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

        this.updateDialog();
    }

    /**
     * Updates the dialog's display
     */
    private updateDialog() {
        let allOpts = this.optsPossible.slice();
        allOpts.push(this.defaultOpt);

        this.dialog.clear();
        this.dialog.setMessage(STR_OPT_MESSAGE);

        // Add variable opts
        allOpts.forEach(opt => {
            const playersOpted = this.playersInOpt.get(opt);

            let text = this.getTypePefix(opt.type)+opt.text;
            // let totalOptPower = 0;

            if (playersOpted) {
                // Increase the opt value per opt
                playersOpted.forEach(p => {
                    const opts = this.optsForPlayer.get(p)
                    // const numOpts = opts ? opts.length : 0;
                    // const optPowerForPlayer = MathRound(this.getOptPower(p) / numOpts);
                    // totalOptPower += optPowerForPlayer

                    let localString = text + ` ${COL_GOOD}Opted In!|r`;

                    if (p.handle === GetLocalPlayer()) {
                        text = localString;
                    }
                })
            }

            // if (totalOptPower > 0) {
            //     text += ` ( ${MathRound(totalOptPower)} )`
            // }


            const button = this.dialog.addButton(text, GetLocalizedHotkey(opt.hotkey));

            this.optVsButton.set(opt, button);
            this.buttonVsOpt.set(button, opt);
        });

        this.players.forEach(p => this.dialog.display(p, true));
    }


    private getTypePefix(type: OPT_TYPES) {
        switch (type) {
            case OPT_TYPES.PROTAGANIST: return `${COL_GOOD}Protaganist:|r `;
            case OPT_TYPES.ANTAGONST: return `${COL_ALIEN}Antagonist:|r `;
            case OPT_TYPES.NEUTRAL: return `${COL_MISC}Neutral:|r `;
        }
    }

    /**
     * Destroys the opt selection and returns gathered data
     */
    public endOptSelection(force: ForceModule) {
        // Clear button cache
        this.buttonVsOpt.clear();
        this.players.forEach(p => this.dialog.display(p, false));

        // Time to roll for opts
        const playersNoRole = force.getActivePlayers();
        const rolesToUse = this.optsPossible.filter(opt => (GetRandomInt(0, 100) <= opt.chanceToExist));
        const result: Array<OptResult> = [];

        rolesToUse.forEach(r => {
            const playersOptedForRole = this.playersInOpt.get(r) || [];
            let srcPlayersAvailableForRole = playersNoRole
                .filter(p1 => playersOptedForRole.some(p2 => p1 === p2));


            // Are we less than the required number?
            if (r.isRequired && r.count && srcPlayersAvailableForRole.length <= r.count) {
                // Try and fill to required count
                while ((srcPlayersAvailableForRole.length < r.count) && playersNoRole.length > 0) {
                    // Grab a random player from playersNoRole
                    srcPlayersAvailableForRole.push(playersNoRole.splice(GetRandomInt(0, playersNoRole.length-1), 1)[0]);
                }
            }
            
            // Grab from srcPlayersAvailableForRole
            let playersGettingRole: MapPlayer[] = [];
            while (playersGettingRole.length < (r.count || 1) && srcPlayersAvailableForRole.length > 0) {
                let player = srcPlayersAvailableForRole.splice(GetRandomInt(0, srcPlayersAvailableForRole.length-1), 1)[0];
                const idx = playersNoRole.indexOf(player);

                if (idx >= 0) playersNoRole.splice(idx, 1);
                playersGettingRole.push(player);
            }

            // Add picked players to that role list
            playersGettingRole.forEach(p => {
                // Log.Information(`${r.text} is ${ GetPlayerId(p)}`);
                result.push({player: p, role: r});
            });
        });

        // We're done going through the optional roles
        // Now assign to the default human role
        playersNoRole.forEach(p => result.push({player: p, role: this.defaultOpt}));

        // Log.Information(`Got ${result.length} results!`);

        return result;
    }
}
