import { Injectable } from '@angular/core';
import { GameLoaderService } from 'src/app/services/game-loader.service';
import { Container, Texture } from 'pixi.js';
import { FileLoader } from '../../fileloader';
import { StateManager, StateType } from './state-manager';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameManagerHostService 
{
    private viewport: Container;
    private fileLoader: FileLoader;
    private textures: Map<string, Texture>;
    private stateManager: StateManager;

    constructor(private gameLoader: GameLoaderService, private _httpClient: HttpClient) 
    {
        
    }

    public startGame(): void
    {
        this.viewport = this.gameLoader.pixi.stage;
        this.fileLoader = this.gameLoader.fileLoader;
        this.textures = this.fileLoader.getTextures([
            'assets/cards/card-bg.png', 'assets/cards/defend.png', 'assets/cards/attack.png', 'assets/cards/build.png',
            'assets/cards/door.png', 'assets/cards/roof.png', 'assets/cards/window.png']);

        this.stateManager = new StateManager(this.viewport, this._httpClient);
        this.stateManager.gotoState(StateType.WaitingForPlayers);
        this.gameLoader.addGameLoopTicker((delta: number) => this.stateManager.gameTick(delta));
    }
}