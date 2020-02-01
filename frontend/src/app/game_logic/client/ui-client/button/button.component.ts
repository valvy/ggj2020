import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, AfterViewInit
{
    @Input() buttonStyle: any;
    currentTextStyle: any;

    @Input() textStyle: any;
    @Input() buttonText: string;
    @ViewChild('button', {static: false}) buttonimg: ElementRef;
    private buttonElement: any;

    constructor() 
    {
        
    }

    ngOnInit() 
    {
        this.currentTextStyle = this.textStyle;
    }

    ngAfterViewInit()
    {
        this.buttonElement = this.buttonimg.nativeElement;
    }

    touchstart(): void
    {
        this.buttonElement.src = 'assets/UI/window/btn_brown_hover.svg';
        this.currentTextStyle.fontSize = '200%';
    }

    touchend(): void
    {
        this.buttonElement.src = 'assets/UI/window/btn_brown_normal.svg';
        this.currentTextStyle.fontSize = '250%';
    }
}