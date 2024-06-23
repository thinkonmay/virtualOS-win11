import { Joystick } from 'react-joystick-component/build/lib/Joystick';

export const CustomJoyStick = ({ draggable, className, size = 100, ...rest }) => {
    return (
        <div className={className}>
            <Joystick
                size={size}
                baseColor="rgba(0, 0, 0, 0.2)"
                stickColor="rgba(255, 255, 255,0.5"
                disabled={draggable === 'draggable'}
                {...rest}
            />
        </div>
    );
};
