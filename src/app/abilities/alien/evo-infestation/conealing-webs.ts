import { Unit } from "w3ts/handles/unit";
import { Ability } from "app/abilities/ability-type";
import { Effect } from "w3ts/index";
import { Vector2 } from "app/types/vector2";
import { AddGhost, getZFromXY, RemoveGhost } from "lib/utils";
import { PlayNewSoundOnUnit } from "lib/translators";
import { Log } from "lib/serilog/serilog";
import { ABIL_ALIEN_WEBWALK } from "resources/ability-ids";

interface Web {
    sfx: Effect;
    loc: Vector2;
    vis: fogmodifier;
}

export class ConealingWebsAbility implements Ability {

    private casterUnit: Unit | undefined;
    
    private duration = 15;
    private websSpawned = 0;
    private maxWebsSpawned = 1;

    private currentWebs: Web[] = [];

    private static activeWebs: Web[] = [];
    private static activeWebsByCaster = new Map<number, Web[]>();

    private webCheckEvery = 1;
    private stealthAOE = 400;

    public initialise() {
        this.casterUnit = Unit.fromEvent();

        if (this.casterUnit.getAbilityLevel(ABIL_ALIEN_WEBWALK) >= 2) {
            this.maxWebsSpawned = 5;
        }

        // Remove references to our old set of webs
        const oldWebs = ConealingWebsAbility.activeWebsByCaster.get(this.casterUnit.id);
        if (oldWebs && oldWebs.length > 0) {
            oldWebs.forEach(w => {
                const idx = ConealingWebsAbility.activeWebs.indexOf(w);
                if (idx >= 0) ConealingWebsAbility.activeWebs.splice(idx);

                FogModifierStop(w.vis);
                w.sfx.x = 0;
                w.sfx.y = 0;
                w.sfx.destroy();
            });
        }
        ConealingWebsAbility.activeWebsByCaster.set(this.casterUnit.id, this.currentWebs);
        return true;
    }
    
    public process(delta: number) {
        this.duration -= delta;

        if (this.duration > 0) {
            this.webCheckEvery -= delta;
            if (this.webCheckEvery <= 0) {
                this.webCheckEvery = 1;
                if (this.currentWebs.length === 0) {
                    this.spawnWeb();
                }
                else {
                    // Check to see if we are near any webs        
                    if (this.inRangeOfWeb()) {
                        if (this.casterUnit.getAbilityLevel(FourCC("Agho")) <= 0) 
                            this.casterUnit.addAbility(FourCC("Agho"));
                    }
                    else if (this.websSpawned <= this.maxWebsSpawned) {
                        this.spawnWeb();
                    }
                    else {
                        this.casterUnit.removeAbility(FourCC("Agho"));
                    }
                }
        
            }

        }
        else {
            // Check to see if we are near any webs        
            if (this.inRangeOfWeb()) {
                if (this.casterUnit.getAbilityLevel(FourCC("Agho")) <= 0) 
                    this.casterUnit.addAbility(FourCC("Agho"));
            }
            else {
                this.casterUnit.removeAbility(FourCC("Agho"));
            }
        }
        return ConealingWebsAbility.activeWebsByCaster.get(this.casterUnit.id) == this.currentWebs;
    }

    private inRangeOfWeb(): boolean {
        const uLoc = Vector2.fromWidget(this.casterUnit.handle);
        for (let index = 0; index < ConealingWebsAbility.activeWebs.length; index++) {
            const web = ConealingWebsAbility.activeWebs[index];
            if (web.loc.distanceTo(uLoc) <= this.stealthAOE)
                return true;
        }
        return false;
    }

    private spawnWeb() {
        this.websSpawned++;
        const web = {
            sfx: new Effect( 
                "Models\\sfx\\WebFloor.mdl", 
                this.casterUnit.x, 
                this.casterUnit.y
            ),
            loc: new Vector2( this.casterUnit.x, this.casterUnit.y),
            vis: CreateFogModifierRadius(this.casterUnit.owner.handle, FOG_OF_WAR_VISIBLE, this.casterUnit.x, this.casterUnit.y, this.stealthAOE, false, false)
        };

        FogModifierStart(web.vis);

        web.sfx.scale = 5;
        web.sfx.setHeight(getZFromXY(web.loc.x, web.loc.y) + 20);

        PlayNewSoundOnUnit(
            "Abilities\\Spells\\Undead\\Web\\WebTarget1.flac", this.casterUnit, 20);

        this.currentWebs.push(web);
        ConealingWebsAbility.activeWebs.push(web);
        ConealingWebsAbility.activeWebsByCaster.set(this.casterUnit.id, this.currentWebs);
    }
    
    public destroy() { 
        this.casterUnit.removeAbility(FourCC("Agho"));
        return true; 
    }
}