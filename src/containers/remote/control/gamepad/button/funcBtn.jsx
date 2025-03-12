import { gamepadButton } from '../../../../../../src-tauri/singleton';
import GamepadButton from './defaultBtn';
import './index.scss';

export function RightFuncButton(props) {
    const { name, className, size, ...rest } = props
    const buttonSize = {
        width: size,
        height: size
    };

    return (
        <div className={`rightFuncBtn ${className}`} {...rest}>
            <GamepadButton
                style={{ ...buttonSize }}
                onTouchStart={() => gamepadButton(7, true)}
                onTouchEnd={() => gamepadButton(7)}
            >
                RT
            </GamepadButton>
            <GamepadButton
                style={{ ...buttonSize }}
                onTouchStart={() => gamepadButton(5, true)}
                onTouchEnd={() => gamepadButton(5)}
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
                onTouchStart={() => gamepadButton(6, true)}
                onTouchEnd={() => gamepadButton(6)}
            >
                LT
            </div>
            <div
                className="defaultButton"
                style={{ ...buttonSize }}
                onTouchStart={() => gamepadButton(4, true)}
                onTouchEnd={() => gamepadButton(4)}
            >
                LB
            </div>
        </div>
    );
}
