import { SoundWithCooldown, SoundRef } from "../../types/sound-ref";
import { ABIL_ACCURACY_PENALTY_30, ABIL_DESPAIR, ABIL_APPLY_MADNESS } from "resources/ability-ids";
import { BUFF_ID, BUFF_ID_DESPAIR, BUFF_ID_SIGNAL_BOOSTER, BUFF_ID_PURITY_SEAL, BUFF_ID_MADNESS } from "resources/buff-ids";
import { Unit, MapPlayer, Timer, Effect } from "w3ts/index";
import { DynamicBuff } from "../dynamic-buff-type";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { DummyCast } from "lib/dummy";
import { Log } from "lib/serilog/serilog";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { ChatHook } from "app/chat/chat-hook-type";
import { ChatEntity } from "app/chat/chat-entity";
import { BuffInstance } from "../buff-instance-type";
import { Projectile } from "app/weapons/projectile/projectile";
import { Vector3 } from "app/types/vector3";
import { getZFromXY, MessagePlayer } from "lib/utils";
import { ProjectileTargetStatic, ProjectileMoverLinear } from "app/weapons/projectile/projectile-target";
import { GameTimeElapsed } from "app/types/game-time-elapsed";
import { Quick } from "lib/Quick";
import { FogEntity, FogTransition } from "app/vision/fog-entity";
import { SFX_BURNING_RAGE_PURPLE } from "resources/sfx-paths";
import { randomWords } from "resources/words";
import { CULT_FORCE_NAME } from "app/force/forces/force-names";
import { CultistForce } from "app/force/forces/cultist/cultist-force";

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
    id = BUFF_ID.MADNESS;
    protected doesStack = false;
    private hookId: number;
    private timeElapsed = 0;

    // Starts off at zero
    private insanity = 0;
    private maxInsanity = 60;
    private sanityDebuffAt = this.maxInsanity - 10;

    private insanityTicker = 0;

    private hallucinationIn = GetRandomReal(5, 15);

    private hallucinations: Projectile[] = [];
    private projectileTimestamp = new WeakMap<Projectile, number>();
    
    private cultistGodSoundByte = new SoundRef("Sounds\\HorrorRiser.mp3", false, true);

    private insanityPreviewEffect!: Effect;

    constructor(who: Unit) {
        super();
    }

    public addInstance(unit: Unit, instance: BuffInstance, isNegativeInstance?: boolean) {
        super.addInstance(unit, instance, isNegativeInstance);

        if (this.instances.length > 1) {
            this.insanityTicker += this.maxInsanity * 0.33;
        }
    }

    public process(gametime: number, delta: number): boolean {
        const result =  super.process(gametime, delta);
        this.timeElapsed += delta;
        
        if (!this.isActive) return result;

        this.insanityTicker += delta;
        if (this.insanityTicker > INSANTIY_TICK) {
            const oldVal = this.insanity;
            this.insanityTicker -= INSANTIY_TICK;

            const hasPuritySeal = UnitHasBuffBJ(this.who.handle, BUFF_ID_PURITY_SEAL);
            // Only increment insanity status while it has despair
            if (UnitHasBuffBJ(this.who.handle, BUFF_ID_DESPAIR) && !hasPuritySeal) {
                this.insanity++;
            }
            else if (hasPuritySeal) {
                this.insanity--;
            }
            
            this.insanity = Math.min(this.insanity, this.maxInsanity);

            // Remove this buff
            if (this.insanity <= 0) {
                return false;
            }

            if (oldVal < this.sanityDebuffAt && this.insanity >= this.sanityDebuffAt) {
                // Apply insanity debuff sound
                // Apply insanity buff
                this.cultistGodSoundByte.playSoundForPlayer(this.who.owner);
                if (!UnitHasBuffBJ(this.who.handle, BUFF_ID_MADNESS)) {
                    // If we don't have another ticker apply the buff to the unit
                    DummyCast((dummy: unit) => {
                        SetUnitX(dummy, this.who.x);
                        SetUnitY(dummy, this.who.y + 50);
                        IssueTargetOrder(dummy, "faeriefire", this.who.handle);
                    }, ABIL_APPLY_MADNESS);

                    FogEntity.transition(this.who.owner, {
                        fStart: 950,
                        fEnd: 2200,
                        density: 1,
                        r: 138, g: 8, b: 3
                    }, 15);
                }
            }
            else if (this.insanity > this.sanityDebuffAt && this.who.show && !UnitHasBuffBJ(this.who.handle, BUFF_ID_MADNESS)) {
                // If we don't have another ticker apply the buff to the unit
                DummyCast((dummy: unit) => {
                    SetUnitX(dummy, this.who.x);
                    SetUnitY(dummy, this.who.y + 50);
                    IssueTargetOrder(dummy, "faeriefire", this.who.handle);
                }, ABIL_APPLY_MADNESS);
            }
            else if (oldVal >= this.sanityDebuffAt && this.insanity < this.sanityDebuffAt) {
                // Remove buff
                whisperLoop.setVolume( 0 );
                UnitRemoveBuffBJ(BUFF_ID_MADNESS, this.who.handle);
                FogEntity.transition(this.who.owner, {
                    fStart: 950,
                    fEnd: 3000,
                    density: 1,
                    r: 60, g: 60, b: 80
                }, 10);
            }

            // Update our audio volume for whispers~!
            if (GetLocalPlayer() === this.who.owner.handle) {
                const v = Quick.Clamp(255 * (this.insanity / this.maxInsanity) - 127, 0, 127);
                whisperLoop.setVolume( MathRound(v) );
            }
            
            if (this.insanity > this.sanityDebuffAt) {
                
                this.hallucinationIn -= INSANTIY_TICK;
                if (this.hallucinationIn <= 0) {
                    const mod = Math.min(5,  3 * this.insanity / this.maxInsanity);
                    this.hallucinationIn = GetRandomReal(15 / mod, 27 / mod);
        
                    this.createHallucination();
                }   
            }
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
                    x = this.who.x + GetRandomReal(-bounds, bounds);
                    y = this.who.y + bounds;
                    break;
                case 2:
                    x = this.who.x + GetRandomReal(-bounds, bounds);
                    y = this.who.y - bounds;
                    break;
                case 3:
                    x = this.who.x + bounds;
                    y = this.who.y + GetRandomReal(-bounds, bounds);
                    break;
                case 4:
                    x = this.who.x - bounds;
                    y = this.who.y + GetRandomReal(-bounds, bounds);
                    break;
            }

            z = getZFromXY(x, y) + 5;

            const x2 = this.who.x + GetRandomReal(-bounds, bounds);
            const y2 = this.who.y + GetRandomReal(-bounds, bounds);
            const z2 = getZFromXY(x2, y2);

            const origin = new Vector3(x, y, z);

            const typeSeed = GetRandomReal(0, 100);

            if (typeSeed <= 70) {

                const target = new Vector3(x2, y2, z2);
                const deltaTarget = target.subtract(origin)
                const projectile = new Projectile(
                    this.who.handle,
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
                const isLocal = GetLocalPlayer() === this.who.owner.handle;
                const sfxString = this.getMadnessModel(1);
                const sfx = projectile.addEffect(
                    isLocal ? sfxString : "", 
                    new Vector3(0, 0, 0), deltaTarget.normalise(), 
                    0.8
                );
                this.projectileTimestamp.set(projectile, GameTimeElapsed.getTime());
                BlzSetSpecialEffectColorByPlayer(sfx,  MapPlayer.fromIndex(GetRandomInt(0, 12)).handle);
                BlzPlaySpecialEffect(sfx, ANIM_TYPE_WALK);
                EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: this.who, data: { projectile: projectile }});
            }
            else {
                const target = new Vector3(x, y, -10);
                const deltaTarget = target.subtract(origin);
                const projectile = new Projectile(
                    this.who.handle,
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
                const isLocal = GetLocalPlayer() === this.who.owner.handle;
                const sfxString = this.getMadnessModel(0);
                const sfx = projectile.addEffect(
                    isLocal ? sfxString : "", 
                    new Vector3(0, 0, 0), new Vector3(GetRandomReal(-1, 1), GetRandomReal(-1, 1), 0), 
                    0.8
                );
                this.projectileTimestamp.set(projectile, GameTimeElapsed.getTime());
                BlzSetSpecialEffectColorByPlayer(sfx,  MapPlayer.fromIndex(GetRandomInt(0, 12)).handle);
                BlzPlaySpecialEffect(sfx, ANIM_TYPE_STAND);
                EventEntity.send(EVENT_TYPE.ADD_PROJECTILE, { source: this.who, data: { projectile: projectile }});
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
        const cultForce = PlayerStateFactory.getForce(CULT_FORCE_NAME) as CultistForce;
        const buffSource = this.getBuffSource().owner;

        if (newStatus) {
            this.hookId = ChatEntity.getInstance().addHook((hook: ChatHook) => this.processChat(hook));
            // End music and sounds
            whisperLoop.setVolume(0);
            whisperLoop.playSoundForPlayer(this.who.owner);
            whisperLoop.setVolume(0);

            if (buffSource && cultForce.getPlayerHasGraveGift(buffSource) === true) {
                this.who.shareVision(buffSource, true);
            }
            
            if (!this.insanityPreviewEffect) {
                const source = this.instances.map(i => i.source)[0];
                if (!this.insanityPreviewEffect) {
                    // Lets create a preview above the unit's head
                    let sfx = source.owner.isLocal() ? SFX_BURNING_RAGE_PURPLE : "";
                    this.insanityPreviewEffect = new Effect(sfx, this.who, "overhead");
                }
            }
        }
        else {
            // Also remove resolve buff
            UnitRemoveBuffBJ(BUFF_ID_MADNESS, this.who.handle);
            this.onChangeCallbacks.forEach(cb => cb(this));

            whisperLoop.stopSound(true);
            
            FogEntity.reset(this.who.owner, 10);
            
            this.cultistGodSoundByte.destroy();
            ChatEntity.getInstance().removeHook(this.hookId);

            if (buffSource && cultForce.getPlayerHasGraveGift(buffSource) === true) {
                this.who.shareVision(buffSource, false);
            }

            if (this.insanityPreviewEffect) {
                this.insanityPreviewEffect.destroy();
                this.insanityPreviewEffect = undefined;
            }
        }
    }

    
    private processChat(chat: ChatHook) {
        try {
            if (this.insanity > this.sanityDebuffAt) { 
                if (chat.who === this.who.owner && chat.name === this.who.nameProper) {
                    const isInsaneTalk = GetRandomReal(0, 100) < ((this.insanity / this.maxInsanity) * 100);
                    const pCrew = PlayerStateFactory.getCrewmember(chat.who);


                    if (isInsaneTalk) {
                        const message: string = chat.message;
                        let nMessage: string = message || chat.message || '';
                        const tokenisedMessage: string[] = [];

                        Quick.Tokenize(nMessage).forEach(token => {
                            const seed = GetRandomReal(0, 100);
    
                            if (seed >= 80) {
                                tokenisedMessage.push(token);
                            }
                            else {
                                tokenisedMessage.push(Quick.GetRandomFromArray(randomWords, 1)[0]);
                            }
                        });


                        let stringBuilder: string = '';

                        tokenisedMessage.forEach(token => {
                            stringBuilder += token+" ";
                        });
                        chat.message = stringBuilder;
                    }
                }
            }
            return chat;
        }
        catch(e) {
            Log.Error(e);
            return chat;
        }
    }
}