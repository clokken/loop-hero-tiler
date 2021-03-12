import { EMPTY_TILE, PROTO_PEAK_TILE } from "../registry";
import { Sprite } from "../spritesheet";
import { Tile } from "../tile";
import { World } from "../world";
import { MountainTile } from "./mountain";
import { RockTile } from "./rock";

type Position =
    'topleft' | 'topcenter' | 'topright' |
    'midleft' | 'midcenter' | 'midright' |
    'botleft' | 'botcenter' | 'botright' ;

const positionsOrder: Position[] = [
    'topleft', 'topcenter', 'topright',
    'midleft', 'midcenter', 'midright',
    'botleft', 'botcenter', 'botright'
];

export class PeakTile extends Tile {
    showsOnPalette() {
        return false;
    }

    calculateValue(world: World, posX: number, posY: number): number {
        // +48% hp
        // +2% additional hp for every adjacent mountain/rock tile.

        const pos = this.calculatePosition(world, posX, posY);

        if (pos === null) // ERROR
            return 0;

        if (pos === 'midcenter')
            return 48;

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

    renderImage(world: World, posX: number, posY: number): Sprite | null {
        const pos = this.calculatePosition(world, posX, posY);
        const sprite = pos === null
            ? 'error.png'
            : `peak-${pos}.png`;

        return {
            spriteName: sprite,
        };
    }

    onTilePlaced(world: World, posX: number, posY: number): boolean {
        if (posX % 2 !== 0)
            return false;

        return world.tryToSetTileAt(posX + 1, posY, this);
    }

    onTileReplaced(world: World, posX: number, posY: number, replacement: Tile): boolean {
        if (replacement === PROTO_PEAK_TILE) {
            return false;
        }

        // top-left corner of the possible 3x3 grid
        let edge: {x: number, y: number} = {x: posX, y: posY};

        for (let x = 1; x < 3; x++) {
            const next = world.getTileAt(edge.x - 1, edge.y);
            if (next !== this)
                break;
            edge = {x: edge.x - 1, y: edge.y};
        }

        for (let y = 1; y < 3; y++) {
            const next = world.getTileAt(edge.x, edge.y - 1);
            if (next !== this)
                break;
            edge = {x: edge.x, y: edge.y - 1};
        }

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (world.getTileAt(edge.x + x, edge.y + y) === this) {
                    world.setTileAt(edge.x + x, edge.y + y, EMPTY_TILE, true);
                }
            }
        }

        return true;
    }

    /** null == invalid */
    private calculatePosition(world: World, posX: number, posY: number): Position | null {
        let edge: [number, number] = [posX, posY];

        for (let x = 1; x < 3; x++) {
            const next = world.getTileAt(edge[0] - 1, edge[1]);
            if (next !== this)
                break;
            edge = [edge[0] - 1, edge[1]];
        }

        for (let y = 1; y < 3; y++) {
            const next = world.getTileAt(edge[0], edge[1] - 1);
            if (next !== this)
                break;
            edge = [edge[0], edge[1] - 1];
        }

        const offsetX = posX - edge[0];
        const offsetY = posY - edge[1];

        const idx = (offsetY * 3) + offsetX;
        return positionsOrder[idx] ?? null;
    }
}
