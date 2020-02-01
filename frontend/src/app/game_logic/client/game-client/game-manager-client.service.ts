
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

    private playerName:String;
    private playerId:any;
    private currentCardA:String;
    private currentCardB:String;
    private currentCardC:String;

/* Server Card Data - backend/CardPool.scale
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
*/


    constructor(private gameLoader: GameLoaderService, private httpRequest: HttpClient) 
    {
        this.init();
    }

    private init(): void{
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

        const textHelp = new Text('Play 1 card and Discard 1 card', this.styleTxtHelp);
        textHelp.anchor.set(0.5, 0.5);
        textHelp.x = (window.innerWidth / 2);
        textHelp.y = window.innerHeight - 16;

        this.viewport.addChild(textHelp);
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
    }

    private onClick(e) : void {
        this.btnStartGame.visible = false;
        //NOTE: generate only for debugging on localmachine to test server create game, otherwise directly join
        //this.GenerateNewGame();
        this.joinGame(); 
    }

    private updateCycle(delta: number): void
    {

    }

    private showUI():void
    {
        for (let i: number = 0; i < 3; i++)
        {
            const card: Card = new Card(this.textures);
            const randomAction = Math.floor(Math.random() * 3);
            const randomEntity = Math.floor(Math.random() * 3);

            const height: number = (window.innerHeight - 100) / 3;
            card.init(
                ActionType[Object.keys(ActionType)[randomAction]], 
                EntityType[Object.keys(EntityType)[randomEntity]], height);

            const actualHeight = card.actualHeight;
            
            let positionHeight = (actualHeight / 2) + (i * 25) + 25 + i * actualHeight;
            card.createCard(new Point(window.innerWidth / 2, positionHeight));

            this.AddCardText(positionHeight);

            this.viewport.addChild(card);
        }
        
        this.AddHelpText();
    }

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
        this.doGetRequestJoinAndGetPlayerID().subscribe((data) =>
        {
            if (data['id'])
            {
                this.playerId = data['id'];          

                this.generatePlayerName(); 
                this.NewHandOfCards(); 
            }else{
                // error

            }    
        });
    }

    private NewHandOfCards():void{
        this.doGetRequestGetPlayerCard().subscribe((data) =>
        {
            if (data['PlayerInfo'])
            {
                this.showUI();             
            }else{
                // error
            }
        });
    }

    public doGetRequestStartAndGenerateServerGame(): Observable<any>
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        return this.httpRequest.get('http://localhost:9000/game/generate', {headers: headers});
    }

    public doGetRequestJoinAndGetPlayerID(): Observable<any>
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        return this.httpRequest.get('http://localhost:9000/game/join', {headers: headers});
    }

    public doGetRequestGetPlayerCard(): Observable<any>
    {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        return this.httpRequest.get('http://localhost:9000/game/player/'+this.playerId, {headers: headers});
    }

}
