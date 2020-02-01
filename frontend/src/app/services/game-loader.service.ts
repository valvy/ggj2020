import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { FileLoader } from '../game_logic/fileloader';

@Injectable({
    providedIn: 'root'
})
export class GameLoaderService
{
    private _pixi: PIXI.Application; // this will be our pixi application
    private _fileLoader: FileLoader;
   
    public get pixi(): PIXI.Application
    {
        return this._pixi;
    }

    public get fileLoader(): FileLoader
    {
        return this._fileLoader;
    }

    public addGameLoopTicker(cycle: (delta) => void): void
    {
        this._pixi.ticker.add(cycle);
    }

    private initPixi(): void
    {
        this._pixi = new PIXI.Application({ backgroundColor: 0x0 });

        PIXI.autoDetectRenderer({ 
            width: window.innerWidth,
            height: window.innerHeight, 
            antialias: true, 
            transparent: true });
    } 

    public init(cb: () => void): HTMLCanvasElement
    {
        this.initPixi();
        this.resizePixi(); //can also be done on resize event.
        
        this.loadFiles(cb);
        return this._pixi.view;
    }

    private loadFiles(onFilesLoaded: () => void): void
    {
        this._fileLoader = new FileLoader();
        this._fileLoader.loadTextures(['assets/cards/card-bg.png', 
        //house stuff
        'assets/house/Base_House.png', 'assets/house/fixed/Door.png', 'assets/house/fixed/Roof.png', 'assets/house/fixed/Windows.png' ,

        //cards stuff
            'assets/cards/defend.png', 'assets/cards/attack.png', 'assets/cards/build.png',
            'assets/cards/door.png', 'assets/cards/roof.png', 'assets/cards/window.png'], onFilesLoaded);
        this._pixi.start();
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
        this._pixi.renderer.resize(w, h);
        this._pixi.stage.scale.set(1, 1);
    }
}
