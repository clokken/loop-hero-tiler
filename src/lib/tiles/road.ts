import { Tile } from "../tile";
import { World } from "../world";

export class RoadTile extends Tile {
    renderImage(world: World, posX: number, posY: number) {
        return null;
    }

    showsOnPalette() {
        return false;
    }
}
