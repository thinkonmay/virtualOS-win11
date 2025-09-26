import { gamepadButton } from '#/singleton';
import { MdOutlineArrowDropUp } from 'react-icons/md';
import './index.scss';
import { useEffect, useRef } from 'react';

const DPad = (props) => {
    const top = useRef(null);
    const bottom = useRef(null);
    const right = useRef(null);
    const left = useRef(null);

    useEffect(() => {
        if (top.current != null) {
            top.current.addEventListener(
                'touchstart',
                gamepadButton(12, true),
                { passive: false }
            );
            top.current.addEventListener('touchend', gamepadButton(12), {
                passive: false
            });
        }
        if (right.current != null) {
            right.current.addEventListener(
                'touchstart',
                gamepadButton(15, true),
                { passive: false }
            );
            right.current.addEventListener('touchend', gamepadButton(15), {
                passive: false
            });
        }
        if (left.current != null) {
            left.current.addEventListener(
                'touchstart',
                gamepadButton(14, true),
                { passive: false }
            );
            left.current.addEventListener('touchend', gamepadButton(14), {
                passive: false
            });
        }
        if (bottom.current != null) {
            bottom.current.addEventListener(
                'touchstart',
                gamepadButton(13, true),
                { passive: false }
            );
            bottom.current.addEventListener('touchend', gamepadButton(13), {
                passive: false
            });
        }
    }, []);

    const { size, ...rest } = props;
    return (
        <div
            className="dpad"
            style={{ width: `${props.size}px`, height: `${props.size}px` }}
            {...rest}
        >
            <button
                ref={top}
                className="dpadBtn top"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
            >
                <MdOutlineArrowDropUp
                    sx={{ color: '#C3B5B5', fontSize: '12px' }}
                />
            </button>
            <button
                ref={bottom}
                className="dpadBtn bottom"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                ref={right}
                className="dpadBtn right"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
            <button
                ref={left}
                className="dpadBtn left"
                style={{
                    width: `${props.size}px`,
                    height: `${props.size * 1.5}px`
                }}
            >
                <MdOutlineArrowDropUp sx={{ color: '#C3B5B5' }} />
            </button>
        </div>
    );
};

export default DPad;
