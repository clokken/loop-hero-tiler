import React from 'react';
import { Tile } from '../../lib/tile';
import { MouseButton } from '../../lib/types';
import { World } from '../../lib/world';
import { MapDefinitions, MapRendererOptions, SpritePool, TileResolver } from '../TilerManager';
import styles from './TilerMapGrid.module.scss';

type Props = {
    tileData: readonly number[];
    mapRendererOptions: MapRendererOptions;
    mapDefinitions: MapDefinitions;
    tileResolver: TileResolver;
    spritePool: SpritePool;
    onClick: (x: number, y: number, button: MouseButton) => void;
};

const TilerMapGrid: React.FC<Props> = (props) => {
    // TODO optimize this better (probably need to remove props.tileData
    // from dep list (but doing that stops tiles from syncinc))
    const world: World = React.useMemo(() => {
        return {
            mapWidth: props.mapDefinitions.mapWidth,
            mapHeight: props.mapDefinitions.mapHeight,
            getTileAt: (x: number, y: number) => {
                const tileId = props.tileData[(y * props.mapDefinitions.mapWidth) + x];
                return props.tileResolver.getTileFromId(tileId);
            },
        };
    }, [props.mapDefinitions, props.tileResolver, props.tileData]);

    const cellStyle: React.CSSProperties = {
        width: props.mapRendererOptions.cellWidthPx + 2, // +2 = border
        height: props.mapRendererOptions.cellHeightPx + 2, // + 2 = border
    };

    const grid = Array.from(new Array(props.mapDefinitions.mapWidth * props.mapDefinitions.mapHeight))
        .map((_, idx) => {
            const tileId = props.tileData[idx];
            const tile = props.tileResolver.getTileFromId(tileId);
            const posX = idx % props.mapDefinitions.mapWidth;
            const posY = Math.floor(idx / props.mapDefinitions.mapWidth);

            const sprite = tile.renderImage(world, posX, posY);
            const metaValue = props.mapRendererOptions.renderMode === 'value'
                ? tile.calculateValueAsString(world, posX, posY)
                : null;

            const pooledSpriteElement = sprite !== null
                ? props.spritePool[sprite.spriteName]
                : null;

            return (
                <TileCell key={idx}
                    cellStyle={cellStyle}
                    parentProps={props}
                    posX={posX}
                    posY={posY}
                    tile={tile}
                    world={world}
                    metaValue={metaValue}
                    useSprite={pooledSpriteElement}
                />
            );
        });

    return (
        <div className={styles.grid + ' noselect'} style={{
            width: props.mapDefinitions.mapWidth * (props.mapRendererOptions.cellWidthPx + 2), // +2 = border
            fontSize: props.mapRendererOptions.cellFontSizePx,
        }}>
            {grid}
        </div>
    );
};

const TileCell: React.FC<{
    cellStyle: React.CSSProperties;
    parentProps: Props;
    posX: number;
    posY: number;
    tile: Tile;
    world: World;
    useSprite: React.ReactElement | null;
    metaValue: string | null;
}> = (props) => {
    // TODO maybe wrap all this inside React.useMemo

    const maxSize = Math.min(
        props.parentProps.mapRendererOptions.cellWidthPx,
        props.parentProps.mapRendererOptions.cellHeightPx,
    );

    const content = React.useMemo(() => (
        <>
            <div style={{
                // maxWidth: maxSize,
                // maxHeight: maxSize,
                width: maxSize,
                height: maxSize,
            }}>
                {props.useSprite}
            </div>

            {props.metaValue !== null
                && <div className={styles.metaValue}><span>{props.metaValue}</span></div>}

            {props.useSprite !== null
                ? <div className={styles.overlay + ' ' + styles.strong}></div>
                : <div className={styles.overlay + ' ' + styles.weak}></div>}
        </>
    ), [props.metaValue, maxSize, props.useSprite]);

    return (
        <div
            className={styles.tile}
            style={props.cellStyle}
            onMouseUp={(e) => {
                const button = e.button;
                props.parentProps.onClick(props.posX, props.posY, button);
            }}
            onContextMenu={e => {
                e.preventDefault();
                return false;
            }}
        >
            {content}
        </div>
    );
};

export default TilerMapGrid;
