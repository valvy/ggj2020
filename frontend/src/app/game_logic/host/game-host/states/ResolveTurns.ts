import { State } from './State';
import { TextStyle, Text, Graphics, Container } from 'pixi.js';
import { StateManager, StateType } from '../state-manager';
import { ActionType, Card } from 'src/app/game_logic/card';
import { Constants } from 'src/app/Constants';

export class ResolveTurns extends State
{
    private _startTime: number;
    private _text: Text;
    private _date: Date;
    private card: Card;

    public init(stateManager: StateManager, viewport: Container): void
    {
        super.init(stateManager, viewport);
    }

    public stateStarted(): void
    {
        console.log('start handle state');
        if (this._stateManager.numberOfPlayerActions > 0)
        {
            this._stateManager.handlePlayerAction();

            setTimeout(() => {
                this._stateManager.gotoState(StateType.ResolveTurns);              
            }, 2500);
        } else
        {
            //start new turn.            
            this._stateManager.doGetRequest(Constants.baseUrl).subscribe((gameData) =>
            {
                if (gameData.over)
                {
                    this._stateManager.playerWon(gameData.winner);
                    console.log('winner!');
                } else
                {
                    this._stateManager.gotoState(StateType.WaitingForInput);
                }
            });
        }
    }

    public handle(delta: number): void
    {
        
        //this._stateManager.handlePlayerAction();
    }
}