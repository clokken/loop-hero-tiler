import React from 'react';
import styles from './TilerPanels.module.scss';

type Props = {
    elements: {
        element: React.ReactElement;
        label: string;
    }[];
};

const TabView: React.FC<Props> = ({ elements }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const currentElement = elements[activeIndex].element;

    return (
        <div className={styles.root}>
            <div className={styles.tabs + ' noselect'}>
                {elements.map((element, idx) => (
                    <div key={idx}
                        className={styles.tab + (activeIndex === idx ? (' ' + styles.active) : '')}
                        onClick={e => setActiveIndex(idx)}
                    >
                        {element.label}
                    </div>
                ))}
            </div>

            <div className={styles.body}>
                {currentElement}
            </div>
        </div>
    );
};

export default TabView;
