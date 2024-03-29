import { AbilityWithDone } from "../ability-type";
import { Effect, Unit } from "w3ts/index";
import { Vector3 } from "app/types/vector3";
import { getZFromXY } from "lib/utils";
import { getYawPitchRollFromVector, PlayNewSoundOnUnit } from "lib/translators";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { CULT_FORCE_NAME } from "app/force/forces/force-names";
import { CultistForce } from "app/force/forces/cultist/cultist-force";
import { SFX_CONVOKE_CARRION } from "resources/sfx-paths";
import { BUFF_ID_MADNESS } from "resources/buff-ids";

export class CeremonialDaggerItemAbility extends AbilityWithDone {
    private targetLoc: Vector3;
    private desiredDistance = 120;
    private dashSpeed = 600;
    private distanceMoved = 0;

    public init() {
        super.init();
        this.casterUnit = Unit.fromHandle(GetTriggerUnit());
        this.targetUnit = Unit.fromHandle(GetSpellTargetUnit());        
        
        this.targetLoc = Vector3.fromWidget(this.targetUnit.handle);
        return true;
    };

    public step(delta: number) {
        // update target loc
        this.targetLoc = Vector3.fromWidget(this.targetUnit.handle);
        // Get our current loc
        const uLoc = Vector3.fromWidget(this.casterUnit.handle);

        const dLoc = this.targetLoc.subtract(uLoc);
        const travelVec = dLoc.normalise().multiplyN(this.dashSpeed * delta);

        this.distanceMoved += this.dashSpeed * delta;

        this.casterUnit.x += travelVec.x;
        this.casterUnit.y += travelVec.y;
        
        if (dLoc.getLength() <= this.desiredDistance) {

            // Interp towards unit
            const sfxLoc = uLoc.projectTowards2D(uLoc.angle2Dto(this.targetLoc), 50);
    
            const sfx = new Effect("Models\\sfx\\animeslashfinal.mdx", sfxLoc.x, sfxLoc.y);
            sfx.scale = 0.8;
            sfx.setTimeScale(0.6);
            sfx.setColor(255, 50, 65);
            sfx.z = getZFromXY(this.targetLoc.x, this.targetLoc.y) + 100;
            
            const rotData = getYawPitchRollFromVector(sfxLoc.subtract(uLoc));
    
            PlayNewSoundOnUnit("Sounds\\Slash.mp3", this.casterUnit, 40);

            sfx.setYaw(rotData.yaw);
            sfx.setRoll(rotData.roll);
            sfx.setPitch(rotData.pitch);
            sfx.destroy();

            const uHasInsanity = UnitHasBuffBJ(this.targetUnit.handle, BUFF_ID_MADNESS);

            const doKill = uHasInsanity && this.targetUnit.life <= 200 || this.targetUnit.life <= 50;

            if (!doKill) {
                this.casterUnit.damageTarget(this.targetUnit.handle, uHasInsanity ? 200 : 50, true, false, ATTACK_TYPE_HERO, DAMAGE_TYPE_UNKNOWN, WEAPON_TYPE_WHOKNOWS);
            }
            else {
                const cultistForce = PlayerStateFactory.getForce(CULT_FORCE_NAME) as CultistForce;
                cultistForce.playSpinExplodeanimationFor(this.targetUnit, () => {

                    this.casterUnit.damageTarget(this.targetUnit.handle, 999999, true, false, 
                        ATTACK_TYPE_HERO, 
                        DAMAGE_TYPE_UNKNOWN,
                        WEAPON_TYPE_WHOKNOWS
                    );
                    this.targetUnit.x = 0;
                    this.targetUnit.y = 0;
                    this.targetUnit.show = false;

                    if (this.targetUnit.isHero()) {
                        const sfx = new Effect(SFX_CONVOKE_CARRION, this.casterUnit.x, this.casterUnit.y);
                        sfx.z = getZFromXY(this.casterUnit.x, this.casterUnit.y) + 10;
                        sfx.destroy();

                        this.casterUnit.strength += 7;
                        this.casterUnit.intelligence += 5;
                        this.casterUnit.owner.setState(
                            PLAYER_STATE_RESOURCE_LUMBER, 
                            this.casterUnit.owner.getState(PLAYER_STATE_RESOURCE_LUMBER) + 1
                        );
                    }
                });    
            }

            this.done = true; 
            return false;
        }

        // Have we moved max distance?
        if (this.distanceMoved > 600) 
            this.done = true; 

        // Else keep going
        return true;

    };

    public destroy() {
        return true;
    };
}