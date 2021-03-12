import React from 'react';
import styles from './TileManager.module.scss';
import { Json } from '../lib/json';
import Common from '../Common';
import TabView from './TabView';
import TilerOptions from './TilerOptions';
import TilerMapPanel from './mapPanel/TilerMapPanel';
import TilerStringPanel from './TilerStringPanel';
import { Tile } from '../lib/tile';
import { emptyTile, tileRegistry } from '../lib/registry';
import LoaderService from '../lib/services/loader-service';
import { SpritesheetInfo } from '../lib/spritesheet';
import { MouseButton } from '../lib/types';
import { StandardWorld } from '../lib/world';

export type MapDefinitions = {
    mapWidth: number;
    mapHeight: number;
};

export type TileResolver = {
    allTiles: Tile[];
    getTileFromId: (tileId: number) => Tile; // tile id -> tile
    getIdFromTile: (tile: Tile) => number; // tile -> tile id
};

export type MapRendererOptions = {
    mapGridWidthPx: number;
    mapGridHeightPx: number;
    cellWidthPx: number;
    cellHeightPx: number;
    cellFontSizePx: number;
    renderMode: RenderMode;
};

export type RenderMode = 'normal' | 'value';

export type PaletteController = {
    currentTile: Tile | null;
};

export type SpritePool = {[spriteName: string]: React.ReactElement}; // maps spriteNames -> Elements

type MainOptions = {
    mapWidth: number;
    mapHeight: number;
};

const loaderService = new LoaderService();

const TilerManager: React.FC<MainOptions> = (props) => {
    //:: State

    const [statusMessage, setStatusMessage] = React.useState('Loading...');
    const [jsonData, setJsonData] = React.useState<Json>();
    const [mapDefinitions, setMapDefinitions] = React.useState<MapDefinitions>({
        mapWidth: props.mapWidth,
        mapHeight: props.mapHeight,
    });
    const [tileResolver, setTileResolver] = React.useState<TileResolver>();
    const [tileData, setTileData] = React.useState<number[]>();
    const [mapRendererOptions, setMapRendererOptions] = React.useState<MapRendererOptions>(
        DEFAULT_MAP_RENDERER_OPTIONS
    );
    const [spritePool, setSpritePool] = React.useState<SpritePool>();
    const [world, setWorld] = React.useState<StandardWorld>();

    const paletteController = React.useRef<PaletteController>({
        currentTile: null,
    });

    //:: Hooks

    React.useEffect(() => {
        setStatusMessage('Loading tiles...');

        loaderService.loadJson().then(json => {
            setStatusMessage('Loading spritesheet information...');

            loaderService.loadSpritesheetInfo().then(spritesheetInfo => {
                setStatusMessage('Loading spritesheet image...');

                // TODO call this method \/ asynchronously to the above
                loaderService.loadSpritesheetImage().then(() => {
                    setStatusMessage('Generating sprite elements...');

                    setJsonData(json);
                    setSpritePool(loadSpritePool(spritesheetInfo));
                });
            });
        }).catch(Common.handleError);
    }, []);

    React.useEffect(() => {
        if (jsonData) {
            const data = jsonData as Record<string, string>;
            const tileIdsToNames: {[id: number]: Tile} = {};
            const tileNamesToIds: {[name: string]: number} = {};

            for (const tileIdStr in data) {
                const tileId = parseInt(tileIdStr);
                const tileIdName = data[tileIdStr];
                const tile = tileRegistry.find(next => next.idName === tileIdName);

                if (!tile)
                    throw new Error(`No tile registered with name: '${tileIdName}'`);

                for (const key in tileIdsToNames) {
                    const value = tileIdsToNames[key];

                    if (value.idName === tileIdName)
                        throw new Error(`Two tiles have duplicated id names: ${tileIdName}`);
                }

                tileIdsToNames[tileId] = tile;
                tileNamesToIds[tile.idName] = tileId;
            }

            setTileResolver({
                allTiles: tileRegistry,
                getTileFromId: (tileId) => tileIdsToNames[tileId],
                getIdFromTile: (tile) => tileNamesToIds[tile.idName],
            });
        }
    }, [jsonData]);

    React.useEffect(() => {
        if (tileResolver) {
            const emptyId = tileResolver.getIdFromTile(emptyTile);
            const data = initializeTileData(mapDefinitions.mapWidth, mapDefinitions.mapHeight, emptyId);

            setTileData(data);
            setWorld(new StandardWorld(mapDefinitions, tileResolver, data, setTileData));
        }
    }, [tileResolver, mapDefinitions]);

    //:: Setup

    if (!jsonData || !tileData || !tileResolver || !spritePool || !world) {
        return (
            <div>{statusMessage}</div>
        );
    }

    const onTileClick = (posX: number, posY: number, button: MouseButton) => {
        if (posX < 0 || posX >= mapDefinitions.mapWidth
                || posY < 0 || posY >= mapDefinitions.mapHeight)
        {
            console.error(`onTileClick out of bounds: [${posX}, ${posY}]`);
            return;
        }

        const paletteTile = button === MouseButton.Right
            ? emptyTile
            : paletteController.current.currentTile;

        if (paletteTile === null)
            return;

        world.tryToSetTileAt(posX, posY, paletteTile);
    };

    //:: Components

    const mapView = <TilerMapPanel
        tileData={tileData}
        setTileData={setTileData}
        mapDefinitions={mapDefinitions}
        mapRendererOptions={mapRendererOptions}
        tileResolver={tileResolver}
        paletteController={paletteController.current}
        spritePool={spritePool}
        onClick={onTileClick}
        world={world}
    />;

    const stringView = <TilerStringPanel />;

    return (
        <div className={styles.rootWrapper}>
            <div className={styles.tabviewWrapper} style={{
                width: mapRendererOptions.mapGridWidthPx,
                height: mapRendererOptions.mapGridHeightPx,
            }}>
                <TabView
                    elements={[
                        { element: mapView, label: 'Tile Map' },
                        { element: stringView, label: 'Import/Export' },
                    ]}
                />
            </div>

            <TilerOptions
                mapDefinitions={mapDefinitions}
                setMapDefinitions={setMapDefinitions}
                mapRendererOptions={mapRendererOptions}
                setMapRendererOptions={setMapRendererOptions}
                resetMap={() => {
                    const emptyId = tileResolver.getIdFromTile(emptyTile);
                    const data = initializeTileData(mapDefinitions.mapWidth, mapDefinitions.mapHeight, emptyId);

                    world.overwriteData(data);
                    setTileData(data);
                }}
            />
        </div>
    );
};

export default TilerManager;

export const DEFAULT_MAP_RENDERER_OPTIONS: MapRendererOptions = {
    mapGridWidthPx: 800,
    mapGridHeightPx: 650,
    cellWidthPx: 44,
    cellHeightPx: 44,
    cellFontSizePx: 16,
    renderMode: 'normal',
};

function initializeTileData(wid: number, hei: number, fillId: number): number[] {
    const result = new Array(wid * hei).fill(fillId);
    return result;
}

function loadSpritePool(info: SpritesheetInfo): SpritePool {
    const spritePool: SpritePool = {};

    for (const spriteName in info.coordinateMap) {
        const coordinates = info.coordinateMap[spriteName];

        /*
            background-size: (($total_width / {{width}}) * 100%) (($total_height / {{height}}) * 100%);
            background-image: url({{{escaped_image}}});
            background-position: (({{offset_x}} / ($total_width - {{width}})) * -100%) (({{offset_y}} / ($total_height - {{height}})) * -100%);
            width: {{px.width}};
            height: {{px.height}};
        */

        // const wid = coordinates.w;
        // const hei = coordinates.h;
        const bgWid = ((info.meta.wid / coordinates.w) * 100) + '%';
        const bgHei = ((info.meta.hei / coordinates.h) * 100) + '%';
        const posX = ((coordinates.x / (info.meta.wid - coordinates.w)) * 100) + '%';
        const posY = ((coordinates.y / (info.meta.hei - coordinates.h)) * 100) + '%';

        const element = (
            <div className='sprite'
            style={{
                // width: wid,
                // height: hei,
                backgroundImage: `url('${info.url}')`,
                backgroundPosition: `${posX} ${posY}`,
                backgroundSize: `${bgWid} ${bgHei}`,
                // maxWidth: '100%',
                // maxHeight: '100%',
                width: '100%',
                height: '100%',
            }} />
        );

        spritePool[spriteName] = element;
    }

    return spritePool;
}
