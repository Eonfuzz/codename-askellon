import { Game } from "../game";

/** @noSelfInFile **/

export class ForceModule {
    public activePlayers: Array<player>;

    constructor(game: Game) {
        // Load and set players based on active and human players
        this.activePlayers = [];
        for (let i = 0; i < GetBJMaxPlayerSlots(); i ++) {
            const currentPlayer = Player(i);
            const isPlaying = GetPlayerSlotState(currentPlayer) == PLAYER_SLOT_STATE_PLAYING;
            const isUser = GetPlayerController(currentPlayer) == MAP_CONTROL_USER;
            if (isPlaying && isUser) {
                this.activePlayers.push(Player(i));
            }
        }
    }

    /**
     * Handles aggression between two players
     * default behaviour sets players as enemies
     * @param player1 
     * @param player2 
     */
    public aggressionBetweenTwoPlayers(player1: player, player2: player) {
        print(`Player aggression between ${GetPlayerName(player1)} and ${GetPlayerName(player2)}`);
        // TODO
        // For now just force them as enemies
        SetPlayerAllianceStateAllyBJ(player1, player2, false);
        SetPlayerAllianceStateAllyBJ(player2, player1, false);
        // TODO
        // Wait 30 seconds
        // Re-ally
    }
}
