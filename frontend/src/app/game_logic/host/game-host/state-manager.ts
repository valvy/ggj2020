import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResolveWinnerState } from './states/ResolveWinnerState';
import { ResolveBuildsState } from './states/ResolveBuildsState';
import { WaitingForInputs } from './states/WaitingForInput';
import { State } from './states/State';
import { ResolveDefendsState } from './states/ResolveDefendsState';
import { ResolveAttacksState } from './states/ResolveAttacksState';
import { Container } from 'pixi.js';
import { ResolveTurns } from './states/ResolveTurns';
import { WaitingForPlayers } from './states/WaitingForPlayers';
import { Observable } from 'rxjs';

export enum StateType
{
    WaitingForInput,
    WaitingForPlayers,
    ResolveTurns,
    ResolvingDefends,
    ResolvingAttacks,
    ResolvingBuilds,
    ResolvingWinner
};

export class StateManager
{
    private currentState: State = null;
    private states: Map<StateType, State>;

    constructor(private viewport: Container, private httpRequest: HttpClient)
    {
        this.states = new Map<StateType, State>();

        this.states.set(StateType.WaitingForInput, new WaitingForInputs());
        this.states.set(StateType.WaitingForPlayers, new WaitingForPlayers());
        this.states.set(StateType.ResolveTurns, new ResolveTurns());
        this.states.set(StateType.ResolvingDefends, new ResolveDefendsState());
        this.states.set(StateType.ResolvingAttacks, new ResolveAttacksState());
        this.states.set(StateType.ResolvingBuilds, new ResolveBuildsState());
        this.states.set(StateType.ResolvingWinner, new ResolveWinnerState());

        this.states.forEach((s: State) => 
        {
            s.init(this, viewport);
        });
    }
    
    public gotoState(stateType: StateType): void
    {
        const state: State = this.states.get(stateType);
        if (this.currentState !== null)
        {
            this.currentState.stateEnded();
        }
        this.currentState = state;
        this.currentState.stateStarted();
    }

    public doGetRequest(url: string): Observable<any>
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');

        
        headers.append('Content-Type', 'application/json');
        return this.httpRequest.get(url, {headers: headers});
    }

    public gameTick(delta: number): void
    {
        if (this.currentState !== null)
        {
            this.currentState.handle(delta);
        }
    }
};