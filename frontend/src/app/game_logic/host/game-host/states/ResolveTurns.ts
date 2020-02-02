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
        if (this._stateManager.numberOfPlayerActions > 0)
        {
            //handle the next action.
            console.log('the number of actions!');
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