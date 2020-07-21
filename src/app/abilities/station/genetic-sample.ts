import { Ability } from "../ability-type";
import { AbilityModule } from "../ability-module";
import { Unit } from "w3ts/index";
import { getZFromXY } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT } from "resources/sfx-paths";
import { SoundRef } from "app/types/sound-ref";
import { testerSlots, setTesterLastActivatedTo } from "app/interactions/genetic-tester-interactions";
import { GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { ABIL_ITEM_GENETIC_SAMPLE_INFESTED } from "resources/ability-ids";
import { COL_TEAL } from "resources/colours";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";
import { Log } from "lib/serilog/serilog";
import { ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";

declare const udg_genetic_test_lights: destructable[];
declare const udg_genetic_sequencer_unit: unit;

const SEQUENCE_MAX_DURATION = 10;

const ambienceSoundGeneticSequence = new SoundRef("Sounds\\GeneticSequencerAmbience.mp3", false);

Preload("Sounds\\GeneticSequencerAmbience.mp3");

export class GeneticSequenceAbility implements Ability {
    private timeElapsed = 0;

    constructor() {}

    public initialise(module: AbilityModule) {
        ambienceSoundGeneticSequence.playSoundOnUnit(udg_genetic_sequencer_unit, 30);
        setTesterLastActivatedTo(module.game.getTimeStamp());
        return true;
    };

    public process(module: AbilityModule, delta: number) {
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

    public completeTest(aMod: AbilityModule) {
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

        const allPlayers = aMod.game.forceModule.getActivePlayers();
        if (hasAlienDNA && hasHumanDNA) {
            aMod.game.chatModule.postMessageFor(allPlayers, "GENETICS LAB", '00ffff', "DNA SEQUENCED. CONTAMINANTS DETECTED", undefined, SOUND_COMPLEX_BEEP);
        }
        else {
            aMod.game.chatModule.postMessageFor(allPlayers, "GENETICS LAB", '00ffff', "SEQUENCE COMPLETE. NO MISMATCH", undefined, SOUND_COMPLEX_BEEP);
        }
    }

    public destroy(aMod: AbilityModule) {
        this.completeTest(aMod);

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