import {
    MdOutlineArrowDropDown,
    MdOutlineArrowDropUp,
    MdOutlineArrowLeft,
    MdOutlineArrowRight
} from 'react-icons/md';
import { gamepadButton } from '../../../../../../src-tauri/singleton';
import './index.scss';

const DPad = (props) => {
    const { size, ...rest } = props;
    return (
        <div
            className="dpad"
            style={{ width: `${40}px`, height: `${40}px` }}
            //style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
            {...rest}
        >
            <button
                className="top"
                onTouchStart={() => gamepadButton(12, 'down')}
                onTouchEnd={() => gamepadButton(12, 'up')}
            >
                <MdOutlineArrowDropUp
                    sx={{ color: '#C3B5B5', fontSize: '12px' }}
                />
            </button>
            <button
                className="bottom"
                onTouchStart={() => gamepadButton(13, 'down')}
                onTouchEnd={() => gamepadButton(13, 'up')}
            >
                <MdOutlineArrowDropDown sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="right"
                onTouchStart={() => gamepadButton(15, 'down')}
                onTouchEnd={() => gamepadButton(15, 'up')}
            >
                <MdOutlineArrowRight sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                className="left"
                onTouchStart={() => gamepadButton(14, 'down')}
                onTouchEnd={() => gamepadButton(14, 'up')}
            >
                <MdOutlineArrowLeft sx={{ color: '#C3B5B5' }} />
            </button>
        </div>
    );
};

export default DPad;

const DpadButton = () => {};
