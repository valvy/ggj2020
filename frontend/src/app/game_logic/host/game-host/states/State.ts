import { StateManager } from './../state-manager';
import { Container } from 'pixi.js';
export abstract class State
{
    protected _stateManager: StateManager;
    protected _viewport: Container;

    public abstract handle(delta: number): void;
    public init(stateManager: StateManager, viewport: Container): void
    {
        this._stateManager = stateManager;
        this._viewport = viewport;
    }

    public stateStarted(): void
    {
        
    }

    public stateEnded(): void
    {
        
    }
}