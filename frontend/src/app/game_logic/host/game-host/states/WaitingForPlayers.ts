import { Viewport } from 'pixi-viewport';
import { State } from './State';
import { TextStyle, Text } from 'pixi.js';
import { setInterval } from 'timers';
import { HttpClient } from '@angular/common/http';

export class WaitingForPlayers extends State
{
    private _text: Text;
    private _players: number;

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
        this._text = new Text('Waiting for players...\n' + '', style);
        this._text.anchor.set(0.5, 0.5);
        this._text.x = window.innerWidth / 2;
        this._text.y = window.innerHeight / 2;
        this._viewport.addChild(this._text);
        setInterval(() => this.pollForPlayers(), 1500);
    }

    private pollForPlayers(): void
    {
        this._stateManager.doGetRequest().subscribe((data) =>
        {
            
        });
    }

    public stateEnded(): void
    {
        
    }

    public handle(delta: number): void
    {
        
    }
}