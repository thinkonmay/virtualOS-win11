import { MdOutlineArrowDropUp } from 'react-icons/md';
import { gamepadButton } from '../../../../../../src-tauri/singleton';
import './index.scss';

const DPad = (props) => {
    const { size, ...rest } = props;
    return (
        <div
            className="dpad"
            style={{ width: `${props.size}px`, height: `${props.size}px` }}
            //style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
            {...rest}
        >
            <button
                className="dpadBtn top"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(12, 'down')}
                onTouchEnd={() => gamepadButton(12, 'up')}
            >
                <MdOutlineArrowDropUp
                    sx={{ color: '#C3B5B5', fontSize: '12px' }}
                />
            </button>
            <button
                className="dpadBtn bottom"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(13, 'down')}
                onTouchEnd={() => gamepadButton(13, 'up')}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="dpadBtn right"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(15, 'down')}
                onTouchEnd={() => gamepadButton(15, 'up')}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="dpadBtn left"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(14, 'down')}
                onTouchEnd={() => gamepadButton(14, 'up')}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
        </div>
    );
};

export default DPad;

const DpadButton = () => {};
