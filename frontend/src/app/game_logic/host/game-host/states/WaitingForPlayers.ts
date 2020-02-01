import { State } from './State';
import { TextStyle, Text } from 'pixi.js';
import { StateType } from '../state-manager';

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
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            align : 'center',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this._text = new Text('Creating game...\n' + '', style);
        this._text.anchor.set(0.5, 0.5);
        this._text.x = window.innerWidth / 2;
        this._text.y = window.innerHeight / 2;
        this._viewport.addChild(this._text);
        this.generateWorld();
    }

    private generateWorld(): void
    {
        this._stateManager.doGetRequest('http://localhost:9000/game/generate').subscribe((data) =>
        {
            if (data['Hello world'])
            {
                this._text.text = 'Waiting for players...';
                this._poller = setInterval(() => this.pollForPlayers(), 1500);
            }            
        });
    }

    private pollForPlayers(): void
    {
        this._stateManager.doGetRequest('http://localhost:9000/game/player/count').subscribe((data) =>
        {
            const numberofplayers: number = data.Online;
            this._text.text = 'Waiting for players...\n' + numberofplayers + ' players connected.';
            if (numberofplayers === 4)
            {
                this._stateManager.gotoState(StateType.WaitingForInput);
                clearInterval(this._poller);
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