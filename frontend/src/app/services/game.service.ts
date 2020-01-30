import { Injectable } from '@angular/core';
import { ViewportManager } from '../game_logic/viewport';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService
{
    private pixi: PIXI.Application; // this will be our pixi application
    private graphics: PIXI.Graphics;
    private _viewport: ViewportManager;
   
    public get viewport(): ViewportManager
    {
        return this._viewport;
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
        this.resizePixi();
        return this.pixi.view;
        cb();
    }

    generateDebuggerClients(): ClientData[]
    {
        const debugClients: ClientData[] =[];
        /* const client1 = {roomid: '', id: '', addr: '', color: '0x0000ff', name: 'Jur'};
        const client2 = {roomid: '', id: '', addr: '', color: '0x00ffff', name: 'Laura'};
        const client3 = {roomid: '', id: '', addr: '', color: '0xff00ff', name: 'Alex'};
        const client4 = {roomid: '', id: '', addr: '', color: '0xffff00', name: 'Sam'};
        const client5 = {roomid: '', id: '', addr: '', color: '0xffff00', name: 'asdsad'};
        const client6 = {roomid: '', id: '', addr: '', color: '0xffff00', name: 'Saad'};
        debugClients.push(client1, client2, client3, /*client4, client5, client6);*/
        return debugClients;
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
