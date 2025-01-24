import React, { forwardRef, useId, useRef, useState } from 'react';
import { gamepadAxis } from '../../../../../../src-tauri/singleton';

export const CustomJoyStick = React.memo(
    forwardRef((props, ref) => {
        const { size = 100, type = 'right' } = props;

        const knobRef = useRef(null);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [touching, setTouching] = useState(false);
        const knobRadius = size * 0.2;
        const speed = 0.48;
        const id = useId();
        const knobId = useId();

        const updatePosition = (touch) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                let x = (touch.clientX - rect.left - centerX) * speed;
                let y = (touch.clientY - rect.top - centerY) * speed;

                //let x = (touch.clientX - rect.left - centerX);
                //let y = (touch.clientY - rect.top - centerY);

                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = size / 2;
                //const maxDistance = size / 2 - knobRadius;

                if (distance > maxDistance) {
                    const scale = maxDistance / distance;
                    x *= scale;
                    y *= scale;
                }

                const normalizedX = x / maxDistance;
                const normalizedY = y / maxDistance;

                //transform: `translate(${position.x}px, ${position.y}px)`,

                //setPosition({ x: x_speed, y: y_speed })

                knobRef.current.style.transform = `translate(${x}px, ${y}px)`;

                throttle(gamepadAxis(normalizedX, normalizedY, type), 0.5);
            }
        };

        const handlePointerDown = (e) => {
            e.target.setPointerCapture(e.pointerId);
            setTouching(true);
        };

        const handlePointerMove = (e) => {
            if (touching) {
                updatePosition(e);
            }
        };

        const handlePointerUp = () => {
            setTouching(false);
            knobRef.current.style.transform = 'translate(0px, 0px)';
            gamepadAxis(0, 0, type);
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
                    ref={knobRef}
                    style={{
                        width: `${knobRadius * 1.5}px`,
                        height: `${knobRadius * 1.5}px`,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255,0.5',
                        position: 'absolute',
                        //transform: `translate(${position.x}px, ${position.y}px)`,
                        boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 4px 5px',
                        transition: touching
                            ? 'none'
                            : 'transform 0.05s ease-out'
                    }}
                />
            </div>
        );
    })
);

function throttle(func, delay) {
    let lastCall = 0;

    return function (...args) {
        const now = new Date().getTime();

        if (now - lastCall < delay) {
            return;
        }

        lastCall = now;
        return func(...args);
    };
}
