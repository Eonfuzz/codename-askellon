import { AbilityWithDone } from "../ability-type";
import { getZFromXY, GetActivePlayers } from "lib/utils";
import { LIGHTS_GREEN, LIGHTS_RED, SFX_LIGHTNING_BOLT } from "resources/sfx-paths";
import { SoundRef } from "app/types/sound-ref";
import { GENETIC_FACILITY_TOOLTIP } from "resources/strings";
import { COL_TEAL, COL_ATTATCH } from "resources/colours";
import { SOUND_COMPLEX_BEEP } from "resources/sounds";
import { ITEM_GENETIC_SAMPLE_INFESTED } from "resources/item-ids";
import { ChatEntity } from "app/chat/chat-entity";
import { testerSlots } from "app/interactions/interactables/genetic-testing-facility";
import { MapPlayer } from "w3ts/index";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ROLE_TYPES } from "resources/crewmember-names";
import { ResearchFactory } from "app/research/research-factory";
import { TECH_MAJOR_REPAIR_TESTER } from "resources/ability-ids";

const SEQUENCE_MAX_DURATION = 10;

const ambienceSoundGeneticSequence = new SoundRef("Sounds\\GeneticSequencerAmbience.mp3", false);
Preload("Sounds\\GeneticSequencerAmbience.mp3");

export class GeneticSequenceAbility extends AbilityWithDone {
    private timeElapsed = 0;
    private static isFirstTest = true;

    

    public init() {
        super.init();
        ambienceSoundGeneticSequence.playSoundOnUnit(udg_genetic_sequencer_unit, 30);

        // Reward bonus XP to doctor ( if caster is doctor )
        const castingPlayer = MapPlayer.fromHandle(GetOwningPlayer(GetTriggerUnit()));

        if (castingPlayer) {
            const pCrew = PlayerStateFactory.getCrewmember(castingPlayer);
            if (pCrew && pCrew.role === ROLE_TYPES.DOCTOR) {
                pCrew.addExperience(200);
            }
        }
        // setTesterLastActivatedTo(GameTimeElapsed.getTime());
        return true;
    };

    public step(delta: number) {
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

        if (this.timeElapsed >= SEQUENCE_MAX_DURATION) {            
            this.done = true; 
        }
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

        if (GeneticSequenceAbility.isFirstTest && ResearchFactory.getInstance().isUpgradeInfested(TECH_MAJOR_REPAIR_TESTER, 1)) {
            hasAlienDNA = !hasAlienDNA;
        } 

        const allPlayers = GetActivePlayers();
        if (hasAlienDNA) {
            ChatEntity.getInstance().postMessageFor(allPlayers, "Blood Tester", '|cff00ffff', `Result: ${COL_ATTATCH}Contaminants|r detected. Quarantine is recommended.`, undefined, SOUND_COMPLEX_BEEP);
        }
        else {
            ChatEntity.getInstance().postMessageFor(allPlayers, "Blood Tester", '|cff00ffff', "Result: No foreign samples detected.", undefined, SOUND_COMPLEX_BEEP);
        }

        GeneticSequenceAbility.isFirstTest = false;
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
            GENETIC_FACILITY_TOOLTIP(testerSlots)
        )

        return true;
    };
}