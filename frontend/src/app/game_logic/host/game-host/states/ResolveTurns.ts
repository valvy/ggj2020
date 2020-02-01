import { State } from './State';
import { TextStyle, Text, Graphics, Container } from 'pixi.js';
import { StateManager, StateType } from '../state-manager';
import { ActionType } from 'src/app/game_logic/card';

export class ResolveTurns extends State
{
    private _startTime: number;
    private _text: Text;
    private _date: Date;

    public init(stateManager: StateManager, viewport: Container): void
    {
        super.init(stateManager, viewport);
    }

    public stateStarted(): void
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

        if (this._stateManager.numberOfPlayerActions > 0)
        {
            //handle the next action.
        } else
        {
            //start new turn.
            this._stateManager.gotoState(StateType.WaitingForInput);
        }
    }

    public handle(delta: number): void
    {
        
        this._stateManager.handlePlayerAction();
    }
}