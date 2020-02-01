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

    private cardID:number;  // card if recieved from server and goes back to server.... should macth Host en Server codes
    private isPlayed:boolean;
    private isDiscarded:boolean;


    // STATIC CARD CODES - MAPPED WITH SERVER BACKEND AND WITH HOST-OUTPUT
    // Note when modifying these make sure the match server and host-output
    public static CARD_CODE_FIX_ROOF = 0;    
    public static CARD_CODE_DESTROY_ROOF = 1;
    public static CARD_CODE_SHIELD_ROOF = 4;

    public static CARD_CODE_FIX_WINDOW = 2;
    public static CARD_CODE_DESTROY_WINDOW = 3;
    public static CARD_CODE_SHIELD_WINDOW = 5;

    public static CARD_CODE_FIX_DOOR = 6;
    public static CARD_CODE_DESTROY_DOOR = 7;
    public static CARD_CODE_SHIELD_DOOR = 8;

    public static GetActionTypeByCardID(id:any): ActionType{
        switch(id){
            case 0:  // Build / Fix
            case 2:  // Build / Fix
            case 6:  // Build / Fix
            return ActionType.Build;
            case 1:  // Attack / Destroy
            case 3:  // Attack / Destroy
            case 7:  // Attack / Destroy
            return ActionType.Attack;
            case 4:  // Defend / Shield
            case 5:  // Defend / Shield
            case 8:  // Defend / Shield
            return ActionType.Build;
        }
    }

    public static GetEnityTypeByCardID(id:any): EntityType{
        switch(id){
            case 0:  // Doors
            case 1:  // 
            case 4:  // 
            return EntityType.Door;
            case 2:  // Windows
            case 3:  // 
            case 5:  // 
            return EntityType.Window;
            case 6:  // Roofs
            case 7:  // 
            case 8:  // Defend / Shield
            return EntityType.Roof;
        }
    }

    public get getIsDiscarded(): boolean
    {
        return this.isDiscarded;
    }
    
    public get getIsPlayed(): boolean
    {
        return this.isPlayed;
    }

    public get actualCardID(): number
    {
        return this.cardID;
    }

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

    public init(action: ActionType, entity: EntityType, height: number, cardID:number): void
    {
        this.cardID = cardID;
        this.actionType = action;
        this.entityType = entity;
        this.actionTexture = this.textures.get('assets/cards/' + action + '.png');
        this.entityTexture = this.textures.get('assets/cards/' + entity + '.png');
        this.texture = this.cardTexture;
        this._size = (height / this.height);

        this.isPlayed = false;
        this.isDiscarded = false;

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

        // reset selected state
        this.isPlayed = false;
        this.isDiscarded = false;

        // actually snap to a side or back to middle
        if ( this.position.x < leftSide + (this.actualWidth / 2) ){
            this.position.x = leftSide;
            this.isDiscarded = true;
        }else if(this.position.x > rightSide - (this.actualWidth / 2) ){
            this.position.x = rightSide;
            this.isPlayed = true;
        }else{
            this.position.x = middleSide;
        }

        // TODO if another card has already been put on selcted or discared reset the other card.
    }
}