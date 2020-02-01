import { GameManagerService } from '../../../services/game-manager.service';
import { GameLoaderService } from '../../../services/game-loader.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-host-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameHostComponent implements AfterViewInit
{    
    @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
    @ViewChild('uiContainer', {static: false}) uiContainer: ElementRef;

    constructor(private gameLoader: GameLoaderService, private gameManager: GameManagerService) { }

    ngAfterViewInit()
    {        
        const canvas: HTMLCanvasElement = this.gameLoader.init(() =>
        {
            this.gameManager.startGame();
            return this.pixiContainer.nativeElement.appendChild(canvas);
        });
    }
}