import {
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardArrowUp
} from 'react-icons/md';

import { gamePadBtnCallback } from '../../../../backend/reducers/remote';
import GamepadButton from '../defaultBtn';
import './index.scss';

const DPad = (props) => {
    const { size, ...rest } = props;
    const onTouch = (e, type, index) => {
        gamePadBtnCallback(index, type);
    };
    return (
        <div
            className="dpad"
            style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
            {...rest}
        >
            <GamepadButton
                className="top"
                onTouchStart={(e) => onTouch(e, 'down', 12)}
                onTouchEnd={(e) => onTouch(e, 'up', 12)}
            >
                <MdKeyboardArrowUp sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
            <GamepadButton
                className="bottom"
                onTouchStart={(e) => onTouch(e, 'down', 13)}
                onTouchEnd={(e) => onTouch(e, 'up', 13)}
            >
                <MdKeyboardArrowDown sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
            <GamepadButton
                className="right"
                onTouchStart={(e) => onTouch(e, 'down', 15)}
                onTouchEnd={(e) => onTouch(e, 'up', 15)}
            >
                <MdKeyboardArrowRight sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
            <GamepadButton
                className="left"
                onTouchStart={(e) => onTouch(e, 'down', 14)}
                onTouchEnd={(e) => onTouch(e, 'up', 14)}
            >
                <MdKeyboardArrowLeft sx={{ color: '#C3B5B5' }} />
            </GamepadButton>
        </div>
    );
};

export default DPad;
