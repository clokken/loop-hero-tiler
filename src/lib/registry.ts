import { Tile } from "./tile";
import { EmptyTile } from "./tiles/empty";
import { MountainTile } from "./tiles/mountain";
import { PeakTile } from "./tiles/peak";
import { RoadTile } from "./tiles/road";
import { RockTile } from "./tiles/rock";

export const tileRegistry: Tile[] = [
    new EmptyTile('empty'),
    new RoadTile('road'),
    new RockTile('rock'),
    new MountainTile('mountain'),
    new PeakTile('peak'),
];

export const emptyTile = tileRegistry[0];
