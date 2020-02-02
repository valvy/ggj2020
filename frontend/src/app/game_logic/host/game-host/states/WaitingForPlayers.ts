import { State } from './State';
import { Text } from 'pixi.js';
import { StateType } from '../state-manager';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/Constants';

export class WaitingForPlayers extends State
{
    private _text: Text;
    private _players: number;
    private _poller;

    constructor()
    {
        super();
    }

    public stateStarted(): void
    {
        this._text = new Text('Creating game...\n' + '', Constants.style);
        this._text.anchor.set(0.5, 0.5);
        this._text.x = window.innerWidth / 2;
        this._text.y = window.innerHeight / 2;
        this._viewport.addChild(this._text);
        this.generateWorld();
    }

    private generateWorld(): void
    {
        this._stateManager.doGetRequest(Constants.baseUrl + 'generate').subscribe((data) =>
        {
            this._text.text = 'Waiting for players...';
            this._poller = setInterval(() => this.pollForPlayers(), 200);          
        }, () => 
        {
            //oops, there was already a game active.
            this._text.text = 'Waiting for players...';
            this._poller = setInterval(() => this.pollForPlayers(), 200);
        });
    }

    private pollForPlayers(): void
    {
        this._stateManager.doGetRequest(Constants.baseUrl + 'player/count').subscribe((data) =>
        {
            const numberofplayers: number = data.Online;
            this._text.text = 'Waiting for players...\n' + numberofplayers + ' players connected.';
            if (numberofplayers === 4)
            {
                this._stateManager.doGetRequest(Constants.baseUrl + 'player').subscribe((data) =>
                {
                    const players = data.Players;            
            
                    this._stateManager.createPlayers(players);
                    this._stateManager.gotoState(StateType.GameIntro);
                    clearInterval(this._poller);
                });
            }
        });        
    }

    public stateEnded(): void
    {
        this._viewport.removeChild(this._text);
    }

    public handle(delta: number): void
    {
        
    }
}