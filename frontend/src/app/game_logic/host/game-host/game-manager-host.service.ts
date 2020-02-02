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
        
        this.stateManager = new StateManager(this.gameLoader, this.viewport, this._httpClient);
        this.stateManager.gotoState(StateType.WaitingForPlayers);
        this.gameLoader.addGameLoopTicker((delta: number) => this.stateManager.gameTick(delta));
    }
}