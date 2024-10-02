import { gamePadBtnCallback } from '../../../../backend/reducers/remote';
import GamepadButton from '../defaultBtn';
import './index.scss';

export default function YBXA(props) {
    const { size, className, ...rest } = props;

    const onTouch = (e, type, index) => {
        gamePadBtnCallback(index, type);
    };

    return (
        <div className={`ybxa ${className}`} {...rest}>
            <div
                className="mainContent"
                style={{ width: `${size ?? 20}px`, height: `${size ?? 20}px` }}
            >
                <GamepadButton
                    className="button-y"
                    onTouchStart={(e) => onTouch(e, 'down', 3)}
                    onTouchEnd={(e) => onTouch(e, 'up', 3)}
                >
                    Y
                </GamepadButton>
                <GamepadButton
                    className="button-b"
                    onTouchStart={(e) => onTouch(e, 'down', 0)}
                    onTouchEnd={(e) => onTouch(e, 'up', 0)}
                >
                    A
                </GamepadButton>
                <GamepadButton
                    className="button-x"
                    onTouchStart={(e) => onTouch(e, 'down', 1)}
                    onTouchEnd={(e) => onTouch(e, 'up', 1)}
                >
                    B
                </GamepadButton>
                <GamepadButton
                    className="button-a"
                    onTouchStart={(e) => onTouch(e, 'down', 2)}
                    onTouchEnd={(e) => onTouch(e, 'up', 2)}
                >
                    X
                </GamepadButton>
            </div>
        </div>
    );
}
