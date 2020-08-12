import { Ability } from "../ability-type";
import { getZFromXY, GetActivePlayers } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT } from "resources/sfx-paths";
import { SoundRef } from "app/types/sound-ref";
import { testerSlots, setTesterLastActivatedTo } from "app/interactions/interactables/genetic-tester";
import { GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { COL_TEAL, COL_ATTATCH } from "resources/colours";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";
import { Log } from "lib/serilog/serilog";
import { ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";
import { Game } from "app/game";
import { ForceEntity } from "app/force/force-entity";
import { ChatEntity } from "app/chat/chat-entity";
import { GameTimeElapsed } from "app/types/game-time-elapsed";

declare const udg_genetic_test_lights: destructable[];
declare const udg_genetic_sequencer_unit: unit;

const SEQUENCE_MAX_DURATION = 10;

const ambienceSoundGeneticSequence = new SoundRef("Sounds\\GeneticSequencerAmbience.mp3", false);

Preload("Sounds\\GeneticSequencerAmbience.mp3");

export class GeneticSequenceAbility implements Ability {
    private timeElapsed = 0;

    constructor() {}

    public initialise() {
        ambienceSoundGeneticSequence.playSoundOnUnit(udg_genetic_sequencer_unit, 30);
        setTesterLastActivatedTo(GameTimeElapsed.getTime());
        return true;
    };

    public process(delta: number) {
        this.timeElapsed += delta;

        const redLight = MathRound(this.timeElapsed*6) % 4;

        for (let i = 0; i < 4; i++) {

            const dX = GetDestructableX(udg_genetic_test_lights[i]);
            const dY = GetDestructableY(udg_genetic_test_lights[i]);
            const dZ = getZFromXY(dX, dY) + 50;

            RemoveDestructable(udg_genetic_test_lights[i]);

            udg_genetic_test_lights[i] = CreateDestructableZ(
                (redLight === i) ? LIGHTS_GREEN : LIGHTS_RED,
                dX, dY, dZ, 0, 1, 0
            );
        }

        return this.timeElapsed <= SEQUENCE_MAX_DURATION;
    };

    public completeTest() {
        let hasAlienDNA = false;
        let hasHumanDNA = false;
        // Do the test
        testerSlots.forEach(item => {
            if (GetItemTypeId(item) === ITEM_GENETIC_SAMPLE_INFESTED) {
                hasAlienDNA = true;
            }
            else {
                hasHumanDNA = true;
            }
        });

        const allPlayers = GetActivePlayers();
        if (hasAlienDNA) {
            ChatEntity.getInstance().postMessageFor(allPlayers, "Genetic Sequencer", '00ffff', `Result: ${COL_ATTATCH}Contaminants|r detected. Quarantine is recommended.`, undefined, SOUND_COMPLEX_BEEP);
        }
        else {
            ChatEntity.getInstance().postMessageFor(allPlayers, "Genetic Sequencer", '00ffff', "Result: No foreign samples detected.", undefined, SOUND_COMPLEX_BEEP);
        }
    }

    public destroy() {
        this.completeTest();

        let dX = GetUnitX(udg_genetic_sequencer_unit);
        let dY = GetUnitY(udg_genetic_sequencer_unit);

        let sfx = AddSpecialEffect(SFX_LIGHTNING_BOLT, dX, dY);
        BlzSetSpecialEffectZ(sfx, getZFromXY(dX, dY));
        DestroyEffect(sfx);


        // Remove all items in inventory
        testerSlots.forEach(i => {
            RemoveItem(i);
        });
        testerSlots.splice(0, testerSlots.length);
        for (let i = 0; i < 4; i++) {

            const dX = GetDestructableX(udg_genetic_test_lights[i]);
            const dY = GetDestructableY(udg_genetic_test_lights[i]);
            const dZ = getZFromXY(dX, dY) + 50;

            RemoveDestructable(udg_genetic_test_lights[i]);

            udg_genetic_test_lights[i] = CreateDestructableZ(
                LIGHTS_RED,
                dX, dY, dZ, 0, 1, 0
            );
        }

        ambienceSoundGeneticSequence.stopSound();
        BlzSetUnitName(
            udg_genetic_sequencer_unit, 
            GENETIC_FACILITY_TOOLTIP(testerSlots[0], testerSlots[1], testerSlots[2], testerSlots[3])
        )

        return true;
    };
}