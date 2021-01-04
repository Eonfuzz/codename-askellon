import { SoundWithCooldown, SoundRef } from "../../types/sound-ref";
import { ABIL_ACCURACY_PENALTY_30, ABIL_DESPAIR, ABIL_APPLY_MADNESS } from "resources/ability-ids";
import { BUFF_ID, BUFF_ID_DESPAIR, BUFF_ID_SIGNAL_BOOSTER, BUFF_ID_PURITY_SEAL, BUFF_ID_MADNESS } from "resources/buff-ids";
import { Unit, MapPlayer, Timer } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { DummyCast } from "lib/dummy";
import { Log } from "lib/serilog/serilog";
import { ForceEntity } from "app/force/force-entity";
import { ALIEN_FORCE_NAME } from "app/force/forces/force-names";
import { AlienForce } from "app/force/forces/alien-force";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ChatHook } from "app/chat/chat-hook-type";
import { ChatEntity } from "app/chat/chat-entity";
import { COL_MISC } from "resources/colours";
import { BuffInstance } from "../buff-instance-type";
import { BuffInstanceDuration } from "../buff-instance-duration-type";
import { Projectile } from "app/weapons/projectile/projectile";
import { Vector3 } from "app/types/vector3";
import { getZFromXY, MessagePlayer } from "lib/utils";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { Game } from "app/game";
import { GameTimeElapsed } from "app/types/game-time-elapsed";
import { COLOUR_CULT } from "app/force/forces/cultist/constants";
import { Quick } from "lib/Quick";
import { randomWords } from "resources/words";
import { FogEntity, FogTransition } from "app/vision/fog-entity";

export const whisperLoop = new SoundRef("Sounds\\whisperLoop.mp3", true, true);
Preload("Sounds\\whisperLoop.mp3");
export const madnessModels = [
    "war3mapImported\\testMarine.mdx", 
    "war3mapImported\\MarineCorpse.mdl",
    "Models\\Eldritch Covenant.mdl",
    "Units\\Critters\\zergling\\zergling.mdl", 
    "Sc2\\Units\\sc2-zerg-larva-spawn-egg-mdx-1.1.mdl",
];

// How often insanity ticks increase
export const INSANTIY_TICK = 1;

/**
 * Resolve is a buff applied to a unit
 * Can be applied multiple times and from multiple sources
 */
export class Madness extends DynamicBuff {
    name = BUFF_ID.MADNESS;

    private unit: Unit;
    protected doesStack = false;
    private hookId: number;
    private timeElapsed = 0;

    // Starts off at zero
    private insanity = 0;
    private maxInsanity = 100;
    private sanityDebuffAt = this.maxInsanity - 10;

    private insanityTicker = 0;

    private hallucinationIn = GetRandomReal(5, 15);

    private hallucinations: Projectile[] = [];
    private projectileTimestamp = new WeakMap<Projectile, number>();
    
    private cultistGodSoundByte = new SoundRef("Sounds\\HorrorRiser.mp3", false, true);

    constructor(who: Unit) {
        super();        

        this.unit = who;
    }

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(unit, instance, isNegativeInstance);
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        this.timeElapsed += delta;
        
        if (!this.isActive) return result;

        this.insanityTicker += delta;
        if (this.insanityTicker > INSANTIY_TICK) {
            const oldVal = this.insanity;
            this.insanityTicker -= INSANTIY_TICK;

            if (UnitHasBuffBJ(this.unit.handle, BUFF_ID_PURITY_SEAL)) {
                this.insanity--;
            }
            else {
                this.insanity++;
            }
            this.insanity = Math.min(this.insanity, this.maxInsanity);

            // Remove this buff
            if (this.insanity <= 0) {
                Log.Information("Insnaity done")
                return false;
            }

            if (oldVal < this.sanityDebuffAt && this.insanity >= this.sanityDebuffAt) {
                // Apply insanity debuff sound
                // Apply insanity buff
                if (this.unit.owner.handle === GetLocalPlayer()) 
                    this.cultistGodSoundByte.playSound();
                if (!UnitHasBuffBJ(this.unit.handle, BUFF_ID_MADNESS)) {
                    // If we don't have another ticker apply the buff to the unit
                    DummyCast((dummy: unit) => {
                        SetUnitX(dummy, this.unit.x);
                        SetUnitY(dummy, this.unit.y + 50);
                        IssueTargetOrder(dummy, "faeriefire", this.unit.handle);
                    }, ABIL_APPLY_MADNESS);

                    FogEntity.transition(this.unit.owner, {
                        fStart: 950,
                        fEnd: 2200,
                        density: 1,
                        r: 138, g: 8, b: 3
                    }, 15);
                }
            }
            else if (this.insanity > this.sanityDebuffAt && this.unit.show && !UnitHasBuffBJ(this.unit.handle, BUFF_ID_MADNESS)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.unit.x);
                    SetUnitY(dummy, this.unit.y + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.unit.handle);
                }, ABIL_APPLY_MADNESS);
            }
            else if (oldVal >= this.sanityDebuffAt && this.insanity < this.sanityDebuffAt) {
                // Remove buff
                UnitRemoveBuffBJ(BUFF_ID_MADNESS, this.unit.handle);
                FogEntity.transition(this.unit.owner, {
                    fStart: 950,
                    fEnd: 3000,
                    density: 1,
                    r: 60, g: 60, b: 80
                }, 10);
            }
        }
        
        if (GetLocalPlayer() === this.unit.owner.handle) {
            const v = Math.min(127,  127 * this.insanity / this.maxInsanity);
            whisperLoop.setVolume( MathRound(v) );
        }

        this.hallucinationIn -= delta;
        if (this.hallucinationIn <= 0) {
            const mod = Math.min(5,  3 * this.insanity / this.maxInsanity);
            this.hallucinationIn = GetRandomReal(15 / mod, 27 / mod);

            this.createHallucination();
        }

        return result;
    }

    private createHallucination() {
        try {

            const bounds = 800;

            const spawnSide = GetRandomInt(1, 4);
            // 1 being top left
            let x, y, z;
            switch(spawnSide) {
                case 1:
                    x = this.unit.x + GetRandomReal(-bounds, bounds);
                    y = this.unit.y + bounds;
                    break;
                case 2:
                    x = this.unit.x + GetRandomReal(-bounds, bounds);
                    y = this.unit.y - bounds;
                    break;
                case 3:
                    x = this.unit.x + bounds;
                    y = this.unit.y + GetRandomReal(-bounds, bounds);
                    break;
                case 4:
                    x = this.unit.x - bounds;
                    y = this.unit.y + GetRandomReal(-bounds, bounds);
                    break;
            }

            z = getZFromXY(x, y) + 5;

            const x2 = this.unit.x + GetRandomReal(-bounds, bounds);
            const y2 = this.unit.y + GetRandomReal(-bounds, bounds);
            const z2 = getZFromXY(x2, y2);

            const origin = new Vector3(x, y, z);

            const typeSeed = GetRandomReal(0, 100);

            if (typeSeed <= 70) {

                const target = new Vector3(x2, y2, z2);
                const deltaTarget = target.subtract(origin)
                const projectile = new Projectile(
                    this.unit.handle,
                    origin,
                    new ProjectileTargetStatic(deltaTarget)
                )
                .setVelocity(GetRandomInt(230, 330))
                .onCollide((projectile, who) => true)
                .onDeath((projectile: Projectile) => {
                    const lifeTime = this && this.projectileTimestamp && this.projectileTimestamp.get(projectile);
                    if (lifeTime && (GameTimeElapsed.getTime() - lifeTime) <= 10) {
                        return false;
                    }
                    else {
                        projectile.getSfx().forEach( e => {
                            const sfx = e.getEffect();
                            BlzSetSpecialEffectX(sfx, 0);
                            BlzSetSpecialEffectY(sfx, 0);
                        });
                        return true;
                    }
                });

                // Now add effect
                const isLocal = GetLocalPlayer() === this.unit.owner.handle;
                const sfxString = this.getMadnessModel(1);
                const sfx = projectile.addEffect(
                    isLocal ? sfxString : "", 
                    new Vector3(0, 0, 0), deltaTarget.normalise(), 
                    0.8
                );
                this.projectileTimestamp.set(projectile, GameTimeElapsed.getTime());
                BlzSetSpecialEffectColorByPlayer(sfx,  MapPlayer.fromIndex(GetRandomInt(0, 12)).handle);
                BlzPlaySpecialEffect(sfx, ANIM_TYPE_WALK);
                EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: this.unit, data: { projectile: projectile }});
            }
            else {
                const target = new Vector3(x, y, -10);
                const deltaTarget = target.subtract(origin);
                const projectile = new Projectile(
                    this.unit.handle,
                    origin,
                    new ProjectileTargetStatic(deltaTarget)
                )
                .setVelocity(0.1)
                .onCollide((projectile, who) => true)
                .onDeath((projectile: Projectile) => {
                    const lifeTime = this && this.projectileTimestamp && this.projectileTimestamp.get(projectile);
                    if (lifeTime && (GameTimeElapsed.getTime() - lifeTime) <= 10) {
                        return false;
                    }
                    else {
                        projectile.getSfx().forEach( e => {
                            const sfx = e.getEffect();
                            BlzSetSpecialEffectX(sfx, 0);
                            BlzSetSpecialEffectY(sfx, 0);
                        });
                        return true;
                    }
                });

                // Now add effect
                const isLocal = GetLocalPlayer() === this.unit.owner.handle;
                const sfxString = this.getMadnessModel(0);
                const sfx = projectile.addEffect(
                    isLocal ? sfxString : "", 
                    new Vector3(0, 0, 0), new Vector3(GetRandomReal(-1, 1), GetRandomReal(-1, 1), 0), 
                    0.8
                );
                this.projectileTimestamp.set(projectile, GameTimeElapsed.getTime());
                BlzSetSpecialEffectColorByPlayer(sfx,  MapPlayer.fromIndex(GetRandomInt(0, 12)).handle);
                BlzPlaySpecialEffect(sfx, ANIM_TYPE_STAND);
                EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: this.unit, data: { projectile: projectile }});
            }
        }
        catch(e) {
            Log.Error(e);
        }
    }

    /**
     *
     * @param type 0 for standing 1 for moving 
     */
    private getMadnessModel(type: number) {
        if (type === 1) {
            const seed = GetRandomReal(0, 100);
            if (seed <= 70) return madnessModels[0];
            else if (seed <= 99) return madnessModels[3]
            else return madnessModels[1];
        }
        else {
            const seed = GetRandomReal(0, 100);
            if (seed <= 70) return madnessModels[0];
            else if (seed <= 80) return madnessModels[1]
            else if (seed <= 85) return madnessModels[2]
            else if (seed <= 99) return madnessModels[3]
            else  return madnessModels[4]
        }
    }

    public onStatusChange(newStatus: boolean) {
        if (newStatus) {
            this.hookId = ChatEntity.getInstance().addHook((hook: ChatHook) => this.processChat(hook));

            // End music and sounds
            if (GetLocalPlayer() === this.unit.owner.handle) {
                whisperLoop.setVolume(0);
                whisperLoop.playSound();
                // SetMusicVolume(0);
            }
            FogEntity.transition(this.unit.owner, {
                fStart: 950,
                fEnd: 3000,
                density: 1,
                r: 60, g: 60, b: 80
            }, 40);
        }
        else {
            // Also remove resolve buff
            UnitRemoveBuffBJ(BUFF_ID_MADNESS, this.unit.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));

            // End music and sounds
            if (GetLocalPlayer() === this.unit.owner.handle) {
                whisperLoop.stopSound(true);
                // SetMusicVolume(30);
            }
            
            FogEntity.reset(this.unit.owner, 10);
            
            ChatEntity.getInstance().removeHook(this.hookId);
        }
    }

    
    private processChat(chat: ChatHook) {
        try {
            if (chat.who === this.who.owner && chat.name === this.who.nameProper) {
                const isInsaneTalk = GetRandomReal(0, 100) < ((this.insanity / this.maxInsanity) * 100);
                const pCrew = PlayerStateFactory.getCrewmember(chat.who);


                if (isInsaneTalk) {
                    let seed = GetRandomReal(0, 100);

                    const message: string = (seed <= 30) 
                        ? Quick.GetRandomFromArray(ChatEntity.getInstance().getPreviousMessages(), 1)[0]
                        : chat.message;
                    let nMessage: string = message || chat.message || '';
                    const tokenisedMessage: string[] = [];

                    Quick.Tokenize(nMessage).forEach(token => {
                        tokenisedMessage.push(token);
                    });


                    let stringBuilder: string = '';

                    tokenisedMessage.forEach(token => {
                        seed = GetRandomReal(0, 100);
                        if (seed >= 10 && token.toLowerCase() !== "carrion") {
                            token = Quick.ReplaceVowelWith(token, (char: string) => {
                                const seed = GetRandomReal(0, 100);
                                if (seed <= 30)
                                    return "?";
                                else if (seed <= 60)
                                    return "y";
                                else return "l";
                            });
                        }
                        stringBuilder += token+" ";
                    });
                    chat.message = stringBuilder;
                }
            }
            return chat;
        }
        catch(e) {
            Log.Error(e);
            return chat;
        }
    }

    public destroy() {
        this.destroy();
        this.cultistGodSoundByte.destroy();
    }
}