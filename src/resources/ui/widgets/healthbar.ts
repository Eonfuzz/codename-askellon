import { UiWidget } from "./widget";
import { MapPlayer, Trigger } from "w3ts/index";

export class Healthbar extends UiWidget {

    private healthBar: framehandle;
    private manaBar: framehandle;

    private eventUnitSelected: Trigger;

    constructor() {
        super();

        this.healthBar = BlzCreateSimpleFrame("MyBarEx", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 1);
        this.manaBar  = BlzCreateSimpleFrame("MyBarEx", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 2);

        BlzFrameSetAbsPoint(this.healthBar, FRAMEPOINT_CENTER, 0.5, 0.3) // pos the bar
        BlzFrameSetPoint(this.manaBar, FRAMEPOINT_TOP, this.healthBar, FRAMEPOINT_BOTTOM, 0.0, 0.0) // pos bar2 below bar
     
        BlzFrameSetTexture(this.healthBar, "Replaceabletextures\\Teamcolor\\Teamcolor00.blp", 0, true) //change the BarTexture of bar to color red
        BlzFrameSetTexture(this.manaBar, "Replaceabletextures\\Teamcolor\\Teamcolor01.blp", 0, true) //color blue for bar2
       
        // BlzFrameSetTexture(this.bar3, "Replaceabletextures\\CommandButtons\\BTNHeroPaladin.blp", 0, true) //bar4 to Paladin-Face
        // BlzFrameSetTexture(BlzGetFrameByName("MyBarBackground",4), "Replaceabletextures\\CommandButtonsDisabled\\DISBTNHeroPaladin.blp", 0, true) //Change the background to DisabledPaladin-Face. ("MyBarBackground", 4) belongs to Bar4. would Bar4 be a "MyBarEx" one would have to write "MyBarExBackground" cause they are named differently in fdf.
     
        BlzFrameSetText(this.healthBar, "Life");
        BlzFrameSetText(this.manaBar, "Mana");
        // BlzFrameSetText(BlzGetFrameByName("MyBarText",4), I2S(R2I(BlzFrameGetValue(this.bar3)))+"%")

        this.eventUnitSelected = new Trigger();
        const player = MapPlayer.fromLocal();

        // this.eventUnitSelected.registerPlayerEvent(player, PLAYER_SELEC);
        TriggerRegisterPlayerSelectionEventBJ(this.eventUnitSelected.handle, player.handle, true);
        this.eventUnitSelected.addAction(() => this.update(player));
    }

    update(forWho: MapPlayer) {
        // const unitsSelected = EnumUnitsSelected();
        // const selectedUnit = GetPlayerSelec
            
        // BlzFrameSetValue(this.healthBar, GetUnitLifePercent(selectedUnit));
        // BlzFrameSetValue(this.manaBar, GetUnitManaPercent(selectedUnit));
    }
}