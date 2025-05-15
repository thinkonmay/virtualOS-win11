import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
    appDispatch,
    select_key_gamingKeyboard,
    useAppSelector
} from '../../../../../backend/reducers';
import './index.scss';
export const GamingKeyboardButton = ({
    style,
    children,
    onTouchStart,
    onTouchEnd,
    className,
    id,
    value,
    pos,
    draggable,
    onStop = () => {},
    onDrag = () => {},

    type = 'circle' //'circle'  - rectangle
}) => {
    const selected = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard.currentSelected
    );
    const [holding, setHolding] = useState(false);
    const buttonRef = useRef(null);
    const buttonChildRef = useRef(null);

    const handleTouchStart = (e) => {
        onTouchStart();
        setHolding(true);
    };
    const handleTouchEnd = (e) => {
        onTouchEnd();
        setHolding(false);
    };
    const handleTouchCancel = (e) => {
        onTouchEnd();
        setHolding(false);
    };

    const handleSelectedBtn = (key) => {
        appDispatch(select_key_gamingKeyboard(key));
    };
    return (
        <Draggable
            disabled={!draggable}
            position={{ x: pos?.x, y: pos?.y }}
            onStop={onStop}
            onDrag={onDrag}
            onMouseDown={() => {
                draggable ? handleSelectedBtn(id) : null;
            }}
            nodeRef={buttonRef}
        >
            <div
                ref={buttonRef}
                className={`wrapperGamingKeyDraggable ${
                    selected?.id == id && draggable ? 'selected' : ''
                }`}
                id={id}
            >
                <div
                    id={id}
                    //ref={buttonRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    ref={buttonChildRef}
                    className={`${className} defaultGamingKeyButton ${type} ${
                        holding ? 'hold' : ''
                    }`}
                    style={style}
                >
                    {children}
                </div>
            </div>
        </Draggable>
    );
};

export default GamepadButton;
