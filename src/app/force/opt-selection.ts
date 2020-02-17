/** @noSelfInFile **/
import { Game } from "../game";
import { Log } from "../../lib/serilog/serilog";
import { ForceType } from "./force-type";
import { CrewmemberForce } from "./crewmember-force";
import { AlienForce } from "./alien-force";
import { ObserverForce } from "./observer-force";
import { Trigger } from "app/types/jass-overrides/trigger";
import { COL_GOOD, COL_BAD, COL_MISC, COL_ALIEN } from "resources/colours";
import { ForceModule } from "./force-module";
import { STR_OPT_HUMAN, STR_OPT_ALIEN, STR_OPT_MESSAGE } from "resources/strings";

export enum OPT_TYPES {
    PROTAGANIST = "Protagainst",
    ANTAGONST = "Antagonist",
    NEUTRAL = "Neutral"
}

interface OptSelectOption {
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

export class OptSelection {

    dialog: dialog = DialogCreate();
    clickTrigger: Trigger = new Trigger();

    private optVsButton: Map<OptSelectOption, button> = new Map();
    private buttonVsOpt: Map<button, OptSelectOption> = new Map();

    private playersInOpt: Map<OptSelectOption, player[]> = new Map();
    private optsForPlayer: Map<player, OptSelectOption[]> = new Map();

    private playerOptPower: Map<player, number> = new Map();

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
        let allOpts = this.optsPossible.slice();
        allOpts.push(this.defaultOpt);

        forces.getActivePlayers().forEach(p => DialogDisplay(p, this.dialog, true));
        DialogSetMessage(this.dialog, STR_OPT_MESSAGE);

        allOpts.forEach((opt, i) => {

            const tooltip = opt.text;
            const button = DialogAddButton(this.dialog, this.getTypePefix(opt.type)+tooltip, GetLocalizedHotkey(opt.hotkey));

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
        let allOpts = this.optsPossible.slice();
        allOpts.push(this.defaultOpt);

        DialogClear(this.dialog);

        // Add variable opts
        allOpts.forEach(opt => {
            const playersOpted = this.playersInOpt.get(opt);

            let text = this.getTypePefix(opt.type)+opt.text;
            let totalOptPower = 0;

            if (playersOpted) {
                // Increase the opt value per opt
                playersOpted.forEach(p => {
                    const opts = this.optsForPlayer.get(p)
                    const numOpts = opts ? opts.length : 0;
                    const optPowerForPlayer = this.getOptPower(p) / numOpts;
                    totalOptPower += optPowerForPlayer

                    let localString = text + `+ ${COL_GOOD}${optPowerForPlayer}|r`;

                    if (p === GetLocalPlayer()) {
                        text = localString;
                    }
                })
            }

            if (totalOptPower > 0) {
                text += ` ( ${totalOptPower} )`
            }


            const button = DialogAddButton(this.dialog, text, GetLocalizedHotkey(opt.hotkey));

            this.optVsButton.set(opt, button);
            this.buttonVsOpt.set(button, opt);
        });

        // Now add the default opt
    }


    private getTypePefix(type: OPT_TYPES) {
        switch (type) {
            case OPT_TYPES.PROTAGANIST: return `${COL_GOOD}Protaganist:|r`;
            case OPT_TYPES.ANTAGONST: return `${COL_ALIEN}Antagonist:|r`;
            case OPT_TYPES.NEUTRAL: return `${COL_MISC}Protaganist:|r`;
        }
    }

    /**
     * Destroys the opt selection and returns gathered data
     */
    public endOptSelection(force: ForceModule): { player: player, role: OptSelectOption }[] {
        // Clear button cache
        this.buttonVsOpt.clear();
        DialogClear(this.dialog);
        DialogDestroy(this.dialog);

        // Time to roll for opts
        const playersNoRole = force.getActivePlayers();
        const rolesToUse = this.optsPossible.filter(opt => GetRandomInt(0, 100) <= opt.chanceToExist);
        let result: { player: player, role: OptSelectOption }[] = [];

        rolesToUse.forEach(r => {
            const playersOptedForRole = this.playersInOpt.get(r) || [];
            let srcPlayersAvailableForRole = playersNoRole
                .filter(p1 => playersOptedForRole.some(p2 => p1 === p2));


            // Are we less than the required number?
            if (r.isRequired && r.count && srcPlayersAvailableForRole.length <= r.count) {
                // Try and fill to required count
                while (srcPlayersAvailableForRole.length < r.count && playersNoRole.length > 0) {
                    // Grab a random player from playersNoRole
                    srcPlayersAvailableForRole.push(playersNoRole.splice(GetRandomInt(0, playersNoRole.length-1), 1)[0]);
                }
            }
            
            // Grab from srcPlayersAvailableForRole
            let playersGettingRole: player[] = [];
            while (playersGettingRole.length <= (r.count || 1) && playersNoRole.length > 0) {
                playersGettingRole.push(srcPlayersAvailableForRole.splice(GetRandomInt(0, srcPlayersAvailableForRole.length-1), 1)[0]);
            }

            // Add picked players to that role list
            playersGettingRole.forEach(p => result.push({player: p, role: r}));
        });

        // We're done going through the optional roles
        // Now assign to the default human role
        playersNoRole.forEach(p => result.push({player: p, role: this.defaultOpt}));

        return result;
    }
}
