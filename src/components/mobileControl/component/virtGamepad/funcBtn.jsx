import { gamePadBtnCallback } from '../../../../backend/reducers/remote';
import GamepadButton from '../defaultBtn';
import './index.scss';

export function RightFuncButton(props) {
    const { name, className, size, ...rest } = props;

    const buttonSize = {
        width: size,
        height: size
    };
    const onTouch = (index, type) => {
        gamePadBtnCallback(index, type);
    };
    return (
        <div className={`rightFuncBtn ${className}`} {...rest}>
            <GamepadButton
                style={{ ...buttonSize }}
                onTouchStart={(e) => onTouch(7, 'down')}
                onTouchEnd={(e) => onTouch(7, 'up')}
            >
                RT
            </GamepadButton>
            <GamepadButton
                style={{ ...buttonSize }}
                onTouchStart={(e) => onTouch(5, 'down')}
                onTouchEnd={(e) => onTouch(5, 'up')}
            >
                RB
            </GamepadButton>
        </div>
    );
}

export function LeftFuncButton(props) {
    const { size = 50, className, ...rest } = props;
    const buttonSize = {
        width: size,
        height: size
    };
    const onTouch = (index, type) => {
        gamePadBtnCallback(index, type);
    };
    return (
        <div {...rest} className={`leftFuncBtn ${className}`}>
            <div
                className="defaultButton"
                style={{ ...buttonSize }}
                onTouchStart={(e) => onTouch(6, 'down')}
                onTouchEnd={(e) => onTouch(6, 'up')}
            >
                LT
            </div>
            <div
                className="defaultButton"
                style={{ ...buttonSize }}
                onTouchStart={(e) => onTouch(4, 'down')}
                onTouchEnd={(e) => onTouch(4, 'up')}
            >
                LB
            </div>
        </div>
    );
}
