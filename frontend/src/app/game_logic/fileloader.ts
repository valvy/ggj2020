import { Sprite, Loader, Texture } from 'pixi.js';

export class FileLoader
{
    private textures: Map<string, Texture>

    constructor()
    {
        this.textures = new Map<string, Texture>();
    }

    public loadTextures(filenames: string[], onFilesLoaded: () => void )
    {
        const loader: Loader = new Loader();
        loader.add(filenames);
        loader.load((loader, resources) =>
        {
            filenames.forEach((f: string) =>
            {
                this.textures.set(f, resources[f].texture);
            });
            onFilesLoaded();
        });
    }

    public getTextures(filenames: string[]): Texture[]
    {
        const textures: Texture[] = [];

        filenames.forEach((f: string) =>
        {
            textures.push(this.textures.get(f));
        });

        return textures;
    }
};