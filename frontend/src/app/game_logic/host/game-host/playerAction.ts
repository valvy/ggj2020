import { Sprite, Container } from 'pixi.js';

export class PlayerAction
{
    private fixed: boolean;
    private shielded: boolean;

    constructor(private container: Sprite, private fixedSprite: Sprite, private shieldSprite: Sprite)
    {
        this.fixedSprite.anchor.set(0.5, 0.5);
        this.shieldSprite.anchor.set(0.5, 0.5);
    }

    public hasActionBuild(): boolean
    {
        return this.fixed;
    }

    public hasActionShield(): boolean
    {
        return this.shielded;
    }

    public doFix(): void
    {
        this.fixed = true;
        console.log(this.fixedSprite);
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