import { MapPlayer, playerColors, Unit } from "w3ts/index";
import { ForceType } from "./forces/force-type";
import { Crewmember } from "app/crewmember/crewmember-type";
import { WeaponEntityAttackType } from "app/weapons/weapon-attack-type";
import { Log } from "lib/serilog/serilog";
import { SyncSaveLoad } from "lib/TreeLib/SaveLoad/SyncSaveLoad";
import { Quick } from "lib/Quick";
import { MessagePlayer } from "lib/utils";
import { COL_GOOD } from "resources/colours";
import { COLOUR_CULT } from "./forces/cultist/constants";

export enum PRIVS {
    USER, VETERAN, MODERATOR, DEVELOPER
}


export const VETERAN_USERS = [
    `senpai#12749`,
    `zach#14297`,
    `kaedin#1539`,
    `darkalien#11124`,
    `redaxe13#1850`,
    `lanarhodes#69420`,
    `ryk#1153`,
    `xklybur#11854`,
    `hxastur#2165`,
    `mayday#12613`,
    `spotdon1#1551`,
    `djinny#1853`,
    `avayana#2133`,
    `vlad23#2736`,
    `miles#1506`,
    `psizzle#1363`,
    `chemixv#2500`,
    `korzen#2121`,
    `Aggex#11661`,
    `Вурдалак#21816`,
    `Serendipity#11633`,
    `Isaac#1877`,
    `PrismaIllya#11412`,
    `LordofRoses#1971`
];

export class PlayerState {

    public player: MapPlayer;
    private force: ForceType;
    private crewmember: Crewmember;
    
    public originalName: string;
    public originalColour: playercolor;

    // The player experience shared across all agents
    private playerExperience: number = 0;

    public levelBonusStrength = 0;
    public levelBonusAgility = 0;
    public levelBonusIntelligence = 0;

    /**
     * Save-able state items
     */
    private attackType = WeaponEntityAttackType.CAST;
    public gamesPlayed = 0;
    public gamesLeft = 0;
    public playerDeaths = 0;
    public playerTeamkills = 0;
    public playerEnemyKills = 0;
    public playerGamesWon = 0;
    public playerGamesLost = 0;

    constructor(player: MapPlayer) {
        this.player = player;
        this.originalName = player.name;
        this.originalColour = player.color;
    }

    getUserPrivs(): PRIVS {
        const who = this.player;

        // Log.Information("Player attempting commands: "+GetPlayerName(who));
        if (who.name === 'Eonfuzz#1988') return PRIVS.DEVELOPER;
        if (who.name === 'maddeem#1693') return PRIVS.DEVELOPER;
        if (who.name === 'mayday#12613') return PRIVS.DEVELOPER;
        if (who.name === 'redaxe#1865') return PRIVS.DEVELOPER;

        if (who.name === 'pipski#12613') return PRIVS.DEVELOPER;
        if (who.name === 'Local Player') return PRIVS.DEVELOPER;
        // No # means this is a local game
        if (who.name.indexOf("#") === -1) return PRIVS.DEVELOPER;

        else if (VETERAN_USERS.indexOf(who.name.toLowerCase()) >= 0) {
            return PRIVS.VETERAN;
        }

        return PRIVS.USER;
    }

    setForce(force: ForceType) {
        this.force = force;
    }

    getForce() {
        return this.force;
    }

    setExperience(to: number) {
        this.playerExperience = to;
    }

    addExperience(howMuch: number) {
        this.playerExperience += howMuch;
        this.force.onUnitGainsXp(this.crewmember, this.playerExperience);
    }

    getExperience() {
        return this.playerExperience;
    }

    setCrewmember(to: Crewmember) {
        this.crewmember = to;
    }

    getCrewmember() {
        return this.crewmember;
    }

    getAttackType() {
        return this.attackType;
    }

    setAttackType(type: WeaponEntityAttackType) {
        this.attackType = type;
    }

    /**
     * Gets the currently controlled "main" unit
     * not always a crewmember
     */
    getUnit() {
        return this.force ? this.force.getActiveUnitFor(this.player) : undefined;
    }

    /**
     * Saves the player's data to a text file
     */
    public save() {
        const saveLoad = SyncSaveLoad.getInstance();
        if (this.player.isLocal()) {
            saveLoad.writeFile(`Codename Askellon\\${this.originalName}\\save.txt`, 
                `Player:${this.originalName}\n`+
                `WeaponTypeState:${this.attackType}\n`+
                `GamesPlayed:${this.gamesPlayed}\n`+
                `GamesLeft:${this.gamesLeft}\n`+
                `PlayerDeaths:${this.playerDeaths}\n`+
                `PlayerTeamKills:${this.playerTeamkills}\n`+
                `PlayerEnemyKills:${this.playerEnemyKills}\n`+
                `PlayerGamesWon:${this.playerGamesWon}\n`+
                `PlayerGamesLost:${this.playerGamesLost}\n`
            );
        }
    }

    public load(cb?: () => void) {
        const saveLoad = SyncSaveLoad.getInstance();
        saveLoad.read(`Codename Askellon\\${this.originalName}\\save.txt`, this.player.handle, promise => {
            try {
                const result = Quick.UnpackStringNewlines(promise.finalString);
                result.forEach(r => {
                    const split = r.split(":");
                    const identifier = split[0];
                    const value = split[1];

                    switch(identifier) {
                        case "WeaponTypeState":
                            const t = Number(value);
                            this.setAttackType(t);
                            break;
                        case "GamesPlayed":
                            this.gamesPlayed = Number(value);
                            break;
                        case "GamesLeft":
                            this.gamesLeft = Number(value);
                            break;
                        case "PlayerDeaths":
                            this.playerDeaths = Number(value);
                            break;
                        case "PlayerTeamKills":
                            this.playerTeamkills = Number(value);
                            break;
                        case "PlayerEnemyKills":
                            this.playerEnemyKills = Number(value);
                            break;
                        case "PlayerGamesWon":
                            this.playerGamesWon = Number(value);
                            break;
                        case "PlayerGamesLost":
                            this.playerGamesLost = Number(value);
                            break;
                        case "Player":
                            if (this.originalName != value) {
                                Log.Warning(`${this.originalName} HAS AN ALTERED SAVE FILE`);
                            }
                    }
                });
            }
            catch(e) {
                Log.Warning("Error when loading player "+this.originalName);
                Log.Warning(e);
            }
            if (cb) cb();
        });
    }

    public log(toWho: MapPlayer = this.player) {
        MessagePlayer(toWho, `:: Ship Records [${playerColors[this.player.id].code}${this.originalName}|r] ::`);
        MessagePlayer(toWho, `${COL_GOOD}Games Played ::|r ${this.gamesPlayed}`);
        MessagePlayer(toWho, `${COL_GOOD}Games Won ::|r ${this.playerGamesWon}`);
        MessagePlayer(toWho, `${COL_GOOD}Enemy Kills ::|r ${this.playerTeamkills}`);

        MessagePlayer(toWho, `${COLOUR_CULT}Games Left ::|r ${this.gamesLeft}`);
        MessagePlayer(toWho, `${COLOUR_CULT}Games Lost ::|r ${this.playerGamesLost}`);
        MessagePlayer(toWho, `${COLOUR_CULT}Team Kills ::|r ${this.playerTeamkills}`);
    }
}