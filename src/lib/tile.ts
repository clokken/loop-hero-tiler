import { Sprite } from "./spritesheet";
import { World } from "./world";

export abstract class Tile {
    readonly idName: string; // must be UNIQUE among Tile implementations

    constructor(idName: string) {
        this.idName = idName;
    }

    //:: Misc

    calculateValue(world: World, posX: number, posY: number): number | null {
        return null;
    }

    calculateValueAsString(world: World, posX: number, posY: number): string | null {
        return null;
    }

    //:: Graphics

    renderImage(world: World, posX: number, posY: number): Sprite | null {
        return {
            spriteName: this.idName,
        };
    }

    showsOnPalette() {
        return true;
    }

    paletteImage() {
        return this.idName;
    }

    //:: Events

    /** Returns true if it made any change to the world's tiledata */
    onTilePlaced(world: World, posX: number, posY: number): boolean {
        return false;
    }

    /** Returns true if it made any change to the world's tiledata */
    onTileReplaced(world: World, posX: number, posY: number, replacement: Tile): boolean {
        return false;
    }

    protected iterateAdjacentTiles(
        world: World,
        posX: number,
        posY: number,
        includeDiagonals: boolean,
        it: (tile: Tile | undefined) => void,
    ): void {

        it(world.getTileAt(posX - 1, posY));
        it(world.getTileAt(posX + 1, posY));
        it(world.getTileAt(posX, posY - 1));
        it(world.getTileAt(posX, posY + 1));

        if (includeDiagonals) {
            it(world.getTileAt(posX - 1, posY - 1));
            it(world.getTileAt(posX + 1, posY - 1));
            it(world.getTileAt(posX - 1, posY + 1));
            it(world.getTileAt(posX + 1, posY + 1));
        }
    }
}
