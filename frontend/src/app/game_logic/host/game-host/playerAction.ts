import { Sprite, Container } from 'pixi.js';

export class PlayerAction
{
    private container: Container;
    private fixed: boolean;
    private shielded: boolean;

    private fixedSprite: Sprite;
    private shieldSprite: Sprite;

    constructor(fixedSprite: Sprite, shieldSprite: Sprite)
    {
        
    }

    public doFix(): void
    {
        this.fixed = true;
        this.container.addChild(this.fixedSprite);
    }

    public doShield(): void
    {
        if (this.fixed)
        {
            this.shielded = true;
            this.container.addChild(this.shieldSprite);
        }
    }

    public doDestroy(): void
    {
        if (this.shielded)
        {
            this.shielded = false;
            this.container.removeChild(this.shieldSprite);
        } else if (this.fixed)
        {
            this.fixed = false;
            this.container.removeChild(this.fixedSprite);
        }
    }
};