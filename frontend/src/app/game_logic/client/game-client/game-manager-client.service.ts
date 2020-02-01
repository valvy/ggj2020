
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GameLoaderService } from '../../../services/game-loader.service';
import { Injectable } from '@angular/core';
import { FileLoader } from '../../fileloader';
import { Texture, Sprite, Container, Text, Loader, Point, TextStyle } from 'pixi.js';
import { Card, ActionType, EntityType } from '../../card';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameManagerClientService 
{
    private viewport: Container;
    private fileLoader: FileLoader;
    private textures: Map<string, Texture>;
    private data: any;
    private dragging: boolean;

    public btnStartGame:Sprite;

    private styleTxtDiscard:TextStyle;
    private styleTxtPlay:TextStyle;
    private styleTxtTitle:TextStyle;
    private styleTxtHelp:TextStyle;
    private textHelp:Text;

    private playerName:String;
    private playerId:number = -1;
    private currentCardHoldingA:number;
    private currentCardHoldingB:number;
    private currentCardHoldingC:number;
    private currentCardUIA:Card;
    private currentCardUIB:Card;
    private currentCardUIC:Card;

    private currentCardPlay:any;
    private currentCardDiscard:any;

    private INITIAL_START_SELECT_TIME: number = 10;     // same time as server/game-host player select cards time.
    private INITIAL_START_RESOLVE_TIME: number = 20;    // same time as game-host resolve time
    private INITIAL_POLL_LOBBY_TIME: number = 2;        // 2 seconds, very short
    private _currentTimeDelay: number;
    private _date: Date;
    
    private STATE_WAITING_LOBBY:number = 0;
    private STATE_WAITING_FOR_HOST:number = 2;
    private STATE_SELECT_CARDS:number = 3;
    private STATE_RESOLVE_TURN:number = 4;
    private currentState:number = -1;
    private bPollingForPlayerCount:boolean = false;


/* 
    Server Card Data - backend/CardPool.scale
    private val card_options = Array(
        "Create Roof",
        "Destroy Roof",
        "Create Window",
        "Destroy Window"
      )
*/


/*
    Server GET/POST urls
    http://localhost:9000/game/generate
    http://localhost:9000/game/join         get -> return ID
    http://localhost:9000/game/player/0     get / post 
    http://localhost:9000/game              get / delete
    http://localhost:9000/game/player/count get player count online/joined the game.
*/


    constructor(private gameLoader: GameLoaderService, private httpRequest: HttpClient) 
    {
        this.init();
    }

    private init(): void{


        // reset cards to unused
        this.currentCardHoldingA = -1;
        this.currentCardHoldingB = -1;
        this.currentCardHoldingC = -1;

        this.currentCardPlay = -1;
        this.currentCardDiscard = -1;

        this.styleTxtTitle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#FFF', '#CCC'], // gradient
            stroke: '#000',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this.styleTxtHelp = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#FFF', '#CCC'], // gradient
            stroke: '#000',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });        
        this.styleTxtDiscard = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#222', '#550000'], // gradient
            stroke: '#333',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this.styleTxtPlay = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#222', '#005500'], // gradient
            stroke: '#333',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });                  
    }

    private generatePlayerName(): void{

        var namesFirst = ["Bewilderd", "Hearthless", "Terrifying", "Disgrunteld", "Amazing", "Delicious", "Unearhtly", "Left handed", "Martian", "Appetijtelijke", "Handeloze", "Spoiled"];
        var namesSecond = ["Nietsnut", "Tug", "Destroyer", "Witch", "Padlock", "Schildknaap", "Ramenwasser", "Dakbedekker", "Timmervrouw", "Stucadoerie", "Landloper"];

        let first = Math.floor(Math.random() * namesFirst.length) + 1;
        let second = Math.floor(Math.random() * namesSecond.length) + 1;

        Math.floor(Math.random()*10) + 1
        this.playerName = namesFirst[first]+" "+namesSecond[second];
    }

    private AddHelpText() : void
    {
        const textTitle = new Text("("+this.playerId+")"+this.playerName+"s' cards", this.styleTxtTitle);
        textTitle.anchor.set(0.5, 0.5);
        textTitle.x = (window.innerWidth / 2);
        textTitle.y = 28;

        this.viewport.addChild(textTitle);

        this.textHelp = new Text('Play 1 card and Discard 1 card', this.styleTxtHelp);
        this.textHelp.anchor.set(0.5, 0.5);
        this.textHelp.x = (window.innerWidth / 2);
        this.textHelp.y = window.innerHeight - 16;

        this.viewport.addChild(this.textHelp);
    }

    private AddCardText(height:any) : void
    {
        /* 
        // TEXT EXAMPLE
        const style2 = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 128,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 0x00FF00
        });

        const basicText = new Text('Basic text in pixi', style2);
        basicText.x = 0;
        basicText.y = 0;

        this.viewport.addChild(basicText);
        */
        
        const textHelpLeft = new Text('Discard', this.styleTxtDiscard);
        textHelpLeft.anchor.set(0.5, 0.5);
        textHelpLeft.x = (window.innerWidth / 4);
        textHelpLeft.y = height;// - ((window.innerHeight - 100) / 6);         
        this.viewport.addChild(textHelpLeft);

        const textHelpRight = new Text('Play', this.styleTxtPlay);
        textHelpRight.anchor.set(0.5, 0.5);
        textHelpRight.x = (window.innerWidth / 4) * 3;
        textHelpRight.y = height;// - ((window.innerHeight - 100) / 6);
        this.viewport.addChild(textHelpRight);
    }

    public startGame(): void
    {
        this._date = new Date();

        this.viewport = this.gameLoader.pixi.stage;
        this.fileLoader = this.gameLoader.fileLoader;
        this.textures = this.fileLoader.getTextures([
            'assets/cards/card-bg.png', 'assets/cards/defend.png', 'assets/cards/attack.png', 'assets/cards/build.png',
            'assets/cards/door.png', 'assets/cards/roof.png', 'assets/cards/window.png']);
             
        this.gameLoader.addGameLoopTicker(this.updateCycle.bind(this));    
        
        // NOTE: this button should be temporary as players would normally only join
        // Create and show Start game button        
        this.btnStartGame = Sprite.from('assets/cards/card-bg.png');

        // Set the initial position
        this.btnStartGame.anchor.set(0.5);
        this.btnStartGame.x = window.innerWidth  / 2;
        this.btnStartGame.y = window.innerHeight / 2;
        
        // Opt-in to interactivity
        this.btnStartGame.interactive = true;
        
        // Shows hand cursor
        this.btnStartGame.buttonMode = true;
        
        // Pointers normalize touch and mouse
        this.btnStartGame.on('pointerdown', (e) => this.onClick(e));
        
        // Alternatively, use the mouse & touch events:
        // sprite.on('click', onClick); // mouse-only
        // sprite.on('tap', onClick); // touch-only
        
        this.viewport.addChild(this.btnStartGame); 

        console.log("GAME STARTED");
    }

    private onClick(e) : void {
        this.btnStartGame.visible = false;
        //NOTE: generate only for debugging on localmachine to test server create game, otherwise directly join
        //this.GenerateNewGame();
        this.joinGame(); 
    }

    private updateCycle(delta: number): void
    {
        const now = new Date();
        const timeDiffSinceStartOfState = now.getTime() - this._date.getTime();
        let timeLeft = this._currentTimeDelay - timeDiffSinceStartOfState / 1000;
        //console.log("timeLeft "+timeLeft);
        if (timeLeft <= 0 && this.currentState == this.STATE_SELECT_CARDS)
        {
            console.log("STATE STATE_SELECT_CARDS"+this.currentState);
            timeLeft = 0;
            this.ClearCardsUI();
            this.doPostPlayerChosenCards().subscribe((data) =>
            {
                console.log('posted player data!' + data);
            });
            this._date = now;   // use now as new date time to caulcate the new timeDiff
            // Set the host resolve state the client is in
            this.currentState = this.STATE_RESOLVE_TURN;
            this._currentTimeDelay = this.INITIAL_START_RESOLVE_TIME;

        }else if (timeLeft <= 0 && this.currentState == this.STATE_RESOLVE_TURN)
        {
            console.log("STATE STATE_RESOLVE_TURN "+this.currentState);
            this.GetNewHandOfCards();
            // Set the host resolve state the client is in
            this.currentState = this.STATE_SELECT_CARDS;
            this._currentTimeDelay = this.INITIAL_START_SELECT_TIME;
        }else if(timeLeft <= 0 && this.currentState == this.STATE_WAITING_LOBBY){   
            console.log("STATE STATE_WAITING_LOBBY "+this.currentState+" playerid "+this.playerId+" polling "+!this.bPollingForPlayerCount);
            // if there is no player ID, the player itself failed in joining the game
            // since the server did not return a value yet or not at all. 
            if (this.playerId > -1 && !this.bPollingForPlayerCount){
                console.log("START polling");
                //debugger;
                // If we have a player ID we need to wait for the other players                
                this.getPollPlayerCount();
            }         
            this._currentTimeDelay = this.INITIAL_POLL_LOBBY_TIME;
        }

        // update text
        // NOTE: it includes some debug text at the moment
        if (this.textHelp != null){
            this.textHelp.text = 'Play 1 card and Discard 1 card... Time:' + timeLeft.toFixed(3)+" STATE: " + this.currentState;
        }        
    }

    private ClearCardsUI():void
    {
        console.log("ClearCardsUI STATE "+this.currentState);

        if (this.currentCardUIA){
            this.viewport.removeChild(this.currentCardUIA);
            this.currentCardUIA.destroy();
            this.currentCardUIA = null;
        } 
        if (this.currentCardUIB){
            this.viewport.removeChild(this.currentCardUIB);
            this.currentCardUIB.destroy();
            this.currentCardUIB = null;
        } 
        if (this.currentCardUIC){
            this.viewport.removeChild(this.currentCardUIC);
            this.currentCardUIC.destroy();
            this.currentCardUIC = null;
        }                 
    }

    private showUI():void
    {
        console.log("showUI STATE "+this.currentState);

        for (let i: number = 0; i < 3; i++)
        {
            const card: Card = new Card(this.textures);
            const randomAction = Math.floor(Math.random() * 3);
            const randomEntity = Math.floor(Math.random() * 3);

            const height: number = (window.innerHeight - 100) / 3;

            // determine the right current card
            let cardValue = -1;
            if (i==0) {
                cardValue = this.currentCardHoldingA;
                this.currentCardUIA = card;
            }else if (i==1) {
                cardValue = this.currentCardHoldingB;
                this.currentCardUIB = card;
            }else if (i==2) {
                cardValue = this.currentCardHoldingC;
                this.currentCardUIC = card;
            }

            // configure the card so it displays the cards holding in player hand
            card.init(  Card.GetActionTypeByCardID(cardValue), 
                        Card.GetEnityTypeByCardID(cardValue), 
                        height,
                        cardValue);

            /*card.init(
                ActionType[Object.keys(ActionType)[randomAction]], 
                EntityType[Object.keys(EntityType)[randomEntity]], height);*/

            const actualHeight = card.actualHeight;

            let positionHeight = (actualHeight / 2) + (i * 25) + 25 + i * actualHeight;
            card.createCard(new Point(window.innerWidth / 2, positionHeight));

            this.AddCardText(positionHeight);

            this.viewport.addChild(card);
        }
        
        this.AddHelpText();
    }

    /*
    Version of 1 feb 2020 om 17:08
    {"PlayerInfo":{"id":0,
    "holding":[{"name":"Window","description":"Destroy Window","effect":"Destroy","id":3},
                {"name":"Window","description":"Destroy Window","effect":"Destroy","id":3},
                {"name":"Roof","description":"Create roof","effect":"Create","id":0}]
    ,"playedCards":[],"mustMake":[{"name":"Roof","description":"Create roof","effect":"Create","id":0},
                {"name":"Window","description":"Create Window","effect":"Create","id":2}]
    ,"effects":[],"round":0,"lastCards":[]}}
    */
    private processPlayerHoldingCards(holding:any): void
    {
        console.log("process cards STATE "+this.currentState);

        console.log("Player "+this.playerId+" Holding: "+holding); 
        /*for (let i: number = 0; i < holding.length; i++)
        {
            console.log("Holding data "+this.playerId+" element: "+ i +" = "+holding[i]);            
        }*/
        
        /*this.CreateCardFromServerData(holding, 0);
        this.CreateCardFromServerData(holding, 1);
        this.CreateCardFromServerData(holding, 2);*/
        this.currentCardHoldingA = holding[0]['id'];
        this.currentCardHoldingB = holding[1]['id'];
        this.currentCardHoldingC = holding[2]['id'];
    }

    /*private CreateCardFromServerData(holding:any, id:any): void
    {
        let cardID = holding[id]['id'];
    }*/

    private GenerateNewGame():void{
        this.doGetRequestStartAndGenerateServerGame().subscribe((data) =>
        {
            if (data['Hello world'])
            {
                this.joinGame();            
            }else{
                // error
            }            
        });
    }

    private joinGame():void{
        console.log("join game STATE "+this.currentState);
        this.doGetRequestJoinAndGetPlayerID().subscribe((data) =>
        {
            console.log("join game STATE "+data['id']);            
            // Store the given playerID
            this.playerId = data['id'];          
            // generate a new player name
            this.generatePlayerName(); 
            // Set initial state
            this.currentState = this.STATE_WAITING_LOBBY;
            this._currentTimeDelay = this.INITIAL_POLL_LOBBY_TIME;               
        }, (error) => {
            //error
        });
    }

    private getPollPlayerCount():void{
        console.log("poll player count STATE "+this.currentState);
        this.bPollingForPlayerCount = true;
        this.doGetRequestGetPlayerCount().subscribe((data) =>
        {
            if (data['Online'])
            {
                console.log(" -> poll player count is "+data['Online']);
                if (data['Online'] === 4 && this.currentState == this.STATE_WAITING_LOBBY){
                    // set in between host, so it stops polling and will wait for first hand data.
                    this.currentState == this.STATE_WAITING_FOR_HOST;
                    // continue with game
                    // by getting a set of cards for the player and entering the select card state
                    this.GetNewHandOfCards(); 
                    this.bPollingForPlayerCount = false;
                }else{
                    // not enough player yet...wait and try again later.
                    this.bPollingForPlayerCount = false;
                }
            }else{
                // error
            }            
        });
    }    

    private GetNewHandOfCards():void{
        console.log("get new hand of cards STATE "+this.currentState);

        // reset cards to unused
        this.currentCardHoldingA = -1;
        this.currentCardHoldingB = -1;
        this.currentCardHoldingC = -1;

        this.currentCardPlay = -1;
        this.currentCardDiscard = -1;

        this.doGetRequestGetPlayerCard().subscribe((data) =>
        {
            if (data['Players'])
            {
                // Read hand data and convert to client cards
                this.processPlayerHoldingCards(data['Players'][this.playerId]['holding']);                

                // Show new hand
                this.showUI();   
                
                // restart round time
                this._currentTimeDelay = this.INITIAL_START_SELECT_TIME;

                // Set the player select card state the client is in
                this.currentState = this.STATE_SELECT_CARDS;
            }else{
                // error
            }
        });
    }

    private get headers(): any
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', '*/*');
        return headers;
    }

    private doGetRequest(url: string): Observable<any>
    {
        return this.httpRequest.get(url, {headers: this.headers});
    }

    private doPostRequest(url: string, body: any): Observable<any>
    {
        return this.httpRequest.post(url, body, {headers: this.headers });
    }

    public doGetRequestStartAndGenerateServerGame(): Observable<any>
    {
        return this.doGetRequest('https://ggj2020.azurewebsites.net/api/game/generate');
    }

    public doGetRequestJoinAndGetPlayerID(): Observable<any>
    {
        return this.doGetRequest('https://ggj2020.azurewebsites.net/api/game/join');
    }

    public doGetRequestGetPlayerCount(): Observable<any>
    {
        return this.doGetRequest('https://ggj2020.azurewebsites.net/api/game/player/count');
    }

    public doGetRequestGetPlayerCard(): Observable<any>
    {
        return this.doGetRequest('https://ggj2020.azurewebsites.net/api/game/player');
    }

    public doPostPlayerChosenCards(): Observable<any>
    {
        // do some verification around the cards
        this.verifyAndSetSelectedCards();

        const headers: HttpHeaders = new HttpHeaders();
        //headers.append('Access-Control-Allow-Origin', '*');
        //headers.append('Content-Type', 'application/json');
        return this.doPostRequest('https://ggj2020.azurewebsites.net/api/game/player/'+this.playerId, 
        {
            id:this.playerId,
            play:this.currentCardPlay,
            discard:this.currentCardDiscard
        });
        //{headers: headers});
    }


    public verifyAndSetSelectedCards(): void
    {
        // first find out if any of the cards has been selected
        if (this.currentCardUIA.getIsDiscarded){
            this.currentCardDiscard = this.currentCardUIA.actualCardID;
        }else if(this.currentCardUIB.getIsDiscarded){
            this.currentCardDiscard = this.currentCardUIB.actualCardID;
        }else if (this.currentCardUIC.getIsDiscarded){
            this.currentCardDiscard = this.currentCardUIC.actualCardID;
        }
        
        if(this.currentCardUIA.getIsPlayed){
            this.currentCardPlay = this.currentCardUIA.actualCardID;            
        }else if (this.currentCardUIB.getIsPlayed){
            this.currentCardPlay = this.currentCardUIB.actualCardID; 
        }else if(this.currentCardUIC.getIsPlayed){
            this.currentCardPlay = this.currentCardUIC.actualCardID;             
        }

        // if any of the play actions hasn't been done... random fill it.
        if (this.currentCardPlay < 0 && this.currentCardDiscard < 0){
            
            let randSelectedCard1 = this.currentCardHoldingA;
            let randSelectedCard2 = this.currentCardHoldingB;
            let randSelectedCard3 = this.currentCardHoldingC;

            if ( Math.random() > 0.33 ){
                let temp = randSelectedCard1;
                randSelectedCard1 = randSelectedCard2;
                randSelectedCard2 = temp;
            }
            if ( Math.random() > 0.33 ){
                let temp = randSelectedCard2;
                randSelectedCard2 = randSelectedCard3;
                randSelectedCard3 = temp;
            }
            if ( Math.random() > 0.33 ){
                let temp = randSelectedCard3;
                randSelectedCard3 = randSelectedCard1;
                randSelectedCard1 = temp;
            }                        

            // just take first two cards, now that they have been randomly ordered
            this.currentCardPlay = randSelectedCard1;
            this.currentCardDiscard = randSelectedCard3;

        }
        else if (this.currentCardPlay < 0){
            let randSelectedCard1 = this.currentCardHoldingA;
            let randSelectedCard2 = this.currentCardHoldingB;
            if (this.currentCardHoldingA == this.currentCardDiscard){
                randSelectedCard1 = this.currentCardHoldingB;
                randSelectedCard2 = this.currentCardHoldingC;
            }else if (this.currentCardHoldingB == this.currentCardDiscard){
                randSelectedCard1 = this.currentCardHoldingA;
                randSelectedCard2 = this.currentCardHoldingC;
            }
            this.currentCardPlay = randSelectedCard1;
            if ( Math.random() > 0.5 ){
                this.currentCardPlay = randSelectedCard2;
            } 
        }else if (this.currentCardDiscard < 0){
            let randSelectedCard1 = this.currentCardHoldingA;
            let randSelectedCard2 = this.currentCardHoldingB;
            if (this.currentCardHoldingA == this.currentCardPlay){
                randSelectedCard1 = this.currentCardHoldingB;
                randSelectedCard2 = this.currentCardHoldingC;
            }else if (this.currentCardHoldingB == this.currentCardPlay){
                randSelectedCard1 = this.currentCardHoldingA;
                randSelectedCard2 = this.currentCardHoldingC;
            }
            this.currentCardDiscard = randSelectedCard1;
            if ( Math.random() > 0.5 ){
                this.currentCardDiscard = randSelectedCard2;
            } 
        }
    }
}
