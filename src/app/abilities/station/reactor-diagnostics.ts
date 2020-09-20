import { Ability } from "../ability-type";
import { getZFromXY, GetActivePlayers } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT } from "resources/sfx-paths";
import { SoundRef } from "app/types/sound-ref";
import { testerSlots } from "app/interactions/interactables/genetic-tester";
import { GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { COL_TEAL, COL_ATTATCH, COL_INFO, COL_MISC, COL_GOOD, COL_ORANGE } from "resources/colours";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";
import { ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";
import { ChatEntity } from "app/chat/chat-entity";
import { Timers } from "app/timer-type";
import { MapPlayer } from "w3ts/index";
import { PlayNewSound } from "lib/translators";
import { AskellonEntity } from "app/station/askellon-entity";

export class ReactorDiagnosticsAbility implements Ability {
    constructor() {}

    public initialise() {

        const castingPlayer = MapPlayer.fromHandle(GetOwningPlayer(GetTriggerUnit()));

        Timers.addTimedAction(0, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 32);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 22, `${COL_MISC}>> 178f:6139:9d2a:5024:5429:0d00:816a:4045|r diag --rtime`);
        });
        Timers.addTimedAction(2, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 20, `${COL_MISC}>>|r Running System Diagnostics...`);
        });
        Timers.addTimedAction(3.5, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 18.5, `${COL_MISC}--->|r Reactor Integrity: ${COL_GOOD}Standard|r`);
        });
        Timers.addTimedAction(3.75, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 18.25, `${COL_MISC}------->|r Fusion Core: ${COL_GOOD}Active|r`);
        });
        Timers.addTimedAction(4, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 18, `${COL_MISC}------->|r Fission Convectors: ${COL_GOOD}Engaged|r`);
        });
        Timers.addTimedAction(4.25, () => {
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 17.75, `${COL_MISC}------->|r Radiation Scrubbers: ${COL_GOOD}Clean|r`);
        });
        Timers.addTimedAction(5.75, () => {
            const p = AskellonEntity.getPowerPercent();
            const c = p <= 0.3 ? COL_ATTATCH : (p <= 0.7 ? COL_ORANGE : COL_GOOD);
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 16.25,
                `${COL_MISC}--->|r Power Status: ${c}${MathRound(p*100)}%|r`);
        });
        Timers.addTimedAction(6, () => {
            const p = AskellonEntity.getPowerPercent();
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 16,
                `${COL_MISC}------->|r Maximum Power: ${COL_GOOD}${AskellonEntity.getMaxPower()}|r`);
        });
        Timers.addTimedAction(6.25, () => {
            const p = AskellonEntity.getPowerPercent();
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15.75,
                `${COL_MISC}------->|r Current Power: ${COL_GOOD}${AskellonEntity.getCurrentPower()}|r`);
        });
        Timers.addTimedAction(6.5, () => {
            const p = AskellonEntity.getPowerPercent();
            PlayNewSound("Sounds\\ComplexBeep.mp3", 30);
            DisplayTimedTextToForce(bj_FORCE_ALL_PLAYERS, 15.5,
                `${COL_MISC}------->|r Generation: ${COL_GOOD}${AskellonEntity.getPowerGeneration()} M-kW|r`);
        });
        return true;
    };

    public process(delta: number) {
        return false;
    };

    public destroy() {
        return true;
    };
}