import { useEffect, memo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
    appDispatch,
    decrease_key_gamingKeyboard,
    delete_key_gamingKeyboard,
    hide_gaming_keyboard,
    increase_key_gamingKeyboard,
    move_key_gamingKeyboard,
    save_gamingKeyboard_to_local,
    scancode,
    set_default_gamingKeyboard,
    set_gamingKeyboard_data,
    set_keyboard_edit_state,
    useAppSelector
} from '../../../../backend/reducers';
import { GamingKeyboardButton } from './components/button';

import {
    MdAddCircleOutline,
    MdOutlineArrowBack,
    MdOutlineArrowDownward,
    MdOutlineArrowForward,
    MdOutlineArrowUpward,
    MdOutlineRemoveCircleOutline
} from 'react-icons/md';
import { PiMouseLeftClickFill, PiMouseRightClickFill } from 'react-icons/pi';
import { keyboard, virtMouse } from '../../../../../src-tauri/singleton';
import { localStorageKey } from '../../../../backend/utils/constant';
import { KeyboardPicker } from './components/keyboardPicker';

const MouseIcons = {
    PiMouseRightClickFill: PiMouseRightClickFill,
    PiMouseLeftClickFill: PiMouseLeftClickFill
};

function GamingKeyboard() {
    const gamingKeyboard = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard
    );
    const draggable = useAppSelector(
        (state) =>
            state.sidepane.mobileControl.gamingKeyBoard.editState == 'draggable'
    );
    const [deviceResolution, setDeviceResolution] = useState({
        deviceWidth: window.innerWidth,
        deviceHeight: window.innerHeight
    });

    const joystickWrapperRef = useRef(null);
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const gamingKeyboardData = localStorage.getItem(
            localStorageKey.gamingKeyboardData
        );
        if (gamingKeyboardData != null || gamingKeyboardData != undefined)
            appDispatch(set_gamingKeyboard_data(gamingKeyboardData));
    }, []);
    const handleResize = () => {
        setDeviceResolution({
            deviceWidth: window.innerWidth,
            deviceHeight: window.innerHeight
        });
    };

    const handleDrag = (e, data) => {};

    const handleStop = (e, data) => {
        const id = data.node.id;
        const positionDrag = { x: data.x, y: data.y };

        const posConverted = {
            x: positionDrag.x / deviceResolution.deviceWidth,
            y: positionDrag.y / deviceResolution.deviceHeight
        };

        appDispatch(
            move_key_gamingKeyboard({
                id,
                position: posConverted
            })
        );
    };

    const handleRenderKeyName = (name) => {
        let convertedName = name;
        switch (name.toLowerCase()) {
            case 'backspace':
                convertedName = 'Back';
                break;

            case 'capslock':
                convertedName = 'Cap';
                break;
            case 'escape':
                convertedName = 'Esc';
                break;

            case 'control':
                convertedName = 'Ctrl';
                break;

            case 'up':
                convertedName = <MdOutlineArrowUpward />;
                break;

            case 'down':
                convertedName = <MdOutlineArrowDownward />;
                break;
            case 'left':
                convertedName = <MdOutlineArrowBack />;
                break;
            case 'right':
                convertedName = <MdOutlineArrowForward />;
                break;

            default:
                convertedName = name;
                break;
        }

        return convertedName;
    };

    const renderKeys = () => {
        return gamingKeyboard.data.map((key) => {
            switch (key.type) {
                case 'joystick':
                    return (
                        <div className="fixed">
                            <Draggable
                                key={key.id}
                                disabled={true}
                                nodeRef={joystickWrapperRef}
                                position={{
                                    x:
                                        deviceResolution.deviceWidth *
                                        key.position.x,
                                    y:
                                        deviceResolution.deviceHeight *
                                        key.position.y
                                }}
                            >
                                <div
                                    id={key.id}
                                    className="wrapperDraggable"
                                    ref={joystickWrapperRef}
                                >
                                    <VirtualASDW keycallback={console.log} />
                                </div>
                            </Draggable>
                        </div>
                    );
                case 'key':
                    return (
                        <GamingKeyboardButton
                            id={key.id}
                            key={key.id}
                            onTouchStart={() =>
                                draggable
                                    ? null
                                    : keyboard({
                                          val: key.value,
                                          isDown: true
                                      })
                            }
                            onTouchEnd={() =>
                                draggable
                                    ? null
                                    : keyboard({
                                          val: key.value
                                      })
                            }
                            onStop={handleStop}
                            onDrag={handleDrag}
                            draggable={draggable}
                            style={{
                                width: `${50 * key.size}px`,
                                height: `${50 * key.size}px`
                            }}
                            pos={{
                                x:
                                    deviceResolution.deviceWidth *
                                    key.position.x,
                                y:
                                    deviceResolution.deviceHeight *
                                    key.position.y
                            }}
                        >
                            {handleRenderKeyName(key.name)}
                        </GamingKeyboardButton>
                    );
                case 'mouse':
                    const Icon = MouseIcons[key.name];
                    return (
                        <GamingKeyboardButton
                            id={key.id}
                            key={key.id}
                            onTouchStart={() =>
                                draggable ? null : virtMouse(key.value, true)
                            }
                            onTouchEnd={() =>
                                draggable ? null : virtMouse(key.value)
                            }
                            onStop={handleStop}
                            onDrag={handleDrag}
                            draggable={draggable}
                            style={{
                                width: `${50 * key.size}px`,
                                height: `${50 * key.size}px`
                            }}
                            pos={{
                                x:
                                    deviceResolution.deviceWidth *
                                    key.position.x,
                                y:
                                    deviceResolution.deviceHeight *
                                    key.position.y
                            }}
                        >
                            <Icon fontSize="1.2rem"></Icon>
                        </GamingKeyboardButton>
                    );
                case 'close':
                    return (
                        <GamingKeyboardButton
                            id={key.id}
                            key={key.id}
                            onTouchStart={() => {}}
                            onTouchEnd={() =>
                                draggable
                                    ? null
                                    : appDispatch(hide_gaming_keyboard())
                            }
                            onStop={handleStop}
                            onDrag={handleDrag}
                            draggable={draggable}
                            className='text-yellow-600'
                            style={{
                                width: `${60 * key.size}px`,
                                height: `${40 * key.size}px`
                            }}
                            pos={{
                                x:
                                    deviceResolution.deviceWidth *
                                    key.position.x,
                                y:
                                    deviceResolution.deviceHeight *
                                    key.position.y
                            }}
                        >
                            close
                        </GamingKeyboardButton>
                    );
            }
        });
    };
    return (
        <>
            {gamingKeyboard.editState != 'idle' ? <NavSettings /> : null}
            {renderKeys()}
            <KeyboardPicker />
        </>
    );
}

export default GamingKeyboard;

const NavSettings = () => {
    const gamingKeyboard = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard
    );

    return (
        <div
            className={`${
                true ? 'slide-in' : 'slide-out'
            } navGamingKeyBoardSetting`}
        >
            {draggable ? (
                <NavDraggable />
            ) : gamingKeyboard.editState == 'addingKey' ? (
                <NavAddingKey />
            ) : null}
        </div>
    );
};

const NavDraggable = () => {
    const selected = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard.currentSelected
    );

    const text = selected ? Math.round(selected.size * 50) : 0;

    const handleAddKey = () => {
        appDispatch(set_keyboard_edit_state('addingKey'));
    };

    const handleRemoveKey = () => {
        appDispatch(delete_key_gamingKeyboard());
    };

    const handleFinish = () => {
        appDispatch(set_keyboard_edit_state('idle'));
        appDispatch(save_gamingKeyboard_to_local());
        appDispatch(scancode(true));
    };

    return (
        <div className="flex-1 flex justify-between ml-2">
            <div className="ctnBtns ">
                {selected ? (
                    <div className="ctnContent items-center">
                        <p className="title">Kích cỡ:</p>

                        <div className="btnGroup">
                            <button
                                onClick={() => {
                                    appDispatch(decrease_key_gamingKeyboard());
                                }}
                            >
                                <MdOutlineRemoveCircleOutline
                                    fontSize={'1.4rem'}
                                    color="#fff"
                                />
                            </button>

                            <p className="px-2 py-1 bg-blue-600 rounded-md">
                                {text}%
                            </p>

                            <button
                                onClick={() => {
                                    appDispatch(increase_key_gamingKeyboard());
                                }}
                            >
                                <MdAddCircleOutline
                                    fontSize={'1.4rem'}
                                    color="#fff"
                                />
                            </button>
                        </div>
                    </div>
                ) : null}
                {selected?.id && selected.type == 'key' ? (
                    <button
                        onClick={handleRemoveKey}
                        className="instbtn hover:bg-orange-500 bg-orange-600"
                    >
                        Xoá
                    </button>
                ) : null}

                <button
                    onClick={handleAddKey}
                    className="instbtn bg-[#AD00FF] hover:bg-purple-500"
                >
                    Thêm Nút
                </button>
            </div>

            {!selected ? (
                <div>
                    <p className="font-[8px] bg-slate-900 rounded-md p-2 text-gray-100">
                        Chọn phím để chỉnh sửa!
                    </p>
                </div>
            ) : null}
            <div className="ctnBtns ">
                <button
                    onClick={() => {
                        appDispatch(set_default_gamingKeyboard());
                    }}
                    className="instbtn hover:bg-green-600 bg-green-700"
                >
                    Về mặc định
                </button>
                <button onClick={handleFinish} className="instbtn">
                    Xong
                </button>
            </div>
        </div>
    );
};

const NavAddingKey = () => {
    const handleFinish = () => {
        appDispatch(set_keyboard_edit_state('draggable'));
    };
    return (
        <>
            <div className="ctnBtns flex-1 ">
                <button onClick={handleFinish} className="instbtn">
                    Đóng
                </button>
                <div className="mx-auto">
                    <p className="font-[8px] bg-slate-900 rounded-md p-2 text-gray-100">
                        Chọn phím để thêm!
                    </p>
                </div>
            </div>
        </>
    );
};

const VirtualASDW = memo(({ size = 100, keycallback }) => {
    const id = useId();
    const ref = useRef(null);
    const knobRef = useRef(null);
    const [currentKey, setCurrentKey] = useState(null);

    const handlePointerMove = (event) => {
        event.preventDefault();
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

        knobRef.current.style.transform = `translate(${x}px, ${y}px)`;

        const ratio = x / y;
        console.log(`${ratio} ${x >= 0}`);
    };

    const handlePointerUp = (e) => {
        e.preventDefault();
        knobRef.current.style.transform = 'translate(0px, 0px)';
        if (currentKey != null) {
            keycallback(currentKey);
            setCurrentKey(null);
        }
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
