import { GameLoaderService } from './game-loader.service';
import { Injectable } from '@angular/core';
import { ViewportManager } from '../game_logic/viewport';
import { FileLoader } from '../game_logic/fileloader';
import { Texture, Sprite } from 'pixi.js';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService 
{
    private viewport: ViewportManager;
    private fileLoader: FileLoader;
    private testThingy: Sprite;

    constructor(private gameLoader: GameLoaderService) { }

    public startGame(): void
    {
        this.viewport = this.gameLoader.viewport;
        this.fileLoader = this.gameLoader.fileLoader;

        const texture: Texture = this.fileLoader.getTextures(['assets/soldier_5.png'])[0];
        this.testThingy = new Sprite(texture);
        this.testThingy.x = window.innerWidth;
        this.testThingy.y = window.innerHeight;
        this.testThingy.anchor.set(0.5);
        this.gameLoader.addGameLoopTicker(this.updateCycle.bind(this));
        this.viewport.addChild(this.testThingy);
    }

    private updateCycle(delta: number): void
    {
        this.testThingy.rotation += .1 * delta;
    }
}
