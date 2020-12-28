import { Entity } from "app/entity-type";
import { Hooks } from "lib/Hooks";
import { Log } from "lib/serilog/serilog";
import { MapPlayer } from "w3ts/index";

export interface FogState {
    fStart: number,
    fEnd: number,
    density: number,
    r: number,
    g: number,
    b: number
}

export class FogTransition {
    goal: FogState;
    start: FogState;
    duration: number;
    timeElapsed: number = 0;

    player: MapPlayer;

    constructor(who: MapPlayer, start: FogState, goal: FogState, duration: number) {
        this.player = who;
        this.goal = goal;
        this.start = start;
        this.duration = duration;
    }

    next(delta: number): FogState {
        this.timeElapsed += delta;
        const percentRemaining = this.timeElapsed / this.duration;
        return {
            fStart: this.start.fStart + (this.goal.fStart - this.start.fStart) * percentRemaining,
            fEnd: this.start.fEnd + (this.goal.fEnd - this.start.fEnd) * percentRemaining,
            density: this.start.density + (this.goal.density - this.start.density) * percentRemaining,
            r: this.start.r + (this.goal.r - this.start.r) * percentRemaining,
            g: this.start.g + (this.goal.g - this.start.g) * percentRemaining,
            b: this.start.b + (this.goal.b - this.start.b) * percentRemaining
        }
    }

    done(): boolean {
        return this.timeElapsed >= this.duration;
    }
}

export class FogEntity extends Entity {
    private static instance: FogEntity;

    private defaultFogState: FogState = { fStart: 2600, fEnd: 5000, density: 1, r: 60, g: 60, b: 80 };

    private playerTransitions = new Map<MapPlayer, FogTransition>();
    private playerFogState = new Map<MapPlayer, FogState>();
    private activeTransitions: FogTransition[] = [];

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new FogEntity();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();
    }

    _timerDelay = 0.1;
    step() {
        if (this.activeTransitions.length === 0) return;

        let i = 0;
        for (let index = 0; index < this.activeTransitions.length; index++) {
            const trans = this.activeTransitions[index];
            const state = trans.next(this._timerDelay);
            if (GetLocalPlayer() === trans.player.handle) {
                SetTerrainFogEx(0, 
                    Math.round(state.fStart), 
                    Math.round(state.fEnd), 
                    Math.round(state.density), 
                    state.r / 255, 
                    state.g / 255, 
                    state.b / 255
                );
            }
            this.playerFogState.set(trans.player, state);
            if (trans.done()) {
                this.activeTransitions.splice(i--, 1);
                this.playerTransitions.delete(trans.player);
            }
        }
    }

    private transition(who: MapPlayer, to: FogState, duration: number) {
        const startState = this.getCurrentState(who);
        const goalState = to;

        const nTransition = new FogTransition(who, startState, goalState, duration);

        const oldTransition = this.playerTransitions.get(who);
        if (oldTransition) {
            const i = this.activeTransitions.indexOf(oldTransition);
            if (i >= 0) this.activeTransitions.splice(i, 1);
        }
        this.playerTransitions.set(who, nTransition);
        this.activeTransitions.push(nTransition);
    }

    private getCurrentState(who: MapPlayer) {
        return this.playerFogState.get(who) || this.defaultFogState;
    }

    public static transition(who: MapPlayer, to: FogState, duration: number) {
        this.getInstance().transition(who, to, duration);
    }

    public static reset(who: MapPlayer, duration: number) {
        this.getInstance().transition(who, this.getInstance().defaultFogState, duration);
    }
}