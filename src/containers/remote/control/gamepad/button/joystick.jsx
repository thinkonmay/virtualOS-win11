import { forwardRef, useEffect, useId, useState, useTransition } from 'react';
import { gamepadAxis } from '../../../../../../src-tauri/singleton';

export const CustomJoyStick = forwardRef((props, ref) => {
    const { size = 100, type = 'right', } = props;
    const [isPending, startTransition] = useTransition()

    console.log('render joystick');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [touching, setTouching] = useState(false);
    const knobRadius = size * 0.2;
    const speed = 0.5
    const id = useId();
    const knobId = useId();
    //const updatePosition = useCallback(
    //    (touch) => {

    //    },
    //    [type]
    //);
    const updatePosition = (touch) => {
        startTransition(() => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                let x_speed = (touch.clientX - rect.left - centerX) * speed;
                let y_speed = (touch.clientY - rect.top - centerY) * speed;

                let x = (touch.clientX - rect.left - centerX);
                let y = (touch.clientY - rect.top - centerY);

                const distance = Math.sqrt(x_speed * x_speed + y_speed * y_speed);
                const maxDistance = size / 2;
                //const maxDistance = size / 2 - knobRadius;

                if (distance > maxDistance) {
                    const scale = maxDistance / distance;
                    x_speed *= scale;
                    y_speed *= scale;
                }

                const normalizedX = x / maxDistance;
                const normalizedY = y / maxDistance;


                setPosition({ x: x_speed, y: y_speed })
                gamepadAxis(normalizedX, normalizedY, type)

            }
        })
    }

    useEffect(() => {
        const buttonElement = ref.current
        if (buttonElement) {
            buttonElement.addEventListener('pointerdown', handlePointerDown)
            buttonElement.addEventListener('pointermove', handlePointerMove)
            buttonElement.addEventListener('pointerup', handlePointerUp)

        }
        return (() => {
            buttonElement.removeEventListener('pointerdown', handlePointerDown)
            buttonElement.removeEventListener('pointermove', handlePointerMove)
            buttonElement.removeEventListener('pointerup', handlePointerUp)

        })
    }, [type, ref])
    const handlePointerDown = (e) => {
        e.target.setPointerCapture(e.pointerId);
        console.log('touch start');
        setTouching(true);
        //updatePosition(e);
    };

    const handlePointerMove = (e) => {
        console.log('move');
        updatePosition(e);

        if (touching) {
        }
    };

    const handlePointerUp = () => {
        setTouching(false);
        setPosition({ x: 0, y: 0 });
        gamepadAxis(0, 0, type)
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
        //onPointerDown={handlePointerDown}
        //onPointerMove={handlePointerMove}
        //onPointerUp={handlePointerUp}
        //onPointerCancel={handlePointerUp}
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
                    transition: touching ? 'none' : 'transform 0.05s ease-out'
                }}
            />
        </div>
    );
});
