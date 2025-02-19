import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
    appDispatch,
    decrease_key_gamingKeyboard,
    delete_key_gamingKeyboard,
    increase_key_gamingKeyboard,
    move_key_gamingKeyboard,
    save_gamingKeyboard_to_local,
    scancode,
    set_default_gamingKeyboard,
    set_gamingKeyboard_data,
    set_keyboard_edit_state,
    useAppSelector
} from '../../../../backend/reducers';
import { CustomJoyStick } from '../gamepad/button/joystick';
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
    const [deviceResolution, setDeviceResolution] = useState({
        deviceWidth: window.innerWidth,
        deviceHeight: window.innerHeight
    });

    const joystickRef = useRef(null);
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

    const handleDrag = (e, data) => { };

    const handleStop = (e, data) => {
        const id = data.node.id;
        const positionDrag = { x: data.x, y: data.y };

        const posConverted = {
            x: positionDrag.x / deviceResolution.deviceWidth,
            y: positionDrag.y / deviceResolution.deviceHeight
        };

        console.log(positionDrag, 'stop');
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
            if (key.type == 'joystick') {
                return (
                    <Draggable
                        key={key.id}
                        disabled={true}
                        nodeRef={joystickWrapperRef}
                        position={{
                            x: deviceResolution.deviceWidth * key.position.x,
                            y: deviceResolution.deviceHeight * key.position.y
                        }}
                    >
                        <div
                            id={key.id}
                            className="wrapperDraggable"
                            ref={joystickWrapperRef}
                        >
                            <CustomJoyStick
                                ref={joystickRef}
                                draggable={false}
                                size={100}
                                type="right"
                            />
                        </div>
                    </Draggable>
                );
            } else if (key.type == 'key') {
                return (
                    <GamingKeyboardButton
                        id={key.id}
                        key={key.id}
                        onTouchStart={() => {
                            keyboard({
                                action: 'down',
                                val: key.value
                            });
                        }}
                        onTouchEnd={() => {
                            keyboard({
                                action: 'up',
                                val: key.value
                            });
                        }}
                        onStop={handleStop}
                        onDrag={handleDrag}
                        draggable={gamingKeyboard.editState == 'draggable'}
                        style={{
                            width: `${50 * key.size}px`,
                            height: `${50 * key.size}px`
                        }}
                        pos={{
                            x: deviceResolution.deviceWidth * key.position.x,
                            y: deviceResolution.deviceHeight * key.position.y
                        }}
                    >
                        {handleRenderKeyName(key.name)}
                    </GamingKeyboardButton>
                );
            } else if (key.type == 'mouse') {
                const Icon = MouseIcons[key.name];

                return (
                    <GamingKeyboardButton
                        id={key.id}
                        key={key.id}
                        onTouchStart={() => {
                            virtMouse(key.value, 'down');
                        }}
                        onTouchEnd={() => {
                            virtMouse(key.value, 'up');
                        }}
                        onStop={handleStop}
                        onDrag={handleDrag}
                        draggable={gamingKeyboard.editState == 'draggable'}
                        style={{
                            width: `${50 * key.size}px`,
                            height: `${50 * key.size}px`
                        }}
                        pos={{
                            x: deviceResolution.deviceWidth * key.position.x,
                            y: deviceResolution.deviceHeight * key.position.y
                        }}
                    >
                        <Icon fontSize="1.2rem"></Icon>
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
            className={`${true ? 'slide-in' : 'slide-out'
                } navGamingKeyBoardSetting`}
        >
            {/*<div className="wrapperLeft">
				<div className="ctnContent items-center">
					<p className="title">Kích cỡ:</p>

					<div className="btnGroup">
						<button
							onClick={() => {
								appDispatch(decrease_btn_gamepad(selected));
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
								appDispatch(increase_btn_gamepad(selected));
							}}
						>
							<MdAddCircleOutline
								fontSize={'1.4rem'}
								color="#fff"
							/>
						</button>
					</div>
				</div>
			</div>*/}
            {gamingKeyboard.editState == 'draggable' ? (
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
