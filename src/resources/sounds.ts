import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";

export const SOUND_COMPLEX_BEEP = new SoundWithCooldown(5, "Sounds\\ComplexBeep.mp3", true);
export const SOUND_ALIEN_GROWL = new SoundWithCooldown(15, "Sounds\\AlienGrowl.wav", true);
export const SOUND_ALIEN_SCREAM = new SoundWithCooldown(15, "Sounds\\ZergScream1.wav", true);

export const SOUND_STR_SYNTH_HEAL = "Sounds\\SynthHeal.mp3";
export const SOUND_STR_GENE_LOOP = "Sounds\\GeneticSequencerAmbience.mp3";

Preload(SOUND_STR_SYNTH_HEAL);
Preload(SOUND_STR_GENE_LOOP);