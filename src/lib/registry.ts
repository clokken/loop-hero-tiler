import { Tile } from "./tile";
import { EmptyTile } from "./tiles/empty";
import { MountainTile } from "./tiles/mountain";
import { PeakTile } from "./tiles/peak";
import { ProtoPeakTile } from "./tiles/proto-peak";
import { RoadTile } from "./tiles/road";
import { RockTile } from "./tiles/rock";

export const EMPTY_TILE = new EmptyTile('empty');
export const ROAD_TILE = new RoadTile('road');
export const ROCK_TILE = new RockTile('rock');
export const MOUNTAIN_TILE = new MountainTile('mountain');
export const PEAK_TILE = new PeakTile('peak');
export const PROTO_PEAK_TILE = new ProtoPeakTile('proto-peak');

export const tileRegistry: Tile[] = [
    EMPTY_TILE,
    ROAD_TILE,
    ROCK_TILE,
    MOUNTAIN_TILE,
    PEAK_TILE,
    PROTO_PEAK_TILE,
];

export const emptyTile = EMPTY_TILE;
