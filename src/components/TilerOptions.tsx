import React from 'react';
import styles from './TilerOptions.module.scss';
import { DEFAULT_MAP_RENDERER_OPTIONS, MapDefinitions, MapRendererOptions, RenderMode } from './TilerManager';
import Lodash from 'lodash';

type Props = {
    mapDefinitions: MapDefinitions;
    setMapDefinitions: (defs: MapDefinitions) => void;
    mapRendererOptions: MapRendererOptions;
    setMapRendererOptions: (opts: MapRendererOptions) => void;
    resetMap: () => void;
};

// renderMode -> label
const renderOptions: Record<RenderMode, string> = {
    'normal': 'Normal',
    'value': 'Show values',
};

const TilerOptions: React.FC<Props> = (props) => {
    const [mapGridWidthPx, setMapGridWidthPx] =
        React.useState<number | null>(props.mapRendererOptions.mapGridWidthPx);
    const [mapGridHeightPx, setMapGridHeightPx] =
        React.useState<number | null>(props.mapRendererOptions.mapGridHeightPx);
    const [cellWidthPx, setCellWidthPx] =
        React.useState<number | null>(props.mapRendererOptions.cellWidthPx);
    const [cellHeightPx, setCellHeightPx] =
        React.useState<number | null>(props.mapRendererOptions.cellHeightPx);
    const [cellFontSizePx, setCellFontSizePx] =
        React.useState<number | null>(props.mapRendererOptions.cellFontSizePx);

    const onChangeRenderMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.currentTarget.value;
        props.setMapRendererOptions({
            ...props.mapRendererOptions,
            renderMode: value as RenderMode,
        });
    };

    const onResetOptions = () => {
        const current = props.mapRendererOptions;
        const defaults = DEFAULT_MAP_RENDERER_OPTIONS;

        if (!Lodash.isEqual(current, defaults)) {
            props.setMapRendererOptions(defaults);
            setMapGridWidthPx(defaults.mapGridWidthPx);
            setMapGridHeightPx(defaults.mapGridHeightPx);
            setCellWidthPx(defaults.cellWidthPx);
            setCellHeightPx(defaults.cellHeightPx);
            setCellFontSizePx(defaults.cellFontSizePx);
        }
    };

    const onClearMap = () => {
        props.resetMap();
    };

    return (
        <div className={styles.root}>
            <div className={styles.line}>
                <div className={styles.form}>
                    <label htmlFor="renderMode">Render Mode</label>
                    <select id="renderMode" onChange={e => onChangeRenderMode(e)}>
                        {Object.keys(renderOptions).map(key => (
                            <option value={key} key={key}>
                                {renderOptions[key as RenderMode]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.form}>
                    <label htmlFor="mapGridWidthPx">Canvas Width</label>
                    <DimensionInput value={mapGridWidthPx} setValue={setMapGridWidthPx}
                        doUpdateValue={value => {
                            value = Math.min(value, 4000);
                            value = Math.max(value, 300);
                            props.setMapRendererOptions({
                                ...props.mapRendererOptions,
                                mapGridWidthPx: value,
                            })
                        }}
                    />
                </div>

                <div className={styles.form}>
                    <label htmlFor="mapGridHeightPx">Canvas Height</label>
                    <DimensionInput value={mapGridHeightPx} setValue={setMapGridHeightPx}
                        doUpdateValue={value => {
                            value = Math.max(value, 200);
                            props.setMapRendererOptions({
                                ...props.mapRendererOptions,
                                mapGridHeightPx: value,
                            })
                        }}
                    />
                </div>

                <div className={styles.form}>
                    <label htmlFor="cellWidthPx">Cell Width</label>
                    <DimensionInput value={cellWidthPx} setValue={setCellWidthPx}
                        doUpdateValue={value => {
                            props.setMapRendererOptions({
                                ...props.mapRendererOptions,
                                cellWidthPx: value,
                            })
                        }}
                    />
                </div>

                <div className={styles.form}>
                    <label htmlFor="cellHeightPx">Cell Height</label>
                    <DimensionInput value={cellHeightPx} setValue={setCellHeightPx}
                        doUpdateValue={value => {
                            props.setMapRendererOptions({
                                ...props.mapRendererOptions,
                                cellHeightPx: value,
                            })
                        }}
                    />
                </div>

                <div className={styles.form}>
                    <label htmlFor="cellFontSizePx">Cell Font Size</label>
                    <DimensionInput value={cellFontSizePx} setValue={setCellFontSizePx}
                        doUpdateValue={value => {
                            props.setMapRendererOptions({
                                ...props.mapRendererOptions,
                                cellFontSizePx: value,
                            })
                        }}
                    />
                </div>
            </div>

            <div className={styles.line}>
                <button onClick={() => onResetOptions()}>Reset options</button>
                <div style={{ width: 8 }}></div>
                <button onClick={() => onClearMap()}>Clear all tiles</button>
            </div>
        </div>
    );
};

const DimensionInput: React.FC<{
    value: number | null;
    setValue: (v: number | null) => void;
    doUpdateValue: (v: number) => void;
}> = (props) => {
    const onChange = (
        e: React.FormEvent<HTMLInputElement>,
        doUpdate: boolean,
    ) => {
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        let number: number | null = parseInt(value);

        if (isNaN(number))
            number = null;

        if (number !== props.value)
            props.setValue(value ? number : null);

        if (doUpdate && number && !isNaN(Math.min(number))) {
            props.doUpdateValue(number);
        }
    };

    return (
        <input type="text" id="mapGridHeightPx" value={props.value ?? ''} style={{ width: 100 }}
            onChange={e => onChange(e, false)}
            onBlur={e => onChange(e, true)}
            onKeyDown={e => {
                if (e.key === 'Enter')
                    onChange(e, true);
            }}
        />
    );
};

export default TilerOptions;
