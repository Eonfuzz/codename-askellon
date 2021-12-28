import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { Healthbar } from "./widgets/healthbar";
import { UiWidget } from "./widgets/widget";
import { WIDGET_KEYS } from "./ui-keys";
import { Trigger, MapPlayer, Quest } from "w3ts/index";
import { Entity } from "app/entity-type";
import { WeaponModeWidget } from "./widgets/change-weapon-mode";
import { COL_GOLD, COL_MISC, COL_ALIEN, COL_BAD, COL_GOOD } from "resources/colours";
import { COLOUR_CULT } from "app/force/forces/cultist/constants";
import { IncomeWidget } from "./widgets/income";

export class UIEntity extends Entity {
    private static instance: UIEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new UIEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    public static start() {
        this.getInstance().init();
    }

    private widgets: UiWidget[] = [];
    private widgetByKey = new Map<WIDGET_KEYS, UiWidget>();

    public init() {
        // Add quests
        
        // Add quest info
        let q = new Quest();
        q.setIcon("ReplaceableTextures/Commandbuttons/PASTychus.blp");
        q.setTitle(`${COL_GOLD}ROLE|r :: The Crew`);
        q.setDescription(`${COL_MISC}There's something nasty out there. Lets gun it down or get outta here.|r|n|n` +
        `${COL_GOLD}HOW TO PLAY|r|n - Gold income is based on your current level|n - Buying upgrades or damaging aliens grants experience|n - Completing role specific objectives (See your ability) grants even more experience|n - Aliens can see you whenever you have ${COL_ALIEN}Despair|r|n - If you know someone is Alien, target them with security from the bridge|n - Win the game by killing all hostiles onboard or by warping out of this sector|n|n`+ 
        `${COL_GOLD}HOW TO KILL|r|n - Humans are weak while alone|n - Destroy Power Generators located in the Service Tunnels to apply ${COL_ALIEN}Despair|r - Lie about being attacked, make them trust no one`);
        q.discovered = true;
        q.required = false;

        q = new Quest();
        q.setIcon("ReplaceableTextures\\Commandbuttons\\BTNZergling.blp");
        q.setTitle(`${COL_GOLD}ROLE|r :: The Alien`);
        q.setDescription(`${COL_MISC}The Alien powers up over time, becoming increasingly stronger unless killed.|r` +
        `|n|n${COL_GOLD}HOW TO PLAY|r|n - Destroy Power Generators to power down a floor|n - Floors with no power apply ${COL_ALIEN}Despair|r to everyone inside|n - ${COL_ALIEN}Despair|r grants vision of those afflicted, and makes alien minions more hostile|n|n`+ 
        `${COL_GOLD}HOW TO KILL|r|n - Find the Alien by using blood tests|n - The Alien is weak while evolving`);
        q.discovered = true;
        q.required = false;

        q = new Quest();
        q.setIcon("ReplaceableTextures\\Commandbuttons\\BTNCult.blp");
        q.setTitle(`${COL_GOLD}ROLE|r :: The Cultist`);
        q.setDescription(`${COL_MISC}The cultist bides his time, slowly increasing the power over time. Find his altar and destroy it before he gathers power.|r` +
        `|n|n${COL_GOLD}HOW TO PLAY|r|n - Hide your altar somewhere, it will slowly grant lumber over time|n - Placing corpses next to your altar speeds this up|n - You must achieve the first ritual before you can win the game|n - Players that you have cursed go mad faster when they have ${COL_ALIEN}Despair|r|n - Convert corpses into zombies when you can, these can act as allies or saboteurs|n|n`+ 
        `${COL_GOLD}HOW TO KILL|r|n - Destroy Altars to slow down his progression|n - Don't bunch together closely, look for telltale signs of the Cultist cursing people|n - Be wary of people while you are driven ${COL_BAD}Insane|r, the cultist can instantly kill you`);
        q.discovered = true;
        q.required = false;
        
        q = new Quest();
        q.setIcon("ReplaceableTextures\\Commandbuttons\\BTNDeepScan.dds");
        q.setTitle(`${COL_GOLD}HOW TO WIN|r`);
        q.setDescription(
        `${COL_ALIEN}ALIEN|r :: Find and kill all other life|n`+ 
        `${COLOUR_CULT}CULTIST|r :: Perform the final ritual|n`+
        `${COL_GOOD}CREW|r :: Destroy all other threats or warp out of the sector`);
        q.discovered = true;

        q = new Quest();
        q.setIcon("ReplaceableTextures\\CommandButtons\\BTNSpiritOfVengeance.blp");
        q.setTitle(`What is ${COL_ALIEN}Despair|r?`);
        q.setDescription(`${COL_MISC}"Just when you think you've hit rock bottom, you realize you're standing on another trapdoor"|r|n|n`+
        ` - Grants ALL Aliens vision of you|n - Massively reduces armor and accuracy|n - Alien AI is far more aggressive|n - Certain effects or abilities are more powerful`);
        q.discovered = true;

        q = new Quest();
        q.setIcon("ReplaceableTextures\\Commandbuttons\\BTNCult.blp");
        q.setTitle(`What is ${COL_BAD}Insanity|r?`);
        q.setDescription(`${COL_MISC}"Believe nothing you hear, and only half of what you see"|r|n|n`+
        ` - Grows in power over time, causing hallucinations and delerium|n - The cultist may instantly kill you via ${COL_BAD}Sacrificial Dagger|r|n - Allows certain Cultist abilities to work on you`);
        q.discovered = true;

        try {
            BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), true);


            this.baseUI();
            this.fixQuestLog();

            // 

            // // Remove all our UI
            // BlzHideOriginFrames(true);
            // BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));

            // Show them all, one by one

            // Enable the Portrait
            // BlzFrameSetVisible(this.originPortraitFrame, true);
            // BlzFrameSetSize(this.originPortraitFrame, 1, 0.1);

            // const healthbar = new Healthbar();
            // this.widgetByKey.set(WIDGET_KEYS.UI_HEALTHBAR, healthbar);
            // this.widgets.push(healthbar);

            const weaponModes = new WeaponModeWidget();
            this.widgetByKey.set(WIDGET_KEYS.UI_WEAPON_MODE, weaponModes);
            this.widgets.push(weaponModes);

            const incomeBar = new IncomeWidget();
            this.widgetByKey.set(WIDGET_KEYS.UI_INCOME, incomeBar);
            this.widgets.push(incomeBar);

        }
        catch (e) {
            Log.Error("Error setting up ui");
            Log.Error(e);
        }
    }

    
    _timerDelay = 0.3;
    step() {
        const localPlayer = MapPlayer.fromLocal();
        for (let index = 0; index < this.widgets.length; index++) {
            this.widgets[index].update(localPlayer);
        }
        
    }

    private baseUI() {
        SetCreepCampFilterState(false);
        //Local Variables
        let fh: framehandle = null
        let chatButton: framehandle = null
        let questButton: framehandle = null
        let allyButton: framehandle = null
        let MiniMap: framehandle = null
        let gridButtons: framehandle = null
        let imageTest: framehandle = BlzCreateFrameByType("BACKDROP", "image", BlzGetFrameByName("ConsoleUIBackdrop", 0), "ButtonBackdropTemplate", 0);

        //Top UI & System Buttons
        fh = BlzGetFrameByName("UpperButtonBarFrame", 0)
        BlzFrameSetVisible(fh, true)
        allyButton = BlzGetFrameByName("UpperButtonBarAlliesButton", 0)
        fh = BlzGetFrameByName("UpperButtonBarMenuButton", 0)
        chatButton = BlzGetFrameByName("UpperButtonBarChatButton", 0)
        questButton = BlzGetFrameByName("UpperButtonBarQuestsButton", 0)

        
        //Hiding clock UI and creating new frame bar
        BlzFrameSetTexture(imageTest, "UI\\ResourceBar", 0, true)
        BlzFrameSetPoint(imageTest, FRAMEPOINT_TOP, BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), FRAMEPOINT_TOP, 0.295, 0)
        BlzFrameSetSize(imageTest, 0.4, 0.03125)
        BlzFrameSetVisible(BlzFrameGetChild(BlzFrameGetChild(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 5), 0), false)
        BlzFrameSetLevel(imageTest, 1)
        
        //Food
        fh = BlzGetFrameByName("ResourceBarSupplyText", 0)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 1, 1)
        
        //Upkeep
        fh = BlzGetFrameByName("ResourceBarUpkeepText", 0);
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, .77, 0.5975);
        BlzFrameSetTextColor(fh,BlzConvertColor(255, 114, 137, 218));
        BlzFrameSetText(fh, "discord.gg/nDMpQZm");
        BlzFrameSetFont(fh, "UI\\Font\\LVCMono.otf", 0.007, 1);
        
        //Gold
        fh = BlzGetFrameByName("ResourceBarGoldText", 0);
        BlzFrameSetTextColor(fh,BlzConvertColor(255,0,255,255));
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 0.595, 0.5965);
        BlzFrameSetFont(fh, "UI\\Font\\LVCMono.otf", 0.011, 1);
        
        //Lumber
        fh = BlzGetFrameByName("ResourceBarLumberText", 0);
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 0.69, 0.5965);
        BlzFrameSetTextColor(fh,BlzConvertColor(255,181, 33, 102));
        BlzFrameSetFont(fh, "UI\\Font\\LVCMono.otf", 0.011, 1);
        
        //Bottom UI & Idle Worker Icon
        fh = BlzGetFrameByName("ConsoleUI", 0)
        fh = BlzFrameGetChild(fh, 7)
        BlzFrameClearAllPoints(fh)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 150, 150)
        // BlzFrameSetEnable(fh, false);
        
        //Remove Deadspace
        fh = BlzGetFrameByName("ConsoleUI", 0)
        BlzFrameSetVisible(BlzFrameGetChild(fh, 5), false)
        
        //Minimap
        MiniMap = BlzGetFrameByName("MiniMapFrame", 0)
        BlzFrameSetVisible(MiniMap, true)
        BlzFrameClearAllPoints(MiniMap)
        BlzFrameSetAbsPoint(MiniMap, FRAMEPOINT_BOTTOMLEFT, 0.01, 0)
        BlzFrameSetAbsPoint(MiniMap, FRAMEPOINT_TOPRIGHT, 0.211, 0.137)
        
        //Minimap Buttons
        fh = BlzGetFrameByName("MinimapSignalButton", 0)
        BlzFrameSetVisible(fh, false)
        fh = BlzGetFrameByName("MiniMapAllyButton", 0)
        BlzFrameSetVisible(fh, false)
        fh = BlzGetFrameByName("MiniMapTerrainButton", 0)
        BlzFrameSetVisible(fh, false)
        fh = BlzGetFrameByName("MiniMapCreepButton", 0)
        BlzFrameSetVisible(fh, false)
        fh = BlzGetFrameByName("FormationButton", 0)
        BlzFrameSetVisible(fh, false)
        
        //Minimap Border
        fh = BlzCreateFrameByType("BACKDROP", "MinimapBorder", MiniMap, "", 0)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_BOTTOMLEFT, 0, 0)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 0.2125, 0.14)
        BlzFrameSetTexture(fh, "UI\\MiniMapBorder.dds", 0, true)

        //Minimap Backdrop
        fh = BlzGetFrameByName("ConsoleUIBackdrop", 0)
        BlzFrameClearAllPoints(fh);
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_BOTTOMLEFT, 0.01, 0)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 0.211, 0.137)

        // BlzFrameSetPoint(fh, FRAMEPOINT_TOPLEFT, MiniMap, FRAMEPOINT_TOPLEFT, -0.01, 0.002)
        // BlzFrameSetPoint(fh, FRAMEPOINT_BOTTOMRIGHT, MiniMap, FRAMEPOINT_BOTTOMRIGHT, 0.002, 0)
        
        //Tooltips
        fh = BlzGetOriginFrame(ORIGIN_FRAME_TOOLTIP, 0)
        BlzFrameSetVisible(fh, true)
        fh = BlzGetOriginFrame(ORIGIN_FRAME_UBERTOOLTIP, 0)
        BlzFrameSetVisible(fh, true)
        BlzFrameClearAllPoints(fh)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_BOTTOMRIGHT, 0.7725, 0.141)
        
        //Command Buttons
        gridButtons = BlzGetFrameByName("CommandBarFrame", 0)
        BlzFrameSetVisible(gridButtons, true)
        BlzFrameClearAllPoints(gridButtons)
        // BlzFrameSetAbsPoint(gridButtons, FRAMEPOINT_BOTTOMLEFT, 0.5950, 0.005)
        BlzFrameSetAbsPoint(gridButtons, FRAMEPOINT_BOTTOMLEFT, 0.6, 0.005)
        
        
        //Command buttons border
        fh = BlzCreateFrameByType("BACKDROP", "CommandBorder", MiniMap, "", 0)
        BlzFrameSetPoint(fh, FRAMEPOINT_TOPLEFT, gridButtons, FRAMEPOINT_TOPLEFT, -0.007, 0.007)
        BlzFrameSetPoint(fh, FRAMEPOINT_BOTTOMRIGHT, gridButtons, FRAMEPOINT_BOTTOMRIGHT, 0.0025, -0.005)
        BlzFrameSetTexture(fh, "UI\\CommandCard.dds", 0, true)

        // 
        
        //Local Variables
        // Fix Damage and Armor overlap
        BlzFrameClearAllPoints(BlzGetFrameByName("InfoPanelIconBackdrop", 0))
        fh = BlzGetFrameByName("InfoPanelIconBackdrop", 0)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPRIGHT, 0.3455, 0.083)
    }


    private fixQuestLog() {
        BlzFrameClick(BlzGetFrameByName("UpperButtonBarQuestsButton", 0));
        ForceUICancel();

        // Expand TextArea
        BlzFrameSetPoint(BlzGetFrameByName("QuestDisplay", 0), FRAMEPOINT_TOPLEFT, BlzGetFrameByName("QuestDetailsTitle", 0), FRAMEPOINT_BOTTOMLEFT, 0.003, -0.003)
        BlzFrameSetPoint(BlzGetFrameByName("QuestDisplay", 0), FRAMEPOINT_BOTTOMRIGHT, BlzGetFrameByName("QuestDisplayBackdrop", 0), FRAMEPOINT_BOTTOMRIGHT, -0.003, 0.)
        
        // Relocate button
        BlzFrameSetPoint(BlzGetFrameByName("QuestDisplayBackdrop", 0), FRAMEPOINT_BOTTOM, BlzGetFrameByName("QuestBackdrop", 0), FRAMEPOINT_BOTTOM, 0., 0.017)
        BlzFrameClearAllPoints(BlzGetFrameByName("QuestAcceptButton", 0))
        BlzFrameSetPoint(BlzGetFrameByName("QuestAcceptButton", 0), FRAMEPOINT_TOPRIGHT, BlzGetFrameByName("QuestBackdrop", 0), FRAMEPOINT_TOPRIGHT, -0.016, -0.016)
        BlzFrameSetText(BlzGetFrameByName("QuestAcceptButton", 0), "×")
        BlzFrameSetSize(BlzGetFrameByName("QuestAcceptButton", 0), 0.03, 0.03)
    }
}