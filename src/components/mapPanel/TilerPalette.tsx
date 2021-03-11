import React from 'react';
import { Tile } from '../../lib/tile';
import { PaletteController } from '../TilerManager';
import styles from './TilerPalette.module.scss';
import TilerPaletteOption from './TilerPaletteOption';

type Props = {
    allTiles: Tile[];
    paletteController: PaletteController;
};

const TilerPalette: React.FC<Props> = (props) => {
    const [currentTile, setCurrentTile] = React.useState<Tile | null>
        (props.paletteController.currentTile);

    React.useEffect(() => {
        props.paletteController.currentTile = currentTile;
    }, [currentTile, props.paletteController]);

    const onToggle = (tile: Tile) => {
        if (currentTile === tile)
            setCurrentTile(null);
        else
            setCurrentTile(tile);
    };

    return (
        <div className={styles.root + ' noselect'}>
            {props.allTiles.filter(tile => tile.showsOnPalette()).map((tile, idx) => {
                return (
                    <div className={styles.tileWrapper} key={idx}>
                        <TilerPaletteOption
                            tile={tile}
                            isActive={tile === currentTile}
                            toggle={() => onToggle(tile)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default TilerPalette;
