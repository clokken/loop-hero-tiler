import { Tile } from "./tile";

export type World = Readonly<{
    mapWidth: number;
    mapHeight: number;

    getTileAt(posX: number, posY: number): Tile;
}>;
