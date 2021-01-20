import { UiWidget } from "./widget";
import { Frame, MapPlayer, Trigger } from "w3ts/index";
import { EventEntity } from "app/events/event-entity";
import { EVENT_TYPE } from "app/events/event-enum";
import { Log } from "lib/serilog/serilog";
import { WeaponEntityAttackType } from "app/weapons/weapon-attack-type";
import { COL_ATTATCH, COL_GOLD, COL_MISC } from "resources/colours";
import { COLOUR_CULT_GREEN } from "app/force/forces/cultist/constants";
import { PlayerState } from "app/force/player-type";
import { PlayerStateFactory } from "app/force/player-state-entity";

export class WeaponModeWidget extends UiWidget {

    private buttonActivateTargeted: Frame;
    private buttonActivateSmart: Frame;
    private buttonActivateAuto: Frame;

    private frameEventTrigger = new Trigger();

    private buttonHeight = 0.02;
    private tooltipHeight = 0.055;
    private tooltipWidth = 0.2;

    constructor() {
        super();

        this.buttonActivateAuto = this.makeWidget("Automatic", WeaponEntityAttackType.ATTACK, 0);
        this.buttonActivateSmart = this.makeWidget("Smart", WeaponEntityAttackType.SMART, 1);
        this.buttonActivateTargeted = this.makeWidget("Targeted", WeaponEntityAttackType.CAST, 2);

        this.frameEventTrigger.addAction(() => {
            const frame = Frame.fromEvent();
            if (MapPlayer.fromEvent().isLocal()) {
                frame.enabled = false;
                frame.enabled = true;
            }

            const pData = PlayerStateFactory.get(MapPlayer.fromEvent());

            if (pData && pData.getCrewmember()) {
                const crew = pData.getCrewmember();
                let mode: WeaponEntityAttackType;
                if (frame == this.buttonActivateAuto) 
                    mode = WeaponEntityAttackType.ATTACK;
                else if (frame == this.buttonActivateSmart) 
                    mode = WeaponEntityAttackType.SMART;
                else if (frame == this.buttonActivateTargeted) 
                    mode = WeaponEntityAttackType.CAST;

                EventEntity.send(EVENT_TYPE.WEAPON_MODE_CHANGE, { source: crew.unit, crewmember: crew, data: { mode: mode }});
            }
        });

        // Listen to our "on change" event
        EventEntity.listen(EVENT_TYPE.WEAPON_MODE_CHANGE, (self, data) => {
            const crew = data.crewmember;
            const mode = data.data.mode;
            
            if (crew.player.isLocal()) {
                this.buttonActivateAuto.getChild(1).visible = false;
                this.buttonActivateTargeted.getChild(1).visible = false;
                this.buttonActivateSmart.getChild(1).visible = false;

                if (mode === WeaponEntityAttackType.ATTACK) {
                    this.buttonActivateAuto.getChild(1).visible = true;          
                } 
                else if (mode === WeaponEntityAttackType.CAST) {
                    this.buttonActivateTargeted.getChild(1).visible = true;       
                } 
                else if (mode === WeaponEntityAttackType.SMART) {
                    this.buttonActivateSmart.getChild(1).visible = true;
                }

            }
        });
    }

    private makeWidget(text: string, t: WeaponEntityAttackType, index: number = 0) {
        const buttonFrame = BlzCreateFrameByType("GLUEBUTTON", "FaceButton", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), "IconButtonTemplate", 0);
        const buttonIconFrame = BlzCreateFrameByType("BACKDROP", "FaceButtonIcon", buttonFrame, "", 0);

        BlzFrameSetAllPoints(buttonIconFrame, buttonFrame);
        if (t === WeaponEntityAttackType.ATTACK)
            BlzFrameSetTexture(buttonIconFrame, "ReplaceableTextures\\CommandButtons\\BTNAttack", 0, true);
        else if (t === WeaponEntityAttackType.CAST)
            BlzFrameSetTexture(buttonIconFrame, "ReplaceableTextures\\CommandButtons\\BTNAttackGround", 0, true);
        else if (t === WeaponEntityAttackType.SMART)
            BlzFrameSetTexture(buttonIconFrame, "ReplaceableTextures\\CommandButtons\\BTNMove", 0, true);

        const frame = Frame.fromHandle(buttonFrame);
        frame.setSize(this.buttonHeight, this.buttonHeight);
        frame.setAbsPoint(FRAMEPOINT_CENTER, 0.605, this.getFrameY(index));
        // frame.text = text;
        this.frameEventTrigger.triggerRegisterFrameEvent(frame, FRAMEEVENT_CONTROL_CLICK);

        // Add tooltips
        const tooltip = Frame.fromHandle(BlzCreateFrame("BoxedText", buttonFrame, 0, 0));
        frame.setTooltip(tooltip);
        tooltip.setAbsPoint(FRAMEPOINT_CENTER, 0.81 - this.tooltipWidth / 2, 0.2);
        tooltip.setSize(this.tooltipWidth, this.tooltipHeight);
        
        tooltip.getChild(0).text = `${COL_GOLD}Gameplay Option|r`;
        if (t === WeaponEntityAttackType.ATTACK) {
            tooltip.getChild(1).text = `Enables ${COL_GOLD}Auto Attacking|r for weapons|n|n${COLOUR_CULT_GREEN}Only one mode can be active|r`;
        } else if (t === WeaponEntityAttackType.CAST) {
            tooltip.getChild(1).text = `Enables ${COL_GOLD}Target Cast|r for weapons|n|n${COLOUR_CULT_GREEN}Only one mode can be active|r`;
        } else if (t === WeaponEntityAttackType.SMART) {
            tooltip.getChild(1).text = `Enables ${COL_GOLD}Smart Cast|r for weapons|n|n${COLOUR_CULT_GREEN}Only one mode can be active|r`;
        }

        // Sprite frames
        const spriteFrame = BlzCreateFrameByType("SPRITE", "justAName", buttonFrame, "WarCraftIIILogo", 0);
        BlzFrameSetPoint(spriteFrame, FRAMEPOINT_BOTTOMLEFT, buttonFrame, FRAMEPOINT_BOTTOMLEFT, 0.02, 0.02);
        BlzFrameSetSize(spriteFrame, 1, 1);
        BlzFrameSetScale(spriteFrame, 0.5);
        BlzFrameSetModel(spriteFrame, "selecter1.mdx", 0);
        BlzFrameSetVisible(spriteFrame, false);

        
        const pData = PlayerStateFactory.get(MapPlayer.fromLocal());
        if (pData) {
            BlzFrameSetVisible(spriteFrame, t === pData.getAttackType());
        }
        return frame;
    }

    private getFrameY(index: number) {
        return 0.07 + 0.001*0.66*index + this.buttonHeight * index;
    }

    update(forWho: MapPlayer) {
        // const unitsSelected = EnumUnitsSelected();
        // const selectedUnit = GetPlayerSelec
            
        // BlzFrameSetValue(this.healthBar, GetUnitLifePercent(selectedUnit));
        // BlzFrameSetValue(this.manaBar, GetUnitManaPercent(selectedUnit));
    }
}