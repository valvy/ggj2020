import { StateType, iAction, StateManager } from './../state-manager';
import { State } from './State';
import { Text, Container } from 'pixi.js';
import { Constants } from 'src/app/Constants';

export class WaitingForInputs extends State
{
    private actions: iAction[] = [];
    private _startTime: number;
    private _text: Text;
    private debugText: Text;
    private _date: Date;
    private _doRequest: boolean = false;

    constructor()
    {
        super();
    }

    public init(stateManager: StateManager, viewport: Container): void
    {
        super.init(stateManager, viewport);
        this.debugText = new Text('waiting for player data...', Constants.debugStyle);
        this.debugText.anchor.set(0.5, 0);
        this.debugText.x = window.innerWidth / 2;
        this.debugText.y = 50;
        this._viewport.addChild(this.debugText);
    }

    public stateStarted(): void
    {
        this._date = new Date();
        this._startTime = 10;

        this._text = new Text('10.000', Constants.style);
        this._text.anchor.set(0.5, 0.5);
        this._text.x = window.innerWidth / 2;
        this._text.y = window.innerHeight / 2;
        this._viewport.addChild(this._text);

        this._doRequest = true;
    }

    public stateEnded(): void
    {
        this._viewport.removeChild(this._text);
    }

    private onPlayerDataReceived(players): void
    {
        //clear actions.
        this.actions.splice(0);
        let debugPlayerData: string = '';
        players.forEach(e =>
        {
            //get last played action
            let playerInfo = e.PlayerInfo;
            let playedCard: iAction = playerInfo.lastCards.pop();
            if (playedCard)
            {
                playedCard.playerId = playerInfo.id;
                this.actions.push(playedCard);
                let n: number = this.actions.length;
            
                debugPlayerData += 'player: ' + playerInfo.id + ' played ' + playedCard.description + ' discarded ' + playerInfo.lastDiscardCards.pop().description + '\n'; 

                while (n > 1 && this.actions[n - 1].priority > this.actions[n - 2].priority)
                {
                    const temp: iAction = JSON.parse(JSON.stringify(this.actions[n]));
                    this.actions[n] = this.actions[n - 1];
                    this.actions[n - 1] = temp;
                }
            }
        });
        this._stateManager.playerActions = this.actions;

        this.debugText.text = debugPlayerData;
        
        this._stateManager.gotoState(StateType.ResolveTurns);
    }

    public handle(delta: number): void
    {
        const now = new Date();
        const diff = now.getTime() - this._date.getTime();
        const timeLeft = this._startTime - diff / 1000;
        this._text.text = 'Make your choice!\n' + timeLeft.toFixed(3);
        if (timeLeft <= 0 && this._doRequest)
        {
            this._viewport.removeChild(this._text);

            if (timeLeft < -3) //wait for 3 more seconds before requesting data
            {
                this._doRequest = false;
                let players = [];
                for (let i = 0; i < 4; i++)
                {
                    this._stateManager.doGetRequest(Constants.baseUrl + 'player/' + i).subscribe((playerData) =>
                    {
                        players.push(playerData);
                        if (players.length === 4)
                        {
                            return this.onPlayerDataReceived(players);
                        }
                    });
                }
            }
        }
    }
}