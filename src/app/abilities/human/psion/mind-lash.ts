
import { getZFromXY } from "lib/utils";
import { BUFF_ID } from "resources/buff-ids";
import { SFX_CRYO_GRENADE, SFX_FROST_NOVA } from "resources/sfx-paths";
import { WeaponEntity } from "app/weapons/weapon-entity";
import { ForceEntity } from "app/force/force-entity";
import { BuffInstanceDuration } from "app/buff/buff-instance-duration-type";
import { DynamicBuffEntity } from "app/buff/dynamic-buff-entity";
import { CrewFactory } from "app/crewmember/crewmember-factory";
import { AbilityWithDone } from "app/abilities/ability-type";
import { vectorFromUnit } from "app/types/vector2";
import { Vector3 } from "app/types/vector3";
import { Projectile } from "app/weapons/projectile/projectile";
import { ProjectileTargetStatic, ProjectileMoverParabolic } from "app/weapons/projectile/projectile-target";
import { FilterAnyUnit } from "resources/filters";
import { Unit } from "w3ts";

export class MindLash extends AbilityWithDone {

    public init() {
        super.init();
        return true;
    };

    public step(delta: number) {
        return true;
    };

    public destroy(): void {
    }
}
