import {
    appDispatch,
    select_key_gamingKeyboard,
    useAppSelector
} from '@/backend/reducers';
import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './index.scss';
export const GamingKeyboardButton = ({
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

    type = 'circle' //'circle'  - rectangle
}) => {
    const selected = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard.currentSelected
    );
    const [holding, setHolding] = useState(false);
    const buttonRef = useRef(null);
    useEffect(() => {
        if (buttonRef.current != null) {
            buttonRef.current.addEventListener('touchstart', handleTouchStart, {
                passive: false
            });
            buttonRef.current.addEventListener('touchend', handleTouchEnd, {
                passive: false
            });
            buttonRef.current.addEventListener(
                'touchcancel',
                handleTouchCancel,
                { passive: false }
            );
        }
    }, []);

    const handleTouchStart = (e) => {
        e.preventDefault();
        onTouchStart();
        setHolding(true);
    };
    const handleTouchEnd = (e) => {
        e.preventDefault();
        onTouchEnd();
        setHolding(false);
    };
    const handleTouchCancel = (e) => {
        e.preventDefault();
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
