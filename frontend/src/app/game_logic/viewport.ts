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

    public initViewport(): void
    {
        const viewport = new Viewport
        ({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            interaction: this.pixi.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        });
        this.pixi.stage.addChild(viewport);

        viewport
            .pinch({ noDrag: true })
            .wheel()
            .drag()
            .decelerate({ friction: .00001, minSpeed: 0 })
            .zoom(1250, true);
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
}