import { PlayerHouse } from './player-house';
import { GameManagerHostService } from './game-manager-host.service';
import { Vector } from 'vector2d';
import { GameLoaderService } from '../../../services/game-loader.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game-host.component.html',
  styleUrls: ['./game-host.component.scss']
})
export class GameHostComponent implements AfterViewInit
{    
    @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
    @ViewChild('uiContainer', {static: false}) uiContainer: ElementRef;

    constructor(private gameLoader: GameLoaderService, private gameManager: GameManagerHostService) { }

    ngAfterViewInit()
    {        
        const canvas: HTMLCanvasElement = this.gameLoader.init(() =>
        {
            this.gameManager.startGame();
            return this.pixiContainer.nativeElement.appendChild(canvas);
        });
    }
}