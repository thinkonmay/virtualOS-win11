import { memo, useId, useRef, useState } from 'react';
import { gamepadAxis } from '../../../../../../src-tauri/singleton';

const speed = 0.48;
const knobRadius = 0.3;

export const CustomJoyStick = memo(({ size = 100, isRight = true }) => {
    const id = useId();
    const ref = useRef(null);
    const knobRef = useRef(null);

    const updatePosition = (event) => {
        const touch = event.changedTouches?.[0];
        const rect = ref.current.getBoundingClientRect();
        let x = (touch.clientX - rect.left - rect.width / 2) * speed;
        let y = (touch.clientY - rect.top - rect.height / 2) * speed;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = size / 2;
        if (distance > maxDistance) {
            const scale = maxDistance / distance;
            x *= scale;
            y *= scale;
        }

        const normalizedX = x / maxDistance;
        const normalizedY = y / maxDistance;

        gamepadAxis(normalizedX, normalizedY, isRight);
        knobRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handlePointerMove = (e) => updatePosition(e);

    const handlePointerUp = async () => {
        knobRef.current.style.transform = 'translate(0px, 0px)';
        gamepadAxis(0, 0, isRight);
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
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            onTouchCancel={handlePointerUp}
        >
            <div
                ref={knobRef}
                style={{
                    width: `${knobRadius * size}px`,
                    height: `${knobRadius * size}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255,0.5',
                    position: 'absolute',
                    boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 4px 5px',
                    transition: 'none'
                }}
            />
        </div>
    );
});
