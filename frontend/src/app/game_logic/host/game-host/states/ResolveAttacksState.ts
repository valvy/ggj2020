import { ResolveState } from "./ResolveState";
import { Texture, Sprite } from 'pixi.js';
import { StateManager } from './../state-manager';
import { Container } from 'pixi.js';

export class ResolveAttacksState extends ResolveState
{
    private sprite: Sprite;

    constructor(private texture: Texture)
    {
        super();
    } 

    public init(stateManager: StateManager, viewport: Container): void
    {
        super.init(stateManager, viewport);
        this.sprite = new Sprite(this.texture);
        this.sprite.anchor.set(0);
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.sprite.scale.set(0.4);
    }

    public stateStarted(): void
    {
        this._viewport.addChild(this.sprite);
        this.sprite.anchor.set(0);
        this.sprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.sprite.scale.set(0.4);
        this.sprite.rotation = 0;
    }

    public stateEnded(): void
    {
        this._viewport.removeChild(this.sprite);
    }

    public handle(delta: number): void
    {
        this.sprite.rotation += 0.1 * delta;
        this.sprite.scale.x -= 0.003 * delta;
        this.sprite.scale.y -= 0.003 * delta;

        let times = this.sprite.rotation / (2 * Math.PI);
        times =  Math.floor(times);

        let rest = this.sprite.rotation % (2 * Math.PI);

        if (times > 5){
            this._viewport.removeChild(this.sprite);
        }

        if (this.sprite.scale.x < 0.05)
        {
            this.sprite.scale.x = 0.05;
            this.sprite.scale.y = 0.05;
        }
    }
}