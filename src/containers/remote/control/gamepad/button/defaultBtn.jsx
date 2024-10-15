import { useCallback, useRef } from 'react';

const GamepadButton = ({
    style,
    children,
    onTouchStart,
    onTouchEnd,
    className
}) => {
    const buttonRef = useRef(null);

    const handleTouchStart = useCallback(onTouchStart, [onTouchStart]);
    const handleTouchEnd = useCallback(onTouchEnd, [onTouchEnd]);
    const handleTouchCancel = useCallback(onTouchEnd, [onTouchEnd]);

    return (
        <div
            ref={buttonRef}
            className={`${className} defaultButton`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            style={style}
        >
            {children}
        </div>
    );
};

export default GamepadButton;
