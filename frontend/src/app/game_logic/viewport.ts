import { Vector } from 'vector2d';
import { Viewport } from 'pixi-viewport';

export class ViewportManager
{
    private viewport: Viewport;
    constructor(private pixi: PIXI.Application)
    {
        
    }

    public get $viewport(): Viewport
    {
        return this.viewport;
    }

    public initViewport(width: number, height: number): void
    {
        const viewport = new Viewport
        ({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: width,
            worldHeight: height,
            interaction: this.pixi.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        });
        this.pixi.stage.addChild(viewport);

        viewport
            .drag({ factor: 1 })
            .pinch({ noDrag: true })
            .wheel()            
            .clamp({ direction: 'all' })
            .clampZoom({ 
                minWidth: 750, maxWidth: 2500, 
                minHeight: 750, maxHeight: 2500 })
            .decelerate({ friction: .00001, minSpeed: 0 }).
            zoom(2500, true);

        this.viewport = viewport;
    }

    public snapToPosition(x: number, y: number): void
    {
        this.viewport.snap(x, y, { time: 500, ease: 'easeInOutSine', removeOnComplete: true, removeOnInterrupt: true });
    }
    
    public addChild(c: any): void
    {
        this.viewport.addChild(c);
    }

    public get position(): Vector
    {
        const x: number = this.viewport.x;
        const y: number = this.viewport.y;
        return new Vector(x, y);
    }

    public get scale(): Vector
    {
        const x: number = this.viewport.scale.x;
        const y: number = this.viewport.scale.y;
        return new Vector(x, y);
    }

    public render(): void
    {
        this.pixi.renderer.clear();
        this.pixi.renderer.render(this.viewport);        
    }
}