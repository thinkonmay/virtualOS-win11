import {
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardArrowUp
} from 'react-icons/md';

import { gamepadButton } from '../../../../../../src-tauri/singleton';
import GamepadButton from './defaultBtn';
import './index.scss';

const DPad = (props) => {
    const { size, ...rest } = props;
    return (
        <div
            className="dpad"
            style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
            {...rest}
        >
            <GamepadButton
                className="top"
                onTouchStart={() => gamepadButton(12, 'down')}
                onTouchEnd={() => gamepadButton(12, 'up')}
            >
                <MdKeyboardArrowUp sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
            <GamepadButton
                className="bottom"
                onTouchStart={() => gamepadButton(13, 'down')}
                onTouchEnd={() => gamepadButton(13, 'up')}
            >
                <MdKeyboardArrowDown sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
            <GamepadButton
                className="right"
                onTouchStart={() => gamepadButton(15, 'down')}
                onTouchEnd={() => gamepadButton(15, 'up')}
            >
                <MdKeyboardArrowRight sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
            <GamepadButton
                className="left"
                onTouchStart={() => gamepadButton(14, 'down')}
                onTouchEnd={() => gamepadButton(14, 'up')}
            >
                <MdKeyboardArrowLeft sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
        </div>
    );
};

export default DPad;
