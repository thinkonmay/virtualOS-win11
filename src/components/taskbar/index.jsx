import { afterMath, showLinkShare } from '@/backend/actions';
import {
    appDispatch,
    hide_gaming_keyboard,
    show_chat,
    startogg,
    toggle_gamepad,
    toggle_keyboard,
    useAppSelector
} from '@/backend/reducers';
import { Contents } from '@/backend/reducers/locales';
import { clickDispatch, customClickDispatch } from '@/backend/utils/dispatch';
import { useEffect, useState } from 'react';
import { BiSupport } from 'react-icons/bi';
import {
    MdArrowBackIos,
    MdArrowForwardIos,
    MdGamepad,
    MdOutlineKeyboard,
    MdOutlineSportsEsports,
    MdOutlineVideoSettings,
    MdShare
} from 'react-icons/md';
import useSound from 'use-sound';
import { Icon } from '../shared/general';
import './taskbar.scss';
import ringSound from '/audio/ring2.mp3';

const Taskbar = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const remote = useAppSelector((state) => state.remote);
    const tasks = useAppSelector((state) => state.taskbar);
    const align = useAppSelector((state) => state.taskbar.align);
    const apps = useAppSelector((state) => state.apps);
    const money = useAppSelector((state) => state.user.balance);
    const [open, setOpen] = useState(true);
    const [gamepadState, setGamepadState] = useState(null);
    const defaultapps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.taskbar.apps.includes(x.id))
    );
    const tempapps = useAppSelector((state) =>
        state.apps.apps
            .filter((x) => !x.hide)
            .filter((x) => defaultapps.find((y) => y.id == x.id) == undefined)
    );

    const gamingKeyboard = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard.open
    );
    const gamepad = useAppSelector(
        (state) =>
            !state.sidepane.mobileControl.gamePadHide ||
            state.sidepane.mobileControl.gamepadSetting.draggable
    );

    const [play] = useSound(ringSound, { volume: 0.1 });

    useEffect(() => {
        remote?.ready ? play() : null;
    }, [remote.ready]);

    const toggleControl = (e) => {
        setOpen((old) => !old);
        afterMath(e);
    };

    useEffect(() => {
        const map = {};
        const i = setInterval(() => {
            let gamepads = navigator.getGamepads();
            gamepads = gamepads
                ? [...gamepads].filter((gamepad) => gamepad !== null)
                : [];
            if (gamepads.length == 0) setGamepadState(null);
            else
                gamepads.forEach((gamepad, index) => {
                    const val = JSON.stringify(
                        gamepad.axes.map((x) => Math.abs(x.toFixed(1)))
                    );
                    if (map[index] != val) setGamepadState(true);
                    else setGamepadState(false);
                    map[index] = val;
                });
        }, 1000);
        return () => {
            clearInterval(i);
        };
    }, []);

    const numberFormat = (num) => new Intl.NumberFormat().format(num);

    const customDispatch = customClickDispatch((e) => afterMath(e));
    return (
        <>
            {remote.active ? (
                <div
                    className={`${open ? 'slide-in' : 'slide-out'} taskright`}
                    data-remote={remote.active}
                >
                    <button className="btn-show" onClick={toggleControl}>
                        {open ? (
                            <MdArrowForwardIos
                                style={{ fontSize: '1.2rem' }}
                            ></MdArrowForwardIos>
                        ) : (
                            <MdArrowBackIos
                                style={{ fontSize: '1.2rem' }}
                            ></MdArrowBackIos>
                        )}
                    </button>
                    {gamepad || gamingKeyboard ? (
                        <div
                            className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded text-white"
                            onClick={() => appDispatch(toggle_keyboard())}
                        >
                            <MdOutlineKeyboard
                                strokeWidth={'0rem'}
                                fontSize={'1.5rem'}
                            />
                        </div>
                    ) : null}
                    {gamepad ? (
                        <div
                            className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded text-red-500"
                            onClick={() => appDispatch(toggle_gamepad())}
                        >
                            <MdOutlineSportsEsports
                                strokeWidth={'0rem'}
                                fontSize={'1.5rem'}
                            />
                        </div>
                    ) : gamingKeyboard ? (
                        <div
                            className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded text-red-500"
                            onClick={() => appDispatch(hide_gaming_keyboard())}
                        >
                            <MdGamepad
                                strokeWidth={'0rem'}
                                fontSize={'1.5rem'}
                            />
                        </div>
                    ) : null}
                    <div
                        className="settingBtn flex gap-2 items-center font-semibold  p-2 prtclk handcr hvlight rounded "
                        onClick={showLinkShare}
                    >
                        <MdShare fontSize={'1.5rem'} />
                        <span className="hidden md:block">
                            {t[Contents.SHARE]}
                        </span>
                    </div>
                    <div
                        id="supportNow"
                        className="settingBtn flex gap-2 items-center font-semibold  p-2 prtclk handcr hvlight rounded "
                        onClick={() => appDispatch(show_chat())}
                        data-action="sidepane/sidepane_bandtogg"
                        style={{ '--prefix': 'BAND' }}
                    >
                        <BiSupport fontSize={'1.5rem'} />
                        <span className="hidden md:block">Hỗ trợ</span>
                    </div>
                    <div
                        className="settingBtn prtclk handcr my-1 p-2 hvlight flex gap-[8px] items-center rounded"
                        onClick={customDispatch}
                        style={{ '--prefix': 'PANE' }}
                        id="settingBtn"
                        data-action="sidepane_panetogg"
                    >
                        <div className="text-xm flex items-center gap-[4px] font-semibold">
                            <MdOutlineVideoSettings
                                fontSize={'1.2rem'}
                            ></MdOutlineVideoSettings>
                            {t[Contents.SETTING]}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="taskbar"
                    data-remote={remote.active}
                    data-align={align}
                    style={{ '--prefix': 'TASK' }}
                >
                    <audio src={ringSound}></audio>
                    {gamepadState == null ? null : (
                        <div className="containerWalletInfo">
                            <div className="wrapperWallet">
                                <div className="flex items-center gap-[4px] text-xs font-semibold lg:text-sm">
                                    <MdOutlineSportsEsports
                                        color={gamepadState ? 'gray' : 'white'}
                                        strokeWidth={'0rem'}
                                        fontSize={'1.5rem'}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="containerWalletInfo">
                        <div className="wrapperWallet">
                            <div className="flex items-center gap-[4px] text-xs font-semibold lg:text-sm">
                                <Icon
                                    className="vndIcon"
                                    src="vnd"
                                    width={24}
                                />
                                {numberFormat(money)}
                            </div>
                        </div>
                    </div>
                    <div className="tasksCont" data-side={tasks.align}>
                        <div className="tsbar">
                            <div
                                style={{ '--prefix': 'START' }}
                                className="settingBtn flex items-center prtclk handcr rounded-md p-2 hvlight"
                                onClick={() => appDispatch(startogg())}
                            >
                                <Icon
                                    className="infoBtn tsIcon tsIconInvert"
                                    src="home"
                                    width={28}
                                />
                                <p className="hidden md:block text-xm font-semibold">
                                    {t[Contents.ACCOUNT]}
                                </p>
                            </div>
                            {defaultapps.map((task, i) => {
                                const isHidden = task.hide;
                                const isActive = task.z == apps.hz;
                                return (
                                    <div key={i} value={task.id}>
                                        <Icon
                                            className="tsIcon"
                                            width={18}
                                            open={isHidden ? null : true}
                                            click="apps/app_toggle"
                                            active={isActive}
                                            payload={task.id}
                                            src={task.id}
                                        />
                                    </div>
                                );
                            })}
                            {tempapps.map((key, i) => {
                                const isActive = key.z == apps.hz;
                                return (
                                    <div key={i} value={key.icon}>
                                        <Icon
                                            className="tsIcon"
                                            width={24}
                                            active={isActive}
                                            click={key.action}
                                            payload={key.payload}
                                            menu={key.action}
                                            open="true"
                                            src={key.id}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div
                        className={`${
                            open ? 'slide-in' : 'slide-out'
                        } taskright`}
                        data-remote={remote.active}
                    >
                        {gamepad ? (
                            <div
                                className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded text-red-500"
                                onClick={() => appDispatch(toggle_gamepad())}
                            >
                                <MdOutlineSportsEsports
                                    strokeWidth={'0rem'}
                                    fontSize={'1.5rem'}
                                />
                            </div>
                        ) : gamingKeyboard ? (
                            <div
                                className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded text-red-500"
                                onClick={() =>
                                    appDispatch(hide_gaming_keyboard())
                                }
                            >
                                <MdGamepad
                                    strokeWidth={'0rem'}
                                    fontSize={'1.5rem'}
                                />
                            </div>
                        ) : null}
                        <div
                            className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded "
                            onClick={showLinkShare}
                        >
                            <MdShare strokeWidth={'0rem'} fontSize={'1.5rem'} />
                            <span className="hidden md:block">
                                {t[Contents.SHARE]}
                            </span>
                        </div>
                        <div
                            id="supportNow"
                            className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold  rounded "
                            onClick={() => appDispatch(show_chat())}
                            data-action="sidepane/sidepane_bandtogg"
                            style={{ '--prefix': 'BAND' }}
                        >
                            <BiSupport
                                strokeWidth={'0rem'}
                                fontSize={'1.5rem'}
                            />
                            <span className="hidden md:block">
                                {t[Contents.SUPPORT]}
                            </span>
                        </div>
                        <div
                            id="settingBtn"
                            className="settingBtn prtclk handcr my-1 p-2 hvlight flex gap-[8px] items-center rounded"
                            onClick={clickDispatch}
                            style={{ '--prefix': 'PANE' }}
                            data-action="sidepane_panetogg"
                        >
                            <div className="text-xm flex gap-[4px] items-center font-semibold">
                                <MdOutlineVideoSettings
                                    fontSize={'1.2rem'}
                                ></MdOutlineVideoSettings>
                                {t[Contents.SETTING]}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Taskbar;
