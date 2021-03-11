import { Tile } from "../tile";
import { World } from "../world";
import { RockTile } from "./rock";

export class MountainTile extends Tile {
    calculateValue(world: World, posX: number, posY: number): number {
        // +2% of base hp for each adjacent rock or mountain.

        let value = 0;

        this.iterateAdjacentTiles(world, posX, posY, false, tile => {
            if (tile instanceof RockTile || tile instanceof MountainTile)
                value += 2;
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
