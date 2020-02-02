import { TextStyle } from 'pixi.js';

export class Constants
{
    static get style(): TextStyle
    {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            align : 'center',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        });
        return style;
    }

    static get baseUrl(): string
    {
        return 'https://ggj2020.azurewebsites.net/api/game/';
    }
}