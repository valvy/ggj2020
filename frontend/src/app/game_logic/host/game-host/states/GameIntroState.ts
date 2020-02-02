import { State } from './State';
import { Constants } from 'src/app/Constants';
import { Text, Graphics } from 'pixi.js';
import { StateType } from '../state-manager';

export class StartGameState extends State
{
    private _startTime: number;
    private _text: Text;
    private _date: Date;
    
    public stateStarted(): void
    {
        this._date = new Date();
        this._startTime = 1;

        this._text = new Text('10.000', Constants.style);
        this._text.anchor.set(0.5, 0.5);
        this._text.x = window.innerWidth / 2;
        this._text.y = window.innerHeight / 2;
        this.drawBackground();
        this._viewport.addChild(this._text);
    }

    private drawBackground(): void
    {
        let myGraph = new Graphics();
        this._viewport.addChild(myGraph);

        // Move it to the beginning of the line
        myGraph.position.set(0, 0);

        // Draw the line (endPoint should be relative to myGraph's position)
        myGraph.lineStyle(3, 0xffffff)
           .moveTo(100, window.innerHeight / 2)
           .lineTo(window.innerWidth - 100, window.innerHeight / 2);

        myGraph.lineStyle(3, 0xffffff)
           .moveTo(window.innerWidth / 2, 50)
           .lineTo(window.innerWidth / 2, window.innerHeight - 50);
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
        this._text.text = 'Fix your house!\nit\'s a mess!';
        this._text.position.y -= delta * .1;
        if (timeLeft <= 0)
        {
            this._stateManager.gotoState(StateType.WaitingForInput);

        }
    }
}