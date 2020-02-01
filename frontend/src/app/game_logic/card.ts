import { Sprite, Texture, Text, Point } from 'pixi.js';
import { debug } from 'util';

export enum ActionType
{
    Attack = "attack",
    Defend = "defend",
    Build = "build"
}

export enum EntityType
{
    Door = "door",
    Window = "window",
    Roof = "roof"
}

export class Card extends Sprite
{
    private cardTexture: Texture;
    private actionTexture: Texture;
    private entityTexture: Texture;
    private actionType: ActionType;
    private entityType: EntityType;

    private dragging: boolean;
    private startDragHorizontal: number;
    private _size: number;


    public get actualHeight(): number
    {
        return this._size * this.height;
    }

    public get actualWidth(): number
    {
        return this.width;
    }

    constructor(private textures: Map<string, Texture>)
    {
        super();

        this.cardTexture = textures.get('assets/cards/card-bg.png');
        this.interactive = true;
        this.buttonMode = true;
    }

    public init(action: ActionType, entity: EntityType, height: number): void
    {
        this.actionType = action;
        this.entityType = entity;
        this.actionTexture = this.textures.get('assets/cards/' + action + '.png');
        this.entityTexture = this.textures.get('assets/cards/' + entity + '.png');
        this.texture = this.cardTexture;
        this._size = (height / this.height);

        this.    // events for drag start
        on('mousedown', this.onDragStart)
        .on('touchstart', this.onDragStart)
        // events for drag end
        .on('mouseup', this.onDragEnd)
        .on('mouseupoutside', this.onDragEnd)
        .on('touchend', this.onDragEnd)
        .on('touchendoutside', this.onDragEnd)
        // events for drag move
        .on('mousemove', this.onDragMove)
        .on('touchmove', this.onDragMove);
    }

    //height between 0 and 1.
    public createCard(pos: Point): void
    {
        this.position.set(pos.x, pos.y);
        this.anchor.set(0.5, 0.5);
        this.scale.set(this._size, this._size);

        //create a title
        this.addTitle();
        
        //create an action icon
        this.addAction();

        //create an entity icon
        this.addEntity();
    }

    private addTitle(): void
    {
        let text = new Text(this.actionType + ' ' + this.entityType,
        {fontFamily : 'Arial', fontSize: 45, fill : this.color, align : 'center'});
        text.anchor.set(0.5, 0.5);
        text.position.set(0, -200);
        this.addChild(text);
    }

    private addAction(): void
    {
        const actionIcon: Sprite = new Sprite(this.actionTexture);
        actionIcon.position.set(150, 200);
        actionIcon.anchor.set(0.5, 0.5);
        actionIcon.scale.set(0.2, 0.2);
        actionIcon.tint = this.color;
        this.addChild(actionIcon);
    }

    private addEntity(): void
    {
        const entityIcon: Sprite = new Sprite(this.entityTexture);
        entityIcon.position.set(0, 0);
        entityIcon.anchor.set(0.5, 0.5);
        entityIcon.scale.set(0.3, 0.3);
        entityIcon.tint = this.color;
        this.addChild(entityIcon);
    }

    private get color(): number
    {
        switch (this.actionType)
        {
            case ActionType.Attack:
                return 0xff0000;
            case ActionType.Build:
                return 0x00ff00;
            case ActionType.Defend:
                return 0x0000ff;
        }
    }

    clientX: number;

    private onDragStart(event): void
    {
        this.dragging = true;
        this.startDragHorizontal = event.data.global.x;
    }

    private onDragMove(event): void
    {
        if (this.dragging)
        {
            const positionHorizontal: number = event.data.global.x;
            this.position.x = positionHorizontal;
        }
    }

    private onDragEnd(event): void
    {
        this.dragging = false;
        this.snapCardToSeletionArea();
    }


    private snapCardToSeletionArea() : void
    {

        let widthPartialSize = (window.innerWidth / 4);
        let leftSide = widthPartialSize * 1;
        let middleSide = window.innerWidth / 2;
        let rightSide = widthPartialSize * 3;

        //console.log("position "+this.position.x+" this.actualWidth  "+this.actualWidth+" leftSide"+leftSide  );

        if ( this.position.x < leftSide + (this.actualWidth / 2) ){
            this.position.x = leftSide;
        }else if(this.position.x > rightSide - (this.actualWidth / 2) ){
            this.position.x = rightSide;
        }else{
            this.position.x = middleSide;
        }
    }
}