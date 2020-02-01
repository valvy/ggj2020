import { StateType } from './../state-manager';
import { State } from './State';
import { TextStyle, Text } from 'pixi.js'; 

export class WaitingForInputs extends State
{
    private _startTime: number;
    private _text: Text;
    private _date: Date;

    constructor()
    {
        super();
    }

    public stateStarted(): void
    {
        this._date = new Date();
        this._startTime = 10;

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
        this._text = new Text('10.000', style);
        this._text.anchor.set(0.5, 0.5);
        this._text.x = window.innerWidth / 2;
        this._text.y = window.innerHeight / 2;
        this._viewport.addChild(this._text);
    }

    public stateEnded(): void
    {
        this._viewport.removeChild(this._text);
    }

    public handle(delta: number): void
    {
        const now = new Date();
        const diff = now.getTime() - this._date.getTime();
        const timeLeft = this._startTime - diff / 1000;
        this._text.text = 'Make your choice!\n' + timeLeft.toFixed(3);
        if (timeLeft <= 0)
        {
            this._stateManager.gotoState(StateType.ResolveTurns);
        }
    }
}