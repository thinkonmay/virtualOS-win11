import { gamepadButton } from '../../../../../../src-tauri/singleton';
import GamepadButton from './defaultBtn';
import './index.scss';

export default function YBXA(props) {
    const { size, className, ...rest } = props;

    return (
        <div className={`ybxa ${className}`} {...rest}>
            <div
                className="mainContent"
                style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
            >
                <GamepadButton
                    className="button-y"
                    onTouchStart={() => gamepadButton(3, true)}
                    onTouchEnd={() => gamepadButton(3)}
                >
                    Y
                </GamepadButton>
                <GamepadButton
                    className="button-b"
                    onTouchStart={() => gamepadButton(0, true)}
                    onTouchEnd={() => gamepadButton(0)}
                >
                    A
                </GamepadButton>
                <GamepadButton
                    className="button-x"
                    onTouchStart={() => gamepadButton(1, true)}
                    onTouchEnd={() => gamepadButton(1)}
                >
                    B
                </GamepadButton>
                <GamepadButton
                    className="button-a"
                    onTouchStart={() => gamepadButton(2, true)}
                    onTouchEnd={() => gamepadButton(2)}
                >
                    X
                </GamepadButton>
            </div>
        </div>
    );
}
