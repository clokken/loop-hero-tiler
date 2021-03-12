import { PEAK_TILE } from "../registry";
import { Sprite } from "../spritesheet";
import { Tile } from "../tile";
import { World } from "../world";

export class ProtoPeakTile extends Tile {
    paletteImage() {
        return 'peak.png';
    }

    renderImage(world: World, posX: number, posY: number): Sprite | null {
        const sprite = 'peak';

        return {
            spriteName: sprite + '.png',
        };
    }

    /*
        $ @ @   // $ = tileEdge
        @ @ @
        @ @ @
    */
    onTilePlaced(world: World, posX: number, posY: number): boolean {
        // top-left corner of the possible 3x3 grid
        let edge: {x: number, y: number} = {x: posX, y: posY};

        // console.log('--------');
        // console.log(`[${edge.x}, ${edge.y}] - start`);

        for (let x = 1; x < 3; x++) {
            const next = world.getTileAt(edge.x - 1, edge.y);
            if (next !== this)
                break;
            edge = {x: edge.x - 1, y: edge.y};
        }

        // console.log(`[${edge.x}, ${edge.y}] - edge (h)`);

        for (let y = 1; y < 3; y++) {
            const next = world.getTileAt(edge.x, edge.y - 1);
            if (next !== this)
                break;
            edge = {x: edge.x, y: edge.y - 1};
        }

        // console.log(`[${edge.x}, ${edge.y}] - edge (final)`);

        let success = true;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const next = world.getTileAt(edge.x + x, edge.y + y);
                if (next !== this) {
                    success = false;
                    break;
                }
            }
        }

        if (success) {
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    world.setTileAt(edge.x + x, edge.y + y, PEAK_TILE, true);
                }
            }
        }

        return success;
    }
}
