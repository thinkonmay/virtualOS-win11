import { useCallback, useRef, useState } from 'react';
import Draggable from 'react-draggable';
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
    const [holding, setHolding] = useState(false);
    const buttonRef = useRef(null);

    const handleTouchStart = useCallback(() => {
        onTouchStart();
        setHolding(true);
    }, [onTouchStart, holding]);
    const handleTouchEnd = useCallback(() => {
        onTouchEnd();
        setHolding(false);
    }, [onTouchEnd, holding]);
    const handleTouchCancel = useCallback(() => {
        onTouchEnd();
        setHolding(false);
    }, [onTouchEnd, holding]);
    `
    
`;
    return (
        <Draggable
            disabled={!draggable}
            position={{ x: pos?.x, y: pos?.y }}
            onStop={onStop}
            onDrag={onDrag}
            nodeRef={buttonRef}
        >
            <div ref={buttonRef} className="wrapperDraggable" id={id}>
                <div
                    //id={id}
                    //ref={buttonRef}
                    className={`${className} defaultButton ${type} ${
                        holding ? 'hold' : ''
                    }`}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    style={style}
                >
                    {children}
                </div>
            </div>
        </Draggable>
    );
};

export default GamepadButton;
