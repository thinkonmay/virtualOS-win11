import { gamepadButton } from '../../../../../../src-tauri/singleton';
import GamepadButton from './defaultBtn';
import './index.scss';

export function RightFuncButton(props) {
    const { name, className, size, ...rest } = props;

    const buttonSize = {
        width: size,
        height: size
    };
    const onTouch = (index, type) => {
        gamepadButton(index, type);
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
    return (
        <div {...rest} className={`leftFuncBtn ${className}`}>
            <div
                className="defaultButton"
                style={{ ...buttonSize }}
                onTouchStart={() => gamepadButton(6, 'down')}
                onTouchEnd={() => gamepadButton(6, 'up')}
            >
                LT
            </div>
            <div
                className="defaultButton"
                style={{ ...buttonSize }}
                onTouchStart={() => gamepadButton(4, 'down')}
                onTouchEnd={() => gamepadButton(4, 'up')}
            >
                LB
            </div>
        </div>
    );
}
