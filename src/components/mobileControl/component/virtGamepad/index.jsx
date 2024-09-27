import { useEffect, useRef, useState, useTransition } from 'react';
import Draggable from 'react-draggable'; // Both at the same time
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { useAppSelector } from '../../../../backend/reducers';
import {
    gamepadAxisCallback,
    gamePadBtnCallback
} from '../../../../backend/reducers/remote';
import { CustomJoyStick } from '../joystick';
import DPad from './dpad';
import { LeftFuncButton, RightFuncButton } from './funcBtn';
import './index.scss'; // Import your SCSS file
import YBXA from './ybxa';

const BUTTON_SIZE = 50;
const JOYSTICK_SIZE = 100;

export const VirtualGamepad = (props) => {
    const { AxisCallback, ButtonCallback } = props;
    const draggable = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.draggable
    );
    const isClose = useAppSelector(
        (state) => state.sidepane.mobileControl.gamePadHide
    );
    useEffect(() => {
        console.log(
            document.documentElement.clientWidth,
            document.documentElement.clientHeight
        );
    });
    return (
        <>
            {/*{(draggable === 'static' || draggable === 'draggable') && (*/}
            <div
                className={`virtGamepad ${!isClose ? 'slide-in' : 'slide-out'}`}
            >
                <ButtonGroupLeft
                    AxisCallback={AxisCallback}
                    ButtonCallback={ButtonCallback}
                    draggable={draggable}
                />

                <ButtonGroupRight
                    AxisCallback={AxisCallback}
                    ButtonCallback={ButtonCallback}
                    draggable={draggable}
                />
            </div>
            {/*)}*/}
        </>
    );
};

const defaultButtonGroupRightValue = {
    ybxa: { x: 0.93, y: 0.45 },
    joystick: { x: 0.65, y: 0.55 },
    funcBtn: { x: 0.82, y: 0.043 },
    subBtn: { x: 0.45, y: 0.03 },
    rs: { x: 0.87, y: 0.8 }
};

export const ButtonGroupRight = (props) => {
    const btnSize = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSize
    );
    const [isPending, startTransition] = useTransition();
    const DefaultPosition = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.isDefaultPos
    );

    const [posBtn, setPosBtn] = useState(defaultButtonGroupRightValue);

    useEffect(() => {
        localStorage.removeItem('right_group_pos');
    }, []);

    const handleResize = () => {
        let cache = localStorage.getItem(`right_group_pos1`);
        if (cache === null) {
            const deviceWidth = window.innerWidth;
            const deviceHeight = window.innerHeight;
            setPosBtn({
                ybxa: {
                    x: deviceWidth * defaultButtonGroupRightValue.ybxa.x,
                    y: deviceHeight * defaultButtonGroupRightValue.ybxa.y
                },
                joystick: {
                    x: deviceWidth * defaultButtonGroupRightValue.joystick.x,
                    y: deviceHeight * defaultButtonGroupRightValue.joystick.y
                },
                funcBtn: {
                    x: deviceWidth * defaultButtonGroupRightValue.funcBtn.x,
                    y: deviceHeight * defaultButtonGroupRightValue.funcBtn.y
                },
                subBtn: {
                    x: deviceWidth * defaultButtonGroupRightValue.subBtn.x,
                    y: deviceHeight * defaultButtonGroupRightValue.subBtn.y
                },
                rs: {
                    x: deviceWidth * defaultButtonGroupRightValue.rs.x,
                    y: deviceHeight * defaultButtonGroupRightValue.rs.y
                }
            });
            return;
        }
        const { ybxa, joystick, funcBtn, subBtn, rs } = JSON.parse(cache);

        setPosBtn({
            ybxa,
            joystick,
            funcBtn,
            subBtn,
            rs
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
            localStorage.setItem(`right_group_pos1`, JSON.stringify(posBtn));
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
            joystick: {
                x: deviceWidth * defaultButtonGroupRightValue.joystick.x,
                y: deviceHeight * defaultButtonGroupRightValue.joystick.y
            },
            funcBtn: {
                x: deviceWidth * defaultButtonGroupRightValue.funcBtn.x,
                y: deviceHeight * defaultButtonGroupRightValue.funcBtn.y
            },
            subBtn: {
                x: deviceWidth * defaultButtonGroupRightValue.subBtn.x,
                y: deviceHeight * defaultButtonGroupRightValue.subBtn.y
            },
            rs: {
                x: deviceWidth * defaultButtonGroupRightValue.rs.x,
                y: deviceHeight * defaultButtonGroupRightValue.rs.y
            }
        };
        setPosBtn(defaultPos);
        localStorage.setItem(`right_group_pos1`, JSON.stringify(defaultPos));
    }, [DefaultPosition]);

    const ybxaRef = useRef(null);
    const joystickRef = useRef(null);
    const funcBtnRef = useRef(null);
    const subBtnRef = useRef(null);
    const rsRef = useRef(null);

    const gamepadCallBack = async (x, y) => {
        return gamepadAxisCallback(x, y, 'right');
    };
    return (
        <>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.funcBtn.x, y: posBtn.funcBtn.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={funcBtnRef}
            >
                <div ref={funcBtnRef} id="funcBtn" className="wrapperDraggable">
                    <RightFuncButton
                        ref={funcBtnRef}
                        name="funcBtn"
                        Touch={(index, type) =>
                            props.ButtonCallback(index, type)
                        }
                        size={BUTTON_SIZE * btnSize}
                    />
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.ybxa.x, y: posBtn.ybxa.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={ybxaRef}
            >
                <div ref={ybxaRef} id="ybxa" className="wrapperDraggable">
                    <YBXA
                        ref={ybxaRef}
                        size={BUTTON_SIZE * btnSize}
                        onTouch={(e, type, index) =>
                            props.ButtonCallback(index, type)
                        }
                    />
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.joystick.x, y: posBtn.joystick.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={joystickRef}
            >
                <div
                    ref={joystickRef}
                    id="joystick"
                    className="wrapperDraggable"
                >
                    <CustomJoyStick
                        ref={joystickRef}
                        draggable={props.draggable}
                        size={JOYSTICK_SIZE * btnSize}
                        moveCallback={gamepadCallBack}
                    />
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.subBtn.x, y: posBtn.subBtn.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={subBtnRef}
            >
                <div ref={subBtnRef} className="containerSubButton" id="subBtn">
                    <div
                        className="centerButton"
                        onTouchStart={() => gamePadBtnCallback(8, 'down')}
                        onTouchEnd={() => gamePadBtnCallback(8, 'up')}
                    >
                        <MdArrowLeft />
                    </div>
                    <div
                        className="centerButton"
                        onTouchStart={() => gamePadBtnCallback(9, 'down')}
                        onTouchEnd={() => gamePadBtnCallback(9, 'up')}
                    >
                        <MdArrowRight />
                    </div>
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.rs.x, y: posBtn.rs.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={rsRef}
            >
                <div id="rs" className="wrapperDraggable" ref={rsRef}>
                    <button
                        id="rs"
                        className="defaultButton"
                        style={{
                            width: `${BUTTON_SIZE * btnSize}px`,
                            height: `${BUTTON_SIZE * btnSize}px`
                        }}
                        onTouchStart={() => gamePadBtnCallback(11, 'down')}
                        onTouchEnd={() => gamePadBtnCallback(11, 'up')}
                    >
                        RS
                    </button>
                </div>
            </Draggable>
        </>
    );
};

const defaultButtonGroupLeftValue = {
    dpad: { x: 0.07, y: 0.45 },
    joystick: { x: 0.22, y: 0.55 },
    funcBtn: { x: 0.03, y: 0.043 },
    ls: { x: 0.07, y: 0.8 }
};

export const ButtonGroupLeft = (props) => {
    const btnSize = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSize
    );
    const [isPending, startTransition] = useTransition();
    const DefaultPosition = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.isDefaultPos
    );

    const [posBtn, setPosBtn] = useState(defaultButtonGroupLeftValue);

    useEffect(() => {
        localStorage.removeItem('left_group_pos');
    }, []);

    const handleResize = () => {
        let cache = localStorage.getItem(`left_group_pos1`);
        if (cache === null) {
            const deviceWidth = window.innerWidth;
            const deviceHeight = window.innerHeight;
            setPosBtn({
                dpad: {
                    x: deviceWidth * defaultButtonGroupLeftValue.dpad.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.dpad.y
                },
                joystick: {
                    x: deviceWidth * defaultButtonGroupLeftValue.joystick.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.joystick.y
                },
                funcBtn: {
                    x: deviceWidth * defaultButtonGroupLeftValue.funcBtn.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.funcBtn.y
                },
                ls: {
                    x: deviceWidth * defaultButtonGroupLeftValue.ls.x,
                    y: deviceHeight * defaultButtonGroupLeftValue.ls.y
                }
            });
            return;
        }
        const { dpad, joystick, funcBtn, ls } = JSON.parse(cache);

        setPosBtn({
            dpad,
            joystick,
            funcBtn,
            ls
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        //initial state
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
            localStorage.setItem(`left_group_pos1`, JSON.stringify(posBtn));
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
            joystick: {
                x: deviceWidth * defaultButtonGroupLeftValue.joystick.x,
                y: deviceHeight * defaultButtonGroupLeftValue.joystick.y
            },
            funcBtn: {
                x: deviceWidth * defaultButtonGroupLeftValue.funcBtn.x,
                y: deviceHeight * defaultButtonGroupLeftValue.funcBtn.y
            },
            ls: {
                x: deviceWidth * defaultButtonGroupLeftValue.ls.x,
                y: deviceHeight * defaultButtonGroupLeftValue.ls.y
            }
        };
        setPosBtn(defaultPos);
        localStorage.setItem(`left_group_pos1`, JSON.stringify(defaultPos));
    }, [DefaultPosition]);

    const dpadRef = useRef(null);
    const joystickRef = useRef(null);
    const funcBtnRef = useRef(null);
    const lsRef = useRef(null);
    const gamepadCallBack = async (x, y) => {
        gamepadAxisCallback(x, y, 'left');
    };
    return (
        <>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.funcBtn.x, y: posBtn.funcBtn.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={funcBtnRef}
            >
                <div ref={funcBtnRef} id="funcBtn" className="wrapperDraggable">
                    <LeftFuncButton
                        ref={funcBtnRef}
                        Touch={(index, type) =>
                            props.ButtonCallback(index, type)
                        }
                        size={BUTTON_SIZE * btnSize}
                    />
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.dpad.x, y: posBtn.dpad.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={dpadRef}
            >
                <div ref={dpadRef} id="dpad" className="wrapperDraggable">
                    <DPad
                        ref={dpadRef}
                        size={BUTTON_SIZE * btnSize}
                        onTouch={(e, type, index) =>
                            props.ButtonCallback(index, type)
                        }
                    />
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.ls.x, y: posBtn.ls.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={lsRef}
            >
                <div id="ls" className="wrapperDraggable" ref={lsRef}>
                    <button
                        onTouchStart={() => gamePadBtnCallback(10, 'down')}
                        onTouchEnd={() => gamePadBtnCallback(10, 'up')}
                        draggable={props.draggable}
                        className="defaultButton"
                        style={{
                            width: `${BUTTON_SIZE * btnSize}px`,
                            height: `${BUTTON_SIZE * btnSize}px`
                        }}
                    >
                        LS
                    </button>
                </div>
            </Draggable>
            <Draggable
                disabled={props.draggable !== 'draggable'}
                position={{ x: posBtn.joystick.x, y: posBtn.joystick.y }}
                onStop={handleStop}
                onDrag={handleDrag}
                nodeRef={joystickRef}
            >
                <div
                    ref={joystickRef}
                    id="joystick"
                    className="wrapperDraggable"
                >
                    <CustomJoyStick
                        moveCallback={gamepadCallBack}
                        ref={joystickRef}
                        draggable={props.draggable}
                        size={JOYSTICK_SIZE * btnSize}
                    />
                </div>
            </Draggable>
        </>
    );
};
