// import { Entity } from "app/entity-type";
// import { Hooks } from "lib/Hooks";
// import { Trigger } from "w3ts/index";
// import { Quick } from "lib/Quick";
// import { EventEntity } from "app/events/event-entity";
// import { EVENT_TYPE } from "app/events/event-enum";
// import { EventListener } from "app/events/event-type";

// export class GlobalCOoldownAbilityEntity extends Entity {
//     private static instance: GlobalCOoldownAbilityEntity;

//     public static getInstance() {        
//         if (this.instance == null) {
//             this.instance = new GlobalCOoldownAbilityEntity();
//             Hooks.set(this.name, this.instance);
//         }
//         return this.instance;
//     }


//     private globalCooldownChecker: Trigger;

//     // List of "Global Cooldown" abilities
//     private unitsListeningToAbility = new Map<unit, number[]>();
//     private abilitiesOnUnits = new Map<number, unit[]>();

//     // The actual Cooldown for the ability
//     private globalCooldownOriginalCooldown = new Map<number, number>();
//     // Remaining cooldown on abilities
//     private globalCooldownAbilityRemaining = new Map<number, number>();
//     // The currently active entries
//     private globalCooldownEntries: number[] = [];

//     constructor() {
//         super();
        
//         this.globalCooldownChecker = new Trigger();
//         const r = CreateRegion();
//         RegionAddRect(r, GetPlayableMapRect());
//         this.globalCooldownChecker.registerEnterRegion(r, Filter(() => true));
//         this.globalCooldownChecker.addAction(() => this.checkGlobalCooldownSpells());

//         EventEntity.listen(new EventListener(EVENT_TYPE.UNIT_REMOVED_FROM_GAME, (event, data) => {
//             const u = data.source;
//             if (this.unitsListeningToAbility.has(u.handle)) {

//             } 
//         }))
//     }

//     _timerDelay = 1;
//     step() {
//         for (let index = 0; index < this.globalCooldownEntries.length; index++) {
//             const ability = this.globalCooldownEntries[index];
//             const t = this.globalCooldownAbilityRemaining.get(ability) - this._timerDelay;

//             if (t <= 0) {
//                 Quick.Slice(this.globalCooldownEntries, index--);
//                 this.globalCooldownAbilityRemaining.delete(ability);
//             }
//             else {
//                 this.globalCooldownAbilityRemaining.set(ability, t);
//             }
//         }
//     }



//     checkSpells() {
//         const id = GetSpellAbilityId();
//         // Now also check if it is a global cooldown ability
//         const gCooldown = this.globalCooldownAbilityRemaining.get(id);
//         if (gCooldown > 0) {
//             const u = GetTriggerUnit();
//             IssueImmediateOrder(u, "stop");          
//             BlzStartUnitAbilityCooldown(u, id, gCooldown);  
//         }
//     }
    
//     /**
//      * Checks cooldown spells against a unit entering playable map area
//      */
//     private checkGlobalCooldownSpells() {
//         const u = GetTriggerUnit();
//         for (let index = 0; index < this.globalCooldownEntries.length; index++) {
//             const abilId = this.globalCooldownEntries[index];
//             if (BlzGetUnitAbility(u, abilId)) {
//                 BlzStartUnitAbilityCooldown(u, abilId, this.globalCooldownAbilityRemaining.get(abilId));
//                 const units = this.unitsListeningToAbility.get(abilId) || [];
//                 units.push(u);                
//                 this.unitsListeningToAbility.set(abilId, units);
//             }
//         }
//     }
// }