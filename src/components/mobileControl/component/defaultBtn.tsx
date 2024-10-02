import { useCallback, useRef } from 'react';

const GamepadButton = ({
    style,
    children,
    color = '#007bff',
    onTouchStart,
    onTouchEnd,
    className
}) => {
    const buttonRef = useRef(null);
    const touchIdRef = useRef(null);

    const handleTouchStart = useCallback(
        (e) => {
            e.preventDefault();
            onTouchStart();
            return;
            if (touchIdRef.current === null) {
                touchIdRef.current = e.touches[0].identifier;
                onTouchStart();
            }
        },
        [onTouchStart]
    );

    const handleTouchEnd = useCallback(
        (e) => {
            e.preventDefault();
            onTouchEnd();
            return;
            if (touchIdRef.current !== null) {
                touchIdRef.current = null;
                onTouchEnd();
            }
        },
        [onTouchEnd]
    );

    const handleTouchCancel = useCallback(
        (e) => {
            e.preventDefault();
            onTouchEnd();
            return;
            if (touchIdRef.current !== null) {
                touchIdRef.current = null;
                onTouchEnd();
            }
        },
        [onTouchEnd]
    );

    return (
        <div
            ref={buttonRef}
            className={`${className} defaultButton`}
            onPointerDown={handleTouchStart}
            onPointerUp={handleTouchEnd}
            onPointerCancel={handleTouchCancel}
            style={style}
        >
            {children}
        </div>
    );
};

export default GamepadButton;
