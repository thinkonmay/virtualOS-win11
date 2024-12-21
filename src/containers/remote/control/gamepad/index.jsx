import { useEffect, useRef, useState, useTransition } from 'react';
import Draggable from 'react-draggable'; // Both at the same time
import {
    MdAddCircleOutline,
    MdArrowLeft,
    MdArrowRight,
    MdOutlineRemoveCircleOutline
} from 'react-icons/md';
import { gamepadAxis, gamepadButton } from '../../../../../src-tauri/singleton';
import {
    appDispatch,
    decrease_btn_gamepad,
    increase_btn_gamepad,
    select_btn_gamepad,
    toggle_default_gamepad_position,
    toggle_gamepad_draggable,
    useAppSelector
} from '../../../../backend/reducers';
import GamepadButton from './button/defaultBtn';
import DPad from './button/dpad';
import './button/index.scss'; // Import your SCSS file
import { CustomJoyStick } from './button/joystick';

const BUTTON_SIZE = 55;
const JOYSTICK_SIZE = 100;

export const VirtualGamepad = (props) => {
    const draggable = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.draggable
    );

    return (
        <>
            <div
                className={`virtGamepad slide-in  ${
                    draggable ? 'draggable' : ''
                }`}
            >
                <NavSettings show={draggable} />
                <ButtonGroupRight draggable={draggable} />
                <ButtonGroupLeft draggable={draggable} />
            </div>
        </>
    );
};

const defaultButtonGroupRightValue = {
    rightJt: { x: 0.6, y: 0.35 },
    rs: { x: 0.65, y: 0.8 },
    rb: { x: 0.8, y: 0.28 },
    rt: { x: 0.75, y: 0.12 },
    btnY: { x: 0.77, y: 0.78 },
    btnA: { x: 0.8, y: 0.59 },
    btnB: { x: 0.9, y: 0.52 },
    btnX: { x: 0.89, y: 0.74 },
    ybxa: { x: 0.93, y: 0.45 },
    subBtn: { x: 0.45, y: 0.03 }
};

export const ButtonGroupRight = (props) => {
    const btnSize = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSize
    );
    const btnSizes = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSizes
    );

    const [isPending, startTransition] = useTransition();
    const DefaultPosition = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.isDefaultPos
    );

    const [posBtn, setPosBtn] = useState(defaultButtonGroupRightValue);

    useEffect(() => {
        localStorage.removeItem('right_group_pos2');
    }, []);

    const handleResize = () => {
        let cache = localStorage.getItem(`right_group_pos3`);
        if (cache === null) {
            const deviceWidth = window.innerWidth;
            const deviceHeight = window.innerHeight;
            setPosBtn({
                ybxa: {
                    x: deviceWidth * defaultButtonGroupRightValue.ybxa.x,
                    y: deviceHeight * defaultButtonGroupRightValue.ybxa.y
                },
                rightJt: {
                    x: deviceWidth * defaultButtonGroupRightValue.rightJt.x,
                    y: deviceHeight * defaultButtonGroupRightValue.rightJt.y
                },
                subBtn: {
                    x: deviceWidth * defaultButtonGroupRightValue.subBtn.x,
                    y: deviceHeight * defaultButtonGroupRightValue.subBtn.y
                },
                rs: {
                    x: deviceWidth * defaultButtonGroupRightValue.rs.x,
                    y: deviceHeight * defaultButtonGroupRightValue.rs.y
                },
                rt: {
                    x: deviceWidth * defaultButtonGroupRightValue.rt.x,
                    y: deviceHeight * defaultButtonGroupRightValue.rt.y
                },
                rb: {
                    x: deviceWidth * defaultButtonGroupRightValue.rb.x,
                    y: deviceHeight * defaultButtonGroupRightValue.rb.y
                },
                btnY: {
                    x: deviceWidth * defaultButtonGroupRightValue.btnY.x,
                    y: deviceHeight * defaultButtonGroupRightValue.btnY.y
                },
                btnB: {
                    x: deviceWidth * defaultButtonGroupRightValue.btnB.x,
                    y: deviceHeight * defaultButtonGroupRightValue.btnB.y
                },
                btnX: {
                    x: deviceWidth * defaultButtonGroupRightValue.btnX.x,
                    y: deviceHeight * defaultButtonGroupRightValue.btnX.y
                },
                btnA: {
                    x: deviceWidth * defaultButtonGroupRightValue.btnA.x,
                    y: deviceHeight * defaultButtonGroupRightValue.btnA.y
                }
            });
            return;
        }
        const {
            ybxa,
            rightJt,
            funcBtn,
            subBtn,
            rs,
            rt,
            rb,
            btnA,
            btnB,
            btnY,
            btnX
        } = JSON.parse(cache);

        setPosBtn({
            ybxa,
            rightJt,
            funcBtn,
            subBtn,
            rs,
            rt,
            rb,
            btnA,
            btnB,
            btnY,
            btnX
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDrag = (e, data) => {
        const key = data.node.id;
        const value = { x: data.x, y: data.y };
        e, data;
        startTransition(() => {
            setPosBtn((prev) => {
                return {
                    ...prev,
                    [key]: value
                };
            });
        });
    };

    const handleStop = (e, data) => {
        startTransition(() => {
            localStorage.setItem(`right_group_pos3`, JSON.stringify(posBtn));
        });
    };

    useEffect(() => {
        if (!DefaultPosition) return;

        const deviceWidth = window.innerWidth;
        const deviceHeight = window.innerHeight;
        const defaultPos = {
            ybxa: {
                x: deviceWidth * defaultButtonGroupRightValue.ybxa.x,
                y: deviceHeight * defaultButtonGroupRightValue.ybxa.y
            },
            rightJt: {
                x: deviceWidth * defaultButtonGroupRightValue.rightJt.x,
                y: deviceHeight * defaultButtonGroupRightValue.rightJt.y
            },

            subBtn: {
                x: deviceWidth * defaultButtonGroupRightValue.subBtn.x,
                y: deviceHeight * defaultButtonGroupRightValue.subBtn.y
            },
            rs: {
                x: deviceWidth * defaultButtonGroupRightValue.rs.x,
                y: deviceHeight * defaultButtonGroupRightValue.rs.y
            },
            rt: {
                x: deviceWidth * defaultButtonGroupRightValue.rt.x,
                y: deviceHeight * defaultButtonGroupRightValue.rt.y
            },
            rb: {
                x: deviceWidth * defaultButtonGroupRightValue.rb.x,
                y: deviceHeight * defaultButtonGroupRightValue.rb.y
            },
            btnA: {
                x: deviceWidth * defaultButtonGroupRightValue.btnA.x,
                y: deviceHeight * defaultButtonGroupRightValue.btnA.y
            },
            btnB: {
                x: deviceWidth * defaultButtonGroupRightValue.btnB.x,
                y: deviceHeight * defaultButtonGroupRightValue.btnB.y
            },
            btnX: {
                x: deviceWidth * defaultButtonGroupRightValue.btnX.x,
                y: deviceHeight * defaultButtonGroupRightValue.btnX.y
            },
            btnY: {
                x: deviceWidth * defaultButtonGroupRightValue.btnY.x,
                y: deviceHeight * defaultButtonGroupRightValue.btnY.y
            }
        };
        setPosBtn(defaultPos);
        localStorage.setItem(`right_group_pos3`, JSON.stringify(defaultPos));
    }, [DefaultPosition]);

    const joystickRef = useRef(null);
    const joystickWrapperRef = useRef(null);
    const subBtnRef = useRef(null);

    const gamepadCallBack = (x, y) => gamepadAxis(x, y, 'right');
    return (
        <>
            <GamepadButton
                id={'rt'}
                onTouchStart={() => gamepadButton(7, 'down')}
                onTouchEnd={() => gamepadButton(7, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.rt.x,
                    y: posBtn.rt.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.rt * 1.2}px`,
                    height: `${BUTTON_SIZE * btnSizes.rt * 0.9}px`
                }}
                type="rectangle"
            >
                RT
            </GamepadButton>

            <GamepadButton
                id={'rb'}
                onTouchStart={() => gamepadButton(5, 'down')}
                onTouchEnd={() => gamepadButton(5, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.rb.x,
                    y: posBtn.rb.y
                }}
                type="rectangle"
                style={{
                    width: `${BUTTON_SIZE * btnSizes.rb * 1.2}px`,
                    height: `${BUTTON_SIZE * btnSizes.rb * 0.8}px`
                }}
            >
                RB
            </GamepadButton>

            <GamepadButton
                id={'btnY'}
                onTouchStart={() => gamepadButton(3, 'down')}
                onTouchEnd={() => gamepadButton(3, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.btnY.x,
                    y: posBtn.btnY.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.btnY}px`,
                    height: `${BUTTON_SIZE * btnSizes.btnY}px`
                }}
            >
                Y
            </GamepadButton>
            <GamepadButton
                id={'btnA'}
                onTouchStart={() => gamepadButton(0, 'down')}
                onTouchEnd={() => gamepadButton(0, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.btnA.x,
                    y: posBtn.btnA.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.btnA}px`,
                    height: `${BUTTON_SIZE * btnSizes.btnA}px`
                }}
            >
                A
            </GamepadButton>
            <GamepadButton
                id={'btnB'}
                onTouchStart={() => gamepadButton(1, 'down')}
                onTouchEnd={() => gamepadButton(1, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.btnB.x,
                    y: posBtn.btnB.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.btnB}px`,
                    height: `${BUTTON_SIZE * btnSizes.btnB}px`
                }}
            >
                B
            </GamepadButton>
            <GamepadButton
                id={'btnX'}
                onTouchStart={() => gamepadButton(2, 'down')}
                onTouchEnd={() => gamepadButton(2, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.btnX.x,
                    y: posBtn.btnX.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.btnX}px`,
                    height: `${BUTTON_SIZE * btnSizes.btnX}px`
                }}
            >
                X
            </GamepadButton>
            <Draggable
                disabled={!props.draggable}
                position={{ x: posBtn.rightJt.x, y: posBtn.rightJt.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={joystickWrapperRef}
            >
                <div
                    id="rightJt"
                    className="wrapperDraggable"
                    ref={joystickWrapperRef}
                >
                    <CustomJoyStick
                        ref={joystickRef}
                        draggable={props.draggable}
                        size={JOYSTICK_SIZE * btnSizes.rightJt}
                        moveCallback={gamepadCallBack}
                    />
                </div>
            </Draggable>
            <Draggable
                disabled={!props.draggable}
                position={{ x: posBtn.subBtn.x, y: posBtn.subBtn.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={subBtnRef}
            >
                <div ref={subBtnRef} className="containerSubButton" id="subBtn">
                    <div
                        className="centerButton"
                        onTouchStart={() => gamepadButton(8, 'down')}
                        onTouchEnd={() => gamepadButton(8, 'up')}
                    >
                        <MdArrowLeft />
                    </div>
                    <div
                        className="centerButton"
                        onTouchStart={() => gamepadButton(9, 'down')}
                        onTouchEnd={() => gamepadButton(9, 'up')}
                    >
                        <MdArrowRight />
                    </div>
                </div>
            </Draggable>

            <GamepadButton
                id={'rs'}
                onTouchStart={() => gamepadButton(11, 'down')}
                onTouchEnd={() => gamepadButton(11, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.rs.x,
                    y: posBtn.rs.y
                }}
                style={{
                    width: `${(BUTTON_SIZE * btnSizes.rs) / 1.5}px`,
                    height: `${(BUTTON_SIZE * btnSizes.rs) / 1.5}px`
                }}
            >
                RS
            </GamepadButton>
        </>
    );
};

const defaultButtonGroupLeftValue = {
    dpad: { x: 0.3, y: 0.75 },
    leftJt: { x: 0.02, y: 0.55 },
    lt: { x: 0.2, y: 0.14 },
    lb: { x: 0.15, y: 0.3 },
    ls: { x: 0.02, y: 0.4 }
};

export const ButtonGroupLeft = (props) => {
    const btnSize = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSize
    );
    const selected = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.currentSelected
    );

    const btnSizes = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSizes
    );
    const [isPending, startTransition] = useTransition();
    const DefaultPosition = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.isDefaultPos
    );

    const [posBtn, setPosBtn] = useState(defaultButtonGroupLeftValue);

    useEffect(() => {
        localStorage.removeItem('left_group_pos2');
    }, []);

    const handleResize = () => {
        let cache = localStorage.getItem(`left_group_pos3`);
        if (cache === null) {
            const deviceWidth = window.innerWidth;
            const deviceHeight = window.innerHeight;
            setPosBtn({
                dpad: {
                    x: deviceWidth * defaultButtonGroupLeftValue.dpad.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.dpad.y
                },
                leftJt: {
                    x: deviceWidth * defaultButtonGroupLeftValue.leftJt.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.leftJt.y
                },
                ls: {
                    x: deviceWidth * defaultButtonGroupLeftValue.ls.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.ls.y
                },
                lt: {
                    x: deviceWidth * defaultButtonGroupLeftValue.lt.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.lt.y
                },
                lb: {
                    x: deviceWidth * defaultButtonGroupLeftValue.lb.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.lb.y
                }
            });
            return;
        }
        const { dpad, leftJt, ls, lt, lb } = JSON.parse(cache);

        setPosBtn({
            dpad,
            leftJt,
            ls,
            lt,
            lb
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDrag = (e, data) => {
        const key = data.node.id;
        const value = { x: data.x, y: data.y };
        startTransition(() => {
            setPosBtn((prev) => {
                return {
                    ...prev,
                    [key]: value
                };
            });
        });
    };

    const handleStop = (e, data) => {
        startTransition(() => {
            localStorage.setItem(`left_group_pos3`, JSON.stringify(posBtn));
        });
    };

    useEffect(() => {
        if (!DefaultPosition) return;

        const deviceWidth = window.innerWidth;
        const deviceHeight = window.innerHeight;
        const defaultPos = {
            dpad: {
                x: deviceWidth * defaultButtonGroupLeftValue.dpad.x,
                y: deviceHeight * defaultButtonGroupLeftValue.dpad.y
            },
            leftJt: {
                x: deviceWidth * defaultButtonGroupLeftValue.leftJt.x,
                y: deviceHeight * defaultButtonGroupLeftValue.leftJt.y
            },

            ls: {
                x: deviceWidth * defaultButtonGroupLeftValue.ls.x,
                y: deviceHeight * defaultButtonGroupLeftValue.ls.y
            },
            lt: {
                x: deviceWidth * defaultButtonGroupLeftValue.lt.x,
                y: deviceHeight * defaultButtonGroupLeftValue.lt.y
            },
            lb: {
                x: deviceWidth * defaultButtonGroupLeftValue.lb.x,
                y: deviceHeight * defaultButtonGroupLeftValue.lb.y
            }
        };
        setPosBtn(defaultPos);
        localStorage.setItem(`left_group_pos3`, JSON.stringify(defaultPos));
    }, [DefaultPosition]);

    const handleSelectedBtn = (key) => {
        appDispatch(select_btn_gamepad(key));
    };
    const dpadRef = useRef(null);
    const joystickRef = useRef(null);
    const joystickWrapperRef = useRef(null);
    const gamepadCallBack = (x, y) => gamepadAxis(x, y, 'left');
    return (
        <>
            <GamepadButton
                id={'lt'}
                onTouchStart={() => gamepadButton(6, 'down')}
                onTouchEnd={() => gamepadButton(6, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.lt.x,
                    y: posBtn.lt.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.lt * 1.2}px`,
                    height: `${BUTTON_SIZE * btnSizes.lt * 0.8}px`
                }}
                type="rectangle"
            >
                LT
            </GamepadButton>
            <GamepadButton
                id={'lb'}
                onTouchStart={() => gamepadButton(4, 'down')}
                onTouchEnd={() => gamepadButton(4, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.lb.x,
                    y: posBtn.lb.y
                }}
                style={{
                    width: `${BUTTON_SIZE * btnSizes.lb * 1.2}px`,
                    height: `${BUTTON_SIZE * btnSizes.lb * 0.8}px`
                }}
                type="rectangle"
            >
                LB
            </GamepadButton>
            <Draggable
                disabled={!props.draggable}
                position={{ x: posBtn.dpad.x, y: posBtn.dpad.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                onMouseDown={() => {
                    props.draggable ? handleSelectedBtn('dpad') : null;
                }}
                nodeRef={dpadRef}
            >
                <div
                    ref={dpadRef}
                    id="dpad"
                    className={`wrapperDraggable ${
                        selected == 'dpad' && props.draggable ? 'selected' : ''
                    }`}
                >
                    <DPad ref={dpadRef} size={BUTTON_SIZE * btnSizes.dpad} />
                </div>
            </Draggable>
            <GamepadButton
                id={'ls'}
                onTouchStart={() => gamepadButton(10, 'down')}
                onTouchEnd={() => gamepadButton(10, 'up')}
                onStop={handleStop}
                onDrag={handleDrag}
                draggable={props.draggable}
                pos={{
                    x: posBtn.ls.x,
                    y: posBtn.ls.y
                }}
                style={{
                    width: `${(BUTTON_SIZE * btnSizes.ls) / 1.5}px`,
                    height: `${(BUTTON_SIZE * btnSizes.ls) / 1.5}px`
                }}
            >
                LS
            </GamepadButton>

            <Draggable
                disabled={!props.draggable}
                position={{ x: posBtn.leftJt.x, y: posBtn.leftJt.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={joystickWrapperRef}
            >
                <div
                    id="leftRt"
                    className="wrapperDraggable"
                    ref={joystickWrapperRef}
                >
                    <CustomJoyStick
                        color="black"
                        moveCallback={gamepadCallBack}
                        ref={joystickRef}
                        draggable={props.draggable}
                        size={JOYSTICK_SIZE * btnSizes.leftJt}
                    />
                </div>
            </Draggable>
        </>
    );
};

const NavSettings = ({ show }) => {
    const selected = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.currentSelected
    );
    const btnSizes = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSizes
    );

    const text = selected ? Math.round(btnSizes[selected] * 50) : 0;

    return (
        <div className={`${show ? 'slide-in' : 'slide-out'} navSetting`}>
            <div className="wrapperLeft">
                <div className="ctnContent">
                    <p className="title">Kích cỡ:</p>

                    <div className="btnGroup">
                        <button
                            onClick={() => {
                                appDispatch(decrease_btn_gamepad(selected));
                            }}
                        >
                            <MdOutlineRemoveCircleOutline color="#fff" />
                        </button>

                        <p>{text}%</p>

                        <button
                            onClick={() => {
                                appDispatch(increase_btn_gamepad(selected));
                            }}
                        >
                            <MdAddCircleOutline color="#fff" />
                        </button>
                    </div>
                </div>
                {/*<div className='ctnContent'>
                    <p className='title'>Độ mờ:</p>
                    <div className='btnGroup'>
                        <button>
                            -
                        </button>

                        <p>100%</p>

                        <button>+</button>
                    </div>
                </div>*/}
            </div>

            <div className="ctnBtns ">
                <button
                    onClick={() =>
                        appDispatch(toggle_default_gamepad_position())
                    }
                    className="instbtn hover:bg-green-600 bg-green-700"
                >
                    Về mặc định
                </button>
                <button
                    onClick={() => {
                        appDispatch(toggle_gamepad_draggable());
                    }}
                    className="instbtn"
                >
                    Xong
                </button>
            </div>
        </div>
    );
};
