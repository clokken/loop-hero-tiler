import React from 'react';
import { MouseButton } from '../../lib/types';
import { World } from '../../lib/world';
import { MapDefinitions, MapRendererOptions, PaletteController, SpritePool, TileResolver } from '../TilerManager';
import TilerMapGrid from './TilerMapGrid';
import style from './TilerMapPanel.module.scss';
import TilerPalette from './TilerPalette';

type Props = {
    tileData: readonly number[];
    setTileData: (tileData: number[]) => void;
    mapRendererOptions: MapRendererOptions;
    mapDefinitions: MapDefinitions;
    tileResolver: TileResolver;
    paletteController: PaletteController;
    spritePool: SpritePool;
    onClick: (x: number, y: number, button: MouseButton) => void;
    world: World;
};

const TilerMapPanel: React.FC<Props> = (props) => {
    return (
        <div className={style.root}>
            <div className={style.gridWrapper}>
                <div className={style.innerGridWrapper}>
                    <TilerMapGrid
                        tileData={props.tileData}
                        mapRendererOptions={props.mapRendererOptions}
                        mapDefinitions={props.mapDefinitions}
                        tileResolver={props.tileResolver}
                        spritePool={props.spritePool}
                        onClick={props.onClick}
                        world={props.world}
                    />
                </div>
            </div>

            <div className={style.paletteWrapper}>
                <TilerPalette
                    allTiles={props.tileResolver.allTiles}
                    paletteController={props.paletteController}
                />
            </div>
        </div>
    );
};

export default TilerMapPanel;
