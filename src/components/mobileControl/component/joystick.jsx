import { Joystick } from 'react-joystick-component/build/lib/Joystick';

export const CustomJoyStick = ({

    draggable,
    className,
    size = 100,
    moveCallback = () => { }
    , ...rest }) => {

    const move = (event) => {
        if (draggable === 'draggable') return

        if (event.type == "move") {
            //if (!enableJT) {
            //    moveCallback(0, 0);
            //    return;
            //}
            moveCallback(event.x, -event.y);
        } else if (event.type == "stop") {
            //setenableJT(false);
            moveCallback(0, 0);
        } else if (event.type == "start") {
            //setenableJT(true);
            moveCallback(0, 0);

        }
    };
    return (
        <div className={className}>
            <Joystick
                start={move}
                stop={move}
                move={move}
                size={size}
                baseColor="rgba(0, 0, 0, 0.2)"
                stickColor="rgba(255, 255, 255,0.5"
                disabled={draggable === 'draggable'}
                {...rest}
            />
        </div>
    );
};
