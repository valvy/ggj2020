import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResolveWinnerState } from './states/ResolveWinnerState';
import { ResolveBuildsState } from './states/ResolveBuildsState';
import { WaitingForInputs } from './states/WaitingForInput';
import { State } from './states/State';
import { ResolveDefendsState } from './states/ResolveDefendsState';
import { ResolveAttacksState } from './states/ResolveAttacksState';
import { Container, Point, Texture } from 'pixi.js';
import { ResolveTurns } from './states/ResolveTurns';
import { WaitingForPlayers } from './states/WaitingForPlayers';
import { Observable } from 'rxjs';
import { StartGameState } from './states/GameIntroState';
import { PlayerHouse } from './player-house';
import { GameLoaderService } from 'src/app/services/game-loader.service';

export enum StateType
{
    WaitingForInput,
    WaitingForPlayers,
    GameIntro,
    ResolveTurns,
    ResolvingDefends,
    ResolvingAttacks,
    ResolvingBuilds,
    ResolvingWinner
};

export class iAction
{
    name: string;
    description: string;
    effect: string;
    id: number;
    playerId: number;

    public get priority(): number
    {
        return this.effect === "Shield" ? 1 : this.effect === "Destroy" ? 2 : 3;
    }
}

export class StateManager
{
    private currentState: State = null;
    private states: Map<StateType, State>;
    private playerhouses: Map<number, PlayerHouse>;
    private textures: Map<string, Texture>;
    private actions: iAction[] = [];

    constructor(private gameLoader: GameLoaderService, private viewport: Container, private httpRequest: HttpClient)
    {
        this.textures = this.gameLoader.fileLoader.getTextures([
            //house stuffz.
            'assets/cards/card-bg.png', 
        //house stuff
        'assets/house/Base_House.png', 'assets/house/fixed/Door.png', 'assets/house/fixed/Roof.png', 'assets/house/fixed/Windows1.png', 'assets/house/fixed/Windows2.png',

        //shield stuff
         'assets/house/shield/Door.png', 'assets/house/shield/Roof.png', 'assets/house/shield/Windows1.png', 'assets/house/shield/Windows2.png',

        //cards stuff
            'assets/cards/defend.png', 'assets/cards/attack.png', 'assets/cards/build.png',
            'assets/cards/door.png', 'assets/cards/roof.png', 'assets/cards/window.png']);

        this.states = new Map<StateType, State>();
        this.playerhouses = new Map<number, PlayerHouse>();

        this.states.set(StateType.WaitingForInput, new WaitingForInputs());
        this.states.set(StateType.WaitingForPlayers, new WaitingForPlayers());
        this.states.set(StateType.GameIntro, new StartGameState());
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

    public doDeleteRequest(url: string): Observable<any>
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Cache-Control', 'no-cache');
        headers.append('Content-Type', 'application/json');
        return this.httpRequest.delete(url, {headers: headers});
    }

    public doGetRequest(url: string): Observable<any>
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Cache-Control', 'no-cache');
        headers.append('Content-Type', 'application/json');
        return this.httpRequest.get(url, {headers: headers});
    }

    public createPlayers(playerData): void
    {
        const posX: number = (window.innerWidth - 75) / 2;
        const posY: number = (window.innerHeight - 75) / 2;

        const positions: Point[] = [new Point(posX * .65 + 25, posY * .5 + 30), new Point(posX * 1.35 + 50, posY * .5 + 30), 
            new Point(posX * .65 + 25, posY * 1.5 + 50), new Point(posX * 1.35 + 50, posY * 1.5 + 50)];
        
        playerData.forEach(element => 
        {
            const id = element.id
            const playerHouse: PlayerHouse = new PlayerHouse();
            this.viewport.addChild(playerHouse);
            playerHouse.init(positions[id], posY * 1.25, this.textures);
            this.playerhouses.set(id, playerHouse);    
        });
    }

    public getTexture(url: string): Texture
    {
        return this.textures.get(url);
    }

    public gameTick(delta: number): void
    {
        if (this.currentState !== null)
        {
            this.currentState.handle(delta);
        }
    }

    public set playerActions(value: iAction[])
    {
        this.actions = value;
    }

    public get playerAction(): iAction
    {
        return this.actions.shift();    
    }

    public get numberOfPlayerActions(): number
    {
        return this.actions.length;
    }

    public playerWon(id: number): void
    {
        for (let i = 0; i < 4; i++)
        {
            let playerhouse: PlayerHouse = this.playerhouses.get(i);
            playerhouse.showGameResult(i === id ? 'winner!' : 'Loooooser!');
        }
        setTimeout(() =>
        {
            location.reload();
        }, 8000);
    }

    public handlePlayerAction(): void
    {
        if (this.actions.length > 0)
        {
            const action: iAction = this.actions.shift();
            console.log(action);
            //build -> on house.
            //shield -> on house.
            //destroy -> on house with item.
            let playerHouse: PlayerHouse = this.playerhouses.get(action.playerId);
            if (action.effect === 'Create')
            {
                playerHouse.doCreate(action);
            } else if (action.effect === 'Shield')
            {
                playerHouse.doShield(action);
            } else if (action.effect === 'Destroy')
            {
                let possibleTargets: PlayerHouse[] = [];
                this.playerhouses.forEach((p: PlayerHouse) =>
                {
                    if (p.hasPlayerAction(action))
                    {
                        possibleTargets.push(p);
                    }                    
                });
                let i = Math.floor(Math.random() * possibleTargets.length);
                let target = possibleTargets[i];
                if (target)
                {
                    target.doDestroy(action);
                } else console.log('there is no target');
            }
        }        
    }
};