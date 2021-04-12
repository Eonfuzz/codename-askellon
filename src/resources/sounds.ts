import { SoundRef, SoundWithCooldown } from "app/types/sound-ref";

export const SOUND_COMPLEX_BEEP = new SoundWithCooldown(5, "Sounds\\ComplexBeep.mp3", true);
export const SOUND_ALIEN_GROWL = new SoundWithCooldown(15, "Sounds\\AlienGrowl.wav", true);
export const SOUND_ALIEN_SCREAM = new SoundWithCooldown(15, "Sounds\\ZergScream1.wav", true);
export const SOUND_EVIL_LATIN = new SoundRef("Sounds\\EvilLatin.mp3", false, true);

export const SOUND_STR_SYNTH_HEAL = "Sounds\\SynthHeal.mp3";
export const SOUND_STR_GENE_LOOP = "Sounds\\GeneticSequencerAmbience.mp3";
export const SOUND_STR_SONIC_RES = "Sounds\\SonicRessonanceCast.mp3";
export const SOUND_STR_ATTACH = "Sounds\\attachToGun.mp3";
export const SOUND_STR_DOOM_STINGER = "Sounds\\doomStinger.mp3";

Preload(SOUND_STR_SYNTH_HEAL);
Preload(SOUND_STR_GENE_LOOP);
Preload(SOUND_STR_SONIC_RES);
Preload(SOUND_STR_ATTACH);
Preload(SOUND_STR_DOOM_STINGER);