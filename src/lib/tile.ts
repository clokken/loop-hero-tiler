import { Sprite } from "./spritesheet";
import { World } from "./world";

export abstract class Tile {
    readonly idName: string; // must be UNIQUE among Tile implementations

    constructor(idName: string) {
        this.idName = idName;
    }

    calculateValue(world: World, posX: number, posY: number): number | null {
        return null;
    }

    calculateValueAsString(world: World, posX: number, posY: number): string | null {
        return null;
    }

    renderImage(world: World, posX: number, posY: number): Sprite | null {
        return {
            spriteName: this.idName + '.png',
        };
    }

    showsOnPalette() {
        return true;
    }

    paletteImage() {
        return this.idName;
    }

    protected iterateAdjacentTiles(
        world: World,
        posX: number,
        posY: number,
        includeDiagonals: boolean,
        it: (tile: Tile) => void,
    ): void {
        const hasLeft = posX > 0;
        const hasRight = posX < world.mapWidth - 1;
        const hasAbove = posY > 0;
        const hasBelow = posY < world.mapHeight - 1;

        if (hasLeft)
            it(world.getTileAt(posX - 1, posY));
        if (hasRight)
            it(world.getTileAt(posX + 1, posY));
        if (hasAbove)
            it(world.getTileAt(posX, posY - 1));
        if (hasBelow)
            it(world.getTileAt(posX, posY + 1));

        if (includeDiagonals) {
            if (hasLeft && hasAbove)
                it(world.getTileAt(posX - 1, posY - 1));
            if (hasRight && hasAbove)
                it(world.getTileAt(posX + 1, posY - 1));
            if (hasLeft && hasBelow)
                it(world.getTileAt(posX - 1, posY + 1));
            if (hasRight && hasBelow)
                it(world.getTileAt(posX + 1, posY + 1));
        }
    }
}
