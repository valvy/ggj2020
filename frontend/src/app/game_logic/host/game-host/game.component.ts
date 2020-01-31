import { GameManagerService } from '../../../services/game-manager.service';
import { Vector } from 'vector2d';
import { GameLoaderService } from '../../../services/game-loader.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit
{    
    @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
    @ViewChild('uiContainer', {static: false}) uiContainer: ElementRef;

    private interactionStart: Vector;
    constructor(private gameLoader: GameLoaderService, private gameManager: GameManagerService) { }

    ngAfterViewInit()
    {        
        const canvas: HTMLCanvasElement = this.gameLoader.init(() =>
        {
            this.gameManager.startGame();
            return this.pixiContainer.nativeElement.appendChild(canvas);
        });
    }    

    private onDown(x: number, y: number): void
    {
        this.interactionStart = new Vector(x, y);
    }

    private onUp(x: number, y: number): void
    {
        const interactionEnd: Vector = new Vector(x, y);
        const dist: number = this.interactionStart.distance(interactionEnd);
        
        if (dist < 2)
        {
            //tap happened.
        }
    }

    touchStart(event: TouchEvent): void
    {
        const touch: Touch = event.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        this.onDown(x, y);
    }

    mouseDown(event: MouseEvent): void
    {
        const x: number = event.clientX;
        const y: number = event.clientY; 
        this.onDown(x, y);
    }

    touchEnd(event: TouchEvent): void
    {
        const touch: Touch = event.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        this.onUp(x, y);
    }

    mouseUp(event: MouseEvent): void
    {
        const x: number = event.clientX;
        const y: number = event.clientY;
        this.onUp(x, y);
    }
}