import { MapDefinitions, TileResolver } from "../components/TilerManager";
import { Tile } from "./tile";

export type World = Readonly<{
    mapWidth: number;
    mapHeight: number;

    getTileAt(posX: number, posY: number): Tile | undefined;
    setTileAt(posX: number, posY: number, tile: Tile, skipEvents?: boolean): void;
    tryToSetTileAt(posX: number, posY: number, tile: Tile, skipEvents?: boolean): boolean; // true if succeeded
}>;

export class StandardWorld implements World {
    readonly mapDefs: MapDefinitions;
    readonly tileResolver: TileResolver;
    private _data: number[];
    private updateData: (data: number[]) => void;

    constructor(
        mapDefs: MapDefinitions,
        tileResolver: TileResolver,
        tileData: number[],
        updateData: (data: number[]) => void,
    ) {
        this.mapDefs = mapDefs;
        this.tileResolver = tileResolver;
        this._data = tileData;
        this.updateData = updateData;
    }

    get mapWidth() {
        return this.mapDefs.mapWidth;
    }

    get mapHeight() {
        return this.mapDefs.mapHeight;
    }

    get data(): readonly number[] {
        return this._data;
    }

    overwriteData(data: number[]) {
        this._data = data;
    }

    getTileAt(posX: number, posY: number): Tile | undefined {
        if (posX < 0 || posX >= this.mapWidth
            || posY < 0 || posY >= this.mapHeight)
        {
            return undefined;
        }

        const tileId = this._data[(posY * this.mapWidth) + posX];
        return this.tileResolver.getTileFromId(tileId);
    }

    setTileAt(posX: number, posY: number, tile: Tile, skipEvents = false): void {
        const curTile = this.getTileAt(posX, posY);

        if (tile === curTile || curTile === undefined)
            return;

        const tileId = this.tileResolver.getIdFromTile(tile);
        this._data[(posY * this.mapWidth) + posX] = tileId;

        if (!skipEvents) {
            curTile.onTileReplaced(this, posX, posY, tile);
            tile.onTilePlaced(this, posX, posY);
        }

        this.updateData([...this._data]);
    }

    tryToSetTileAt(posX: number, posY: number, tile: Tile, skipEvents = false): boolean {
        this.setTileAt(posX, posY, tile, skipEvents);
        return true;
    }
}
