import { Injectable } from '@angular/core';
import { ViewportManager } from '../game_logic/viewport';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';
import { FileLoader } from '../game_logic/fileloader';

@Injectable({
    providedIn: 'root'
})
export class GameLoaderService
{
    private pixi: PIXI.Application; // this will be our pixi application
    private graphics: PIXI.Graphics;
    private _viewport: ViewportManager;
    private _fileLoader: FileLoader;
   
    public get viewport(): ViewportManager
    {
        return this._viewport;
    }

    public get fileLoader(): FileLoader
    {
        return this._fileLoader;
    }

    public addGameLoopTicker(cycle: (delta) => void): void
    {
        this.pixi.ticker.add(cycle);
    }

    private initPixi(): void
    {
        this.pixi = new PIXI.Application({ backgroundColor: 0x0 });
        this.graphics = new PIXI.Graphics();

        PIXI.autoDetectRenderer({ 
            width: window.innerWidth,
            height: window.innerHeight, 
            antialias: true, 
            transparent: true });
    } 

    public init(cb: () => void): HTMLCanvasElement
    {
        this.initPixi();
        this._viewport = new ViewportManager(this.pixi);
        this._viewport.initViewport(window.innerWidth * 2, window.innerHeight * 2);
        this.resizePixi(); //can also be done on resize event.
        
        this.loadFiles(cb);

        return this.pixi.view;
    }

    private loadFiles(onFilesLoaded: () => void): void
    {
        this._fileLoader = new FileLoader();
        this._fileLoader.loadTextures(['assets/soldier_5.png'], onFilesLoaded);
    }    

    public resizePixi(): void
    {
        let ratio = window.innerWidth / window.innerHeight
        let w: number = window.innerWidth;
        let h: number = window.innerHeight;
        if (w / h >= ratio) 
        {
            w = h * ratio;
        } else 
        {            
            h = w / ratio;
        }
        this.pixi.renderer.resize(w, h);
        this.pixi.stage.scale.set(1, 1);
    }
}