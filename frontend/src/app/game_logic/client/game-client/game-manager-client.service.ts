import { GameLoaderService } from '../../../services/game-loader.service';
import { Injectable } from '@angular/core';
import { FileLoader } from '../../fileloader';
import { Texture, Sprite, Container, Text, Loader, Point, TextStyle } from 'pixi.js';
import { Card, ActionType, EntityType } from '../../card';

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

    private styleTxtDiscard:TextStyle;
    private styleTxtPlay:TextStyle;
    private styleTxtTitle:TextStyle;
    private styleTxtHelp:TextStyle;



    constructor(private gameLoader: GameLoaderService) 
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
    private AddHelpText() : void
    {
        const textTitle = new Text('Your hand', this.styleTxtTitle);
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

        this.gameLoader.addGameLoopTicker(this.updateCycle.bind(this));        
    }

    private updateCycle(delta: number): void
    {

    }

}
