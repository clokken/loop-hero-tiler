// export const DEFAULT_SPRITESHEET = 'spritesheet.png';

export type Sprite = {
    spriteName: string;
};

export type CoordinateMap = {
    [spriteName: string]: {
        x: number;
        y: number;
        w: number;
        h: number;
    }
};

export type SpritesheetInfo = {
    id: string;
    url: string;
    coordinateMap: CoordinateMap;

    meta: {
        image: string;
        wid: number;
        hei: number;
    };
};
