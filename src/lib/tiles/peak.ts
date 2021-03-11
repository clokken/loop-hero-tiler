import { Sprite } from "../spritesheet";
import { Tile } from "../tile";
import { World } from "../world";

export class PeakTile extends Tile {
    calculateValue(world: World, posX: number, posY: number): number {
        // +48% hp
        // +2% additional hp for every adjacent mountain/rock tile.

        let value = 0;

        this.iterateAdjacentTiles(world, posX, posY, false, tile => {
            //
        });

        return value;
    }

    calculateValueAsString(world: World, posX: number, posY: number): string | null {
        const value = this.calculateValue(world, posX, posY);
        return value > 0
            ? ('+' + value)
            : ('' + value);
    }

    renderImage(world: World, posX: number, posY: number): Sprite | null {
        const sprite = 'peak';

        return {
            spriteName: sprite + '.png',
        };
    }
}
