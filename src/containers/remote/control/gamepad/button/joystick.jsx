import { forwardRef, useCallback, useId, useState } from 'react';

export const CustomJoyStick = forwardRef((props, ref) => {
    const { size = 100, moveCallback = () => {} } = props;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [touching, setTouching] = useState(false);
    const knobRadius = size * 0.2;

    const id = useId();
    const knobId = useId();
    const updatePosition = useCallback(
        (touch) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                let x = touch.clientX - rect.left - centerX;
                let y = touch.clientY - rect.top - centerY;

                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = size / 2 - knobRadius;

                if (distance > maxDistance) {
                    const scale = maxDistance / distance;
                    x *= scale;
                    y *= scale;
                }

                const normalizedX = x / maxDistance;
                const normalizedY = y / maxDistance;

                setPosition({ x, y });
                moveCallback(normalizedX, normalizedY);
            }
        },
        [knobRadius, moveCallback]
    );

    const handlePointerDown = (e) => {
        e.target.setPointerCapture(e.pointerId);
        setTouching(true);
        updatePosition(e);
    };

    const handlePointerMove = (e) => {
        if (touching) {
            updatePosition(e);
        }
    };

    const handlePointerUp = () => {
        setTouching(false);
        setPosition({ x: 0, y: 0 });
        moveCallback({ x: 0, y: 0, id });
    };

    return (
        <div
            ref={ref}
            className="joystick"
            id={id}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                touchAction: 'none',
                position: 'relative'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <div
                id={knobId}
                style={{
                    width: `${knobRadius * 1.5}px`,
                    height: `${knobRadius * 1.5}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255,0.5',
                    position: 'absolute',
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 4px 5px',
                    transition: touching ? 'none' : 'transform 0.1s ease-out'
                }}
            />
        </div>
    );
});
