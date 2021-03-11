import { Tile } from "../tile";
import { World } from "../world";
import { MountainTile } from "./mountain";

export class RockTile extends Tile {
    calculateValue(world: World, posX: number, posY: number): number {
        // +1% of base hp.
        // +1% for each adjacent rock or mountain.

        let value = 1;

        this.iterateAdjacentTiles(world, posX, posY, false, tile => {
            if (tile instanceof RockTile || tile instanceof MountainTile)
                value += 1;
        });

        return value;
    }

    calculateValueAsString(world: World, posX: number, posY: number): string | null {
        const value = this.calculateValue(world, posX, posY);
        return value > 0
            ? ('+' + value)
            : ('' + value);
    }
}
