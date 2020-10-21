import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { EventEntity } from "app/events/event-entity";
import { EventListener } from "app/events/event-type";
import { EVENT_TYPE } from "app/events/event-enum";
import { Unit } from "w3ts/index";
import { Terminal } from "./terminal-instance";
import { TERMINAL_REACTOR, TERMINAL_REACTOR_DUMMY, TERMINAL_GENE, TERMINAL_GENE_DUMMY, TERMINAL_RELIGION, TERMINAL_RELIGION_DUMMY, TERMINAL_WEAPONS, TERMINAL_WEAPONS_DUMMY, TERMINAL_VOID, TERMINAL_VOID_DUMMY, TERMINAL_PURGE, TERMINAL_PURGE_DUMMY, TERMINAL_MEDICAL, TERMINAL_MEDICAL_DUMMY, TERMINAL_SECURITY, TERMINAL_SECURITY_DUMMY, BRIDGE_CAPTAINS_TERMINAL, GENETIC_TESTING_FACILITY_SWITCH } from "resources/unit-ids";
import { Quick } from "lib/Quick";
import { GeneEntity } from "app/shops/gene-entity";
import { SoundRef } from "app/types/sound-ref";
import { SecurityTerminal } from "./security-terminal-instance";
import { Log } from "lib/serilog/serilog";
import { BridgeTerminal } from "./bridge-terminal-instance";
import { GeneticTerminal } from "./genetic-tester";

const firstTerminalSound = new SoundRef("Sounds\\Captain\\captain_welcome_online.mp3", false, true);
const terminalSounds = [
    new SoundRef("Sounds\\Captain\\captain_welcome.mp3", false, true),
    new SoundRef("Sounds\\Captain\\captain_help.mp3", false, true),
    new SoundRef("Sounds\\Captain\\captain_help_2.mp3", false, true),
];


export class TerminalEntity extends Entity {

    private static instance: TerminalEntity;

    public static getInstance() {        
        if (this.instance == null) {
            this.instance = new TerminalEntity();
            Hooks.set(this.name, this.instance);
        }
    }

    private activeTerminals: Terminal[] = [];
    // private typeToDummy = new Map<number, number>();

    constructor() {
        super();


        // Subscribe to terminal select events
        EventEntity.listen(new EventListener(EVENT_TYPE.INTERACT_TERMINAL, (ev, data) => {
            this.onTerminalInteract(data.source, data.data.target);
        }));
    }

    _timerDelay = 1;
    step() {
        for (let index = 0; index < this.activeTerminals.length; index++) {
            const terminal = this.activeTerminals[index];
            if (!terminal.step(this._timerDelay)) {
                terminal.onDestroy();
                Quick.Slice(this.activeTerminals, index--);
            }
        }
    }

    private onTerminalInteract(unit: Unit, terminal: Unit) {
        let instance: Terminal;

        try {
            switch(terminal.typeId) {
                case BRIDGE_CAPTAINS_TERMINAL:
                    instance = new BridgeTerminal(unit, terminal);
                    break;
                case TERMINAL_SECURITY:
                    instance = new SecurityTerminal(unit, terminal);
                    break;
                case GENETIC_TESTING_FACILITY_SWITCH:
                    instance = new GeneticTerminal(unit, terminal);
                default:
                    instance = new Terminal(unit, terminal);
            }
            
            this.activeTerminals.push(instance);

            
            if (terminal.typeId === TERMINAL_GENE) {
                GeneEntity.getInstance().addNewGeneInstance(unit, instance.getTerminalDummy());
            }
        }
        catch (e) {
            Log.Information(`Failed to create terminal: ${e}`);
        }
    }
}