import React from 'react';
import styles from './TilerPaletteOption.module.scss';
import { Tile } from '../../lib/tile';

type Props = {
    tile: Tile;
    isActive: boolean;
    toggle: () => void;
};

const TilerPaletteOption: React.FC<Props> = (props) => {
    const imgSrc = 'res/palette/' + props.tile.paletteImage() + '.png';

    return (
        <div
            className={styles.root + ' ' + (props.isActive ? styles.active : '')}
            onClick={e => props.toggle()}
        >
            <img
                src={imgSrc}
                alt={props.tile.idName}
                title={props.tile.idName} />
        </div>
    );
};

export default TilerPaletteOption;
