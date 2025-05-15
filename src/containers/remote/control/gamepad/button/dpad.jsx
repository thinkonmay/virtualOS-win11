import { MdOutlineArrowDropUp } from 'react-icons/md';
import { gamepadButton } from '../../../../../../src-tauri/singleton';
import './index.scss';

const DPad = (props) => {
    const { size, ...rest } = props;
    return (
        <div
            className="dpad"
            style={{ width: `${props.size}px`, height: `${props.size}px` }}
            {...rest}
        >
            <button
                className="dpadBtn top"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(12, true)}
                onTouchEnd={() => gamepadButton(12)}
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
                onTouchStart={() => gamepadButton(13, true)}
                onTouchEnd={() => gamepadButton(13)}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="dpadBtn right"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(15, true)}
                onTouchEnd={() => gamepadButton(15)}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="dpadBtn left"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
                onTouchStart={() => gamepadButton(14, true)}
                onTouchEnd={() => gamepadButton(14)}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
        </div>
    );
};

export default DPad;

const DpadButton = () => {};
