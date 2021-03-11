import { Tile } from "../tile";
import { World } from "../world";

export class EmptyTile extends Tile {
    renderImage(world: World, posX: number, posY: number) {
        return null;
    }
}
