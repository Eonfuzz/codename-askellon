import { Vector3 } from "../../types/vector3";
import { Crewmember } from "../../crewmember/crewmember-type";
import { Attachment } from "../attachment/attachment";
import { ArmableUnit } from "./unit-has-weapon";
import { PlayNewSoundOnUnit } from "../../../lib/translators";
import { TECH_CREWMEMBER_ATTACK_ENABLE } from "../../../resources/ability-ids";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { PlayerStateFactory } from "app/force/player-state-entity";
import { WeaponEntityAttackType } from "../weapon-attack-type";
import { Unit, Effect } from "w3ts/index";

export abstract class Gun {
    equippedTo: ArmableUnit | undefined;

    protected spreadAOE: number = 0;
    protected bulletDistance = 1200;

    protected gunPath: string = "Weapons\\MarineGun.mdx";
    protected gunEffect: Effect;

    public name = "default";

    constructor(equippedTo: ArmableUnit) {
        this.equippedTo = equippedTo;
    }
    
    public onAdd(caster: ArmableUnit) {
        this.equippedTo = caster;
        this.equippedTo.onWeaponAdd(this);

        // Enable the attack UI
        SetPlayerTechResearched(caster.unit.owner.handle, TECH_CREWMEMBER_ATTACK_ENABLE, 1);

        // Cast mode adds the ability
        const weaponMode = PlayerStateFactory.get(caster.unit.owner).getAttackType();
        
        const sound = PlayNewSoundOnUnit("Sounds\\attachToGun.mp3", caster.unit, 50);

        this.gunEffect = new Effect(this.gunPath, this.equippedTo.unit, "hand, right");
        this.gunEffect.scale = this.equippedTo.unit.getField(UNIT_RF_SCALING_VALUE) as number;
        this.equippedTo.unit.addAnimationProps("alternate", false);
    }

    public onRemove() {
        if (this.equippedTo) {
            this.gunEffect.destroy();
            this.equippedTo.unit.addAnimationProps("alternate", true);

            // Don't care about mode, always disable attack ui
            SetPlayerTechResearched(this.equippedTo.unit.owner.handle, TECH_CREWMEMBER_ATTACK_ENABLE, 0);

            // If we are cast mode set this remaning cooldown
            
            const weaponMode = PlayerStateFactory.get(this.equippedTo.unit.owner).getAttackType();
            if (weaponMode === WeaponEntityAttackType.CAST) {
                // this.remainingCooldown = BlzGetUnitAbilityCooldownRemaining(this.equippedTo.unit.handle, this.getAbilityId());
            }
            else {
                UnitAddAbility(this.equippedTo.unit.handle, FourCC('Abun'));
            }

            this.equippedTo.onWeaponRemove(this);
            // Handle no crewmember?
            this.equippedTo = undefined;
        }
    }

    public onShoot(caster: Unit, targetLocation: Vector3): void {
        // this.remainingCooldown = weaponModule.game.getTimeStamp();
    }

    abstract getDamage(caster: Unit): number;


    protected getAccuracy(caster: Unit) {
        // Accuracy is some number, starting at 100
        const crew = PlayerStateFactory.getCrewmember(caster.owner);
        const accuracy = crew ? crew.getAccuracy() : 80;
        return accuracy;
    }
    protected getStrayValue(caster: Unit) {
        const accuracy = this.getAccuracy(caster);
        // Make accuracy exponentially effect the weapon
        const accuracyModifier = Pow(100-accuracy, 2) * (accuracy > 100 ? -1 : 1);
        return accuracyModifier;
    }

    protected getStrayLocation(originalLocation: Vector3, unit: Unit): Vector3 {
        const accuracyModifier = this.getStrayValue(unit);

        // Minimum distance for the shot
        const minLength = 0;
        // Maximum distance for stray shots
        // Accuracy is exponentially good / bad
        const maxLength = this.spreadAOE + accuracyModifier / 2;

        // The maximimum possible spread for the shot
        const angleSpread = Math.min(30 - accuracyModifier / 40, 10);

        // Get the angle back towards the caster
        const dX = unit.x - originalLocation.x;
        const dY = unit.y - originalLocation.y;
        const thetaRadians = Atan2(dY, dX);

        // Project the point with a random distance
        let newLocation = originalLocation.projectTowards2D( 
            Rad2Deg(thetaRadians) * GetRandomReal(-angleSpread, angleSpread), 
            GetRandomReal(minLength, maxLength)
        );

        return newLocation;
    }
}
