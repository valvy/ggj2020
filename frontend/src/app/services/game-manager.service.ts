import { GameLoaderService } from './game-loader.service';
import { Injectable } from '@angular/core';
import { FileLoader } from '../game_logic/fileloader';
import { Texture, Sprite, Container, Text, Loader, Point } from 'pixi.js';
import { Card, ActionType, EntityType } from '../game_logic/card';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService 
{
    private viewport: Container;
    private fileLoader: FileLoader;
    private textures: Map<string, Texture>;
    private data: any;
    private dragging: boolean;

    constructor(private gameLoader: GameLoaderService) 
    {

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
            card.init(
                ActionType[Object.keys(ActionType)[randomAction]], 
                EntityType[Object.keys(EntityType)[randomEntity]]);

            card.createCard(new Point(window.innerWidth / 2, i * 250 + 150));

            this.viewport.addChild(card);
        }       
        
        this.gameLoader.addGameLoopTicker(this.updateCycle.bind(this));        
    }

    private updateCycle(delta: number): void
    {
    }
}
