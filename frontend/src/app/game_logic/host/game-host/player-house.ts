import { Sprite, Point, Texture, Text } from 'pixi.js';
import { PlayerAction } from './playerAction';
import { iAction } from './state-manager';
import { Constants } from 'src/app/Constants';

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
            new PlayerAction(this, new Sprite(textures.get('assets/house/fixed/Windows1.png')), new Sprite(textures.get('assets/house/shield/Windows1.png'))),
            new PlayerAction(this, new Sprite(textures.get('assets/house/fixed/Windows2.png')), new Sprite(textures.get('assets/house/shield/Windows2.png')))]);
        
        this.playerActions.set("Door", [new PlayerAction(this, new Sprite(textures.get('assets/house/fixed/Door.png')), new Sprite(textures.get('assets/house/shield/Door.png')))]);
        this.playerActions.set("Roof", [new PlayerAction(this, new Sprite(textures.get('assets/house/fixed/Roof.png')), new Sprite(textures.get('assets/house/shield/Roof.png')))]);
    }

    public hasPlayerAction(action: iAction): boolean
    {
        let playerActions: PlayerAction[] = this.playerActions.get(action.name);
        for (let i = 0; i < playerActions.length; i++)
        {
            if (playerActions[i].hasActionBuild())
                return true;
        }
        return false;
    }

    public doCreate(action: iAction): void
    {
        console.log('do create', action);
        let playerActions: PlayerAction[] = this.playerActions.get(action.name);

        if (playerActions.length > 1 && playerActions[0].hasActionBuild())
        {
            playerActions[1].doFix();
        } else
        {
            playerActions[0].doFix();
        }
    }

    public doShield(action: iAction): void
    {
        console.log('do shield', action);
        let playerActions: PlayerAction[] = this.playerActions.get(action.name);
        
        if (playerActions.length > 1 && playerActions[0].hasActionShield())
        {
            playerActions[1].doShield();
        } else
        {
            playerActions[0].doShield();
        }
    }

    public doDestroy(action: iAction): void
    {
        console.log('do destroy', action);
        let playerActions: PlayerAction[] = this.playerActions.get(action.name);
        if (playerActions.length > 1 && playerActions[0].hasActionBuild())
        {
            playerActions[1].doDestroy();
        } else
        {
            playerActions[0].doDestroy();
        }
    }

    public showGameResult(text: string): void
    {
        const textresult = new Text(text, Constants.style);
        textresult.anchor.set(0.5, 0.5);
        textresult.position.set(0, -150);
        textresult.scale.set(5, 5);

        this.addChild(textresult);
    }

    public get actualHeight(): number
    {
        return this.size * this.height;
    }
}