// /** @noSelfInFile **/
// import { SpaceGrid } from "./sector-type";
// import { Game } from "../game";
// import { SpaceSector } from "./sector-sector-type";
// import { GalaxyModule } from "./galaxy-module";
// import { Vector2 } from "app/types/vector2";
// import { Vector3 } from "app/types/vector3";
// import { Log } from "lib/serilog/serilog";

// const GRID_MODEL = "Doodads\\Cinematic\\FootSwitch\\FootSwitch.mdl";

// // How many do we want to render at a time
// // this is the number of locales around the center point
// const NAV_GRID_DISPLAY_X = 4;
// const NAV_GRID_DISPLAY_Y = 4;

// const NAV_GRID_SCALE = 1.2;
// const NAV_GRID_SIZE = 200;
// const NAV_GRID_ALPHA = 90;

// interface NavGridEffect {
//     x: number,
//     y: number,
//     locationEffect: effect,
//     innerEffects: effect[]
// }

// export class NavigationGrid {
//     location = new Vector3(0, 0, 0);

//     gridItems: Array<Array<NavGridEffect>> = [];

//     constructor() {}

//     setCenter(x: number, y: number, z: number) {
//         this.location = new Vector3(
//             x, y, z
//         );
//     }

//     getNewDisplay(x: number, y: number, sectors: SpaceSector[][]) {
//         const display = [];

//         let xIterator = x - NAV_GRID_DISPLAY_X;
//         let totalX = 0;
//         const maxX = x + NAV_GRID_DISPLAY_X;
//         const maxY = y + NAV_GRID_DISPLAY_Y;

//         Log.Information("Creating sector map!");
//         while (xIterator <= maxX) {
//             let yIterator = y - NAV_GRID_DISPLAY_Y;
//             let resultArray = [];
//             totalX++;

//             Log.Information(`x: ${xIterator}`);
//             let totalY = 0;
//             while (yIterator <= maxY) {
//                 Log.Information(`y: ${yIterator}`);
//                 resultArray[yIterator] = this.createItemsForSector(
//                     sectors[xIterator][yIterator],
//                     totalX,
//                     totalY
//                 );
//                 yIterator++;
//                 totalY++;
//             }
//             display.push(resultArray);
//             xIterator++;
//         }

//         // Dump all the old display sfx
//         this.gridItems.forEach(x => x.forEach(y => {
//             DestroyEffect(y.locationEffect);
//             y.innerEffects.forEach(s => DestroyEffect(s));
//         }));
//         this.gridItems = display;
//     }

//     createItemsForSector(sector: SpaceSector, x: number, y: number): NavGridEffect {
//         const worldSfx = AddSpecialEffect(GRID_MODEL, this.location.x, this.location.y);
//         BlzSetSpecialEffectScale(worldSfx, NAV_GRID_SCALE);
//         BlzSetSpecialEffectAlpha(worldSfx, NAV_GRID_ALPHA);
//         return {
//             x: x,
//             y: y,
//             locationEffect: worldSfx,
//             innerEffects: [] // TODO
//         }
//     }

//     renderForOffset(offset: Vector2) {
//         this.gridItems.forEach(x => x.forEach(gridItem => {
//             const nX = gridItem.x + (offset.x - NAV_GRID_SIZE) * NAV_GRID_SIZE + this.location.x;
//             const nY = gridItem.y + (offset.y - NAV_GRID_SIZE) * NAV_GRID_SIZE + this.location.y;

//             BlzSetSpecialEffectX(gridItem.locationEffect, nX);
//             BlzSetSpecialEffectY(gridItem.locationEffect, nY);
//             BlzSetSpecialEffectZ(gridItem.locationEffect, this.location.z);
//         }));
//     }

//     /**
//      * Returns the alpha for an sfx based on fade distance
//      * @param distanceFromCenter 
//      */
//     getFadeValue(distanceFromCenter: number) {
//         return 1;
//     }
// }