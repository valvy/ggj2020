import { Sprite, Point, Texture } from 'pixi.js';
import { PlayerAction } from './playerAction';

export class PlayerHouse extends Sprite
{
    private size: number;
    private textures: Map<string, Texture>;
    private playerActions: Map<string, PlayerAction[]>

    init(p: Point, width: number, textures: Map<string, Texture>): void
    {
        this.texture = textures.get('assets/house/Base_House.png');
        this.size = width / this.width;
        this.scale.set(this.size, this.size);
        this.position = p;
        this.anchor.set(0.5, 0.5);

        this.playerActions = new Map<string, PlayerAction[]>();        
        
        this.playerActions.set("Window", [
            new PlayerAction(new Sprite(textures.get('assets/house/fixed/Windows.png')), new Sprite(textures.get('assets/house/fixed/Windows.png'))),
            new PlayerAction(new Sprite(textures.get('assets/house/fixed/Windows.png')), new Sprite(textures.get('assets/house/fixed/Windows.png')))]);
        
        this.playerActions.set("Door", [new PlayerAction(new Sprite(textures.get('assets/house/fixed/Door.png')), new Sprite(textures.get('assets/house/fixed/Door.png')))]);
        this.playerActions.set("Roof", [new PlayerAction(new Sprite(textures.get('assets/house/fixed/Roof.png')), new Sprite(textures.get('assets/house/fixed/Roof.png')))]);
    }

    public get actualHeight(): number
    {
        return this.size * this.height;
    }
}