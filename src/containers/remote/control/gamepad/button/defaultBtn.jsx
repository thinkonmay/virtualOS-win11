import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
    appDispatch,
    select_btn_gamepad,
    useAppSelector
} from '../../../../../backend/reducers';
import './index.scss';
const GamepadButton = ({
    style,
    children,
    onTouchStart,
    onTouchEnd,
    className,
    id,
    pos,
    draggable,
    onStop = () => {},
    onDrag = () => {},
    posX,
    posY,
    type = 'circle' //'circle'  - rectangle
}) => {
    const selected = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.currentSelected
    );
    const [holding, setHolding] = useState(false);
    const buttonRef = useRef(null);

    const handleTouchStart = (e) => {
        onTouchStart(e);
        setHolding(true);
    };
    const handleTouchEnd = (e) => {
        onTouchEnd(e);
        setHolding(false);
    };
    const handleTouchCancel = (e) => {
        onTouchEnd(e);
        setHolding(false);
    };

    const handleSelectedBtn = (key) => {
        appDispatch(select_btn_gamepad(key));
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
                className={`wrapperDraggable ${
                    selected == id && draggable ? 'selected' : ''
                }`}
                id={id}
            >
                <div
                    id={id}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    className={`${className} defaultButton ${type} ${
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
