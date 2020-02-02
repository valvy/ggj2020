import { StateType, iAction } from './../state-manager';
import { State } from './State';
import { TextStyle, Text } from 'pixi.js'; 
import { TextStyles } from 'src/app/textStyle';

export class WaitingForInputs extends State
{
    private actions: iAction[] = [];
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

        this._text = new Text('10.000', TextStyles.style);
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
            this._stateManager.doGetRequest('https://ggj2020.azurewebsites.net/api/game/player').subscribe((playerData) =>
            {
                //clear actions.
                this.actions.splice(0);
                playerData.Players.forEach(e =>
                {
                    //get last played action
                    const playedCards: iAction = e.playedCards.pop();
                    if (playedCards)
                    {
                        this.actions.push(playedCards);
                        let n: number = this.actions.length;
                        while (n > 1 && this.actions[n].priority > this.actions[n - 1].priority)
                        {
                            const temp: iAction = JSON.parse(JSON.stringify(this.actions[n]));
                            this.actions[n] = this.actions[n - 1];
                            this.actions[n - 1] = temp;
                        }
                    }
                });
            });
            console.log(this.actions);
            //this._stateManager.playerActions = this.actions;
            //this._stateManager.gotoState(StateType.ResolveTurns);
            this._stateManager.gotoState(StateType.WaitingForInput);
        }
    }
}