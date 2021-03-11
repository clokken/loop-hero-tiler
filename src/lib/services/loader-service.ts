import { Json } from "../json";
import { CoordinateMap, SpritesheetInfo } from "../spritesheet";

const spritesheet = {
    jsonUrl: 'dist/spritesheet.json',
    imageUrl: 'dist/spritesheet.png',
};

const preloadImages = [
    spritesheet.imageUrl,
];

export default class LoaderService {
    loadJson(): Promise<Json> {
        return fetch('tiles.json').then(response => response.json());
    }

    loadSpritesheetInfo(): Promise<SpritesheetInfo> {
        return fetch(spritesheet.jsonUrl).then(response => response.json())
            .then(json => {
                const coordinateMap: CoordinateMap = {};

                const wid = json['meta']['size']['w'];
                const hei = json['meta']['size']['h'];

                console.log(`${wid} ${hei} !`)

                for (const key in json['frames']) {
                    const frame = json['frames'][key]['frame'];
                    coordinateMap[key] = {
                        x: frame['x'],
                        y: frame['y'],
                        w: frame['w'],
                        h: frame['h'],
                    };
                }

                const result: SpritesheetInfo = {
                    id: 'tiles',
                    url: spritesheet.imageUrl,
                    meta: {
                        image: json['meta']['image'],
                        wid: wid,
                        hei: hei,
                    },
                    coordinateMap: coordinateMap,
                };

                return result;
            });
    }

    loadSpritesheetImage(): Promise<void> {
        return Promise.all(preloadImages.map(preloadImage => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = preloadImage;
            });
        })).then();
    }
}
