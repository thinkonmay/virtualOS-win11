//export const CustomJoyStick = ({
//    draggable,
//    className,
//    size = 100,
//    moveCallback = () => {},
//    ...rest
//}) => {
//    const move = (event) => {
//        if (draggable === 'draggable') return;

import { forwardRef, useCallback, useId, useState } from 'react';

//        if (event.type == 'move') {
//            //if (!enableJT) {
//            //    moveCallback(0, 0);
//            //    return;
//            //}
//            moveCallback(event.x, -event.y);
//        } else if (event.type == 'stop') {
//            //setenableJT(false);
//            moveCallback(0, 0);
//        } else if (event.type == 'start') {
//            //setenableJT(true);
//            moveCallback(0, 0);
//        }
//    };
//    return (
//        <div className={className}>
//<Joystick
//                start={move}
//                stop={move}
//                move={move}
//                size={size}
//                baseColor="rgba(0, 0, 0, 0.2)"
//                stickColor="rgba(255, 255, 255,0.5"
//                disabled={draggable === 'draggable'}
//                {...rest}
//            />
//        </div>
//    );
//};

//export const CustomJoyStick = ({
//    draggable,
//    className,
//    size = 100,
//    moveCallback = () => { },
//    ...rest
//}) => {
//    const move = (event) => {
//        if (draggable === 'draggable') return;

//        if (event.type == 'move') {
//            //if (!enableJT) {
//            //    moveCallback(0, 0);
//            //    return;
//            //}
//            moveCallback(event.x, -event.y);
//        } else if (event.type == 'stop') {
//            //setenableJT(false);
//            moveCallback(0, 0);
//        } else if (event.type == 'start') {
//            //setenableJT(true);
//            moveCallback(0, 0);
//        }
//    };
//    return (
//        <div className={className}>
//            <Joystick
//                start={move}
//                stop={move}
//                move={move}
//                size={size}
//                baseColor="rgba(0, 0, 0, 0.2)"
//                stickColor="rgba(255, 255, 255,0.5"
//                disabled={draggable === 'draggable'}
//                {...rest}
//            />
//        </div>
//    );
//};

export const CustomJoyStick = forwardRef((props, ref) => {
    const { size = 100, moveCallback = () => {} } = props;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [touching, setTouching] = useState(false);
    //const ref = useRef(null);
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
                //backgroundColor: '#f0f0f0',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
                //className="joystick-knob"
                id={knobId}
                style={{
                    width: `${knobRadius * 2}px`,
                    height: `${knobRadius * 2}px`,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255,0.5',
                    position: 'absolute',
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: touching ? 'none' : 'transform 0.1s ease-out'
                }}
            />
        </div>
    );
});
