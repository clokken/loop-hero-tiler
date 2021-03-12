import { Json } from "../json";
import { CoordinateMap, SpritesheetInfo } from "../spritesheet";

const timestamp = new Date().getTime();

const spritesheet = {
    jsonUrl: 'dist/spritesheet.json?ts=' + timestamp,
    imageUrl: 'dist/spritesheet.png?ts=' + timestamp,
};

const preloadImages = [
    spritesheet.imageUrl,
];

export default class LoaderService {
    loadJson(): Promise<Json> {
        return fetch('tiles.json?ts=' + timestamp)
            .then(response => response.json());
    }

    loadSpritesheetInfo(): Promise<SpritesheetInfo> {
        return fetch(spritesheet.jsonUrl).then(response => response.json())
            .then(json => {
                const coordinateMap: CoordinateMap = {};

                const wid = json['spritesheet']['width'];
                const hei = json['spritesheet']['height'];

                for (const key in json['sprites']) {
                    const frame = json['sprites'][key];
                    coordinateMap[key] = {
                        x: frame['x'],
                        y: frame['y'],
                        w: frame['width'],
                        h: frame['height'],
                    };
                }

                const result: SpritesheetInfo = {
                    id: json['spritesheet']['name'],
                    url: spritesheet.imageUrl,
                    meta: {
                        image: json['spritesheet']['image'],
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
