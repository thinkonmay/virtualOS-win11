import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import * as fa from 'react-icons/fa';
import * as fi from 'react-icons/fi';
import * as md from 'react-icons/md';
import { MdArrowBack, MdOutlineClose } from 'react-icons/md';
import { PiPauseBold } from 'react-icons/pi';
import * as Actions from '../../backend/actions';
import { getTreeValue } from '../../backend/actions';

import { useDispatch } from 'react-redux';
import { isMobile } from '../../../src-tauri/core';
import {
    MAX_BITRATE,
    MAX_FRAMERATE,
    MIN_BITRATE,
    MIN_FRAMERATE
} from '../../../src-tauri/singleton';
import {
    appDispatch,
    change_bitrate,
    change_btnGp_size,
    change_framerate,
    desk_remove,
    menu_show,
    sidepane_panehide,
    toggle_default_gamepad_position,
    toggle_gamepad,
    toggle_gamepad_draggable,
    toggle_gamepad_setting,
    useAppSelector
} from '../../backend/reducers';
import {
    clickDispatch,
    customClickDispatch
} from '../../backend/utils/dispatch';
import { sleep } from '../../backend/utils/sleep';
import { VirtualGamepad } from '../mobileControl/component/virtGamepad';
import VirtKeyboard from '../mobileControl/component/virtKeyBoard';
import { OnboardingNewUser } from '../onboarding/newUser';
import { Icon } from '../shared/general';
import './searchpane.scss';
import './sidepane.scss';
import './startmenu.scss';
export * from './start';

export const DesktopApp = () => {
    const deskApps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.desktop.apps.includes(x.id))
    );

    const desk = useAppSelector((state) => state.desktop);
    const tutorial = useAppSelector((state) => state.globals.tutorial);
    const handleTouchEnd = async (e) => {
        //clearTimeout(timeoutRef.current);
        await sleep(200);
        clickDispatch(e);
    };
    const handleDouble = customClickDispatch((e) => e.stopPropagation());

    return (
        <div className="desktopCont">
            {tutorial ? <OnboardingNewUser /> : null}
            {!desk.hide &&
                deskApps.map((app, i) => {
                    return (
                        <div
                            key={i}
                            className="dskApp prtclk relative"
                            tabIndex={0}
                            data-action={app.action}
                            data-menu={app.menu}
                            data-payload={app.payload || 'full'}
                            data-id={app.id ?? 'null'}
                            data-name={app.name}
                            onDoubleClick={handleDouble}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Icon
                                className={`dskIcon ${app.id}`}
                                click={'null'}
                                src={app.id}
                                // mono={!(app.ready ?? true)}
                                pr
                                width={Math.round(desk.size * 36)}
                            />
                            <div className="appName">{app.name}</div>
                            {!app.installing ? null : (
                                <AiOutlineCloudDownload className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
                            )}
                            {app.ready ?? true ? null : (
                                <PiPauseBold className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
                            )}
                        </div>
                    );
                })}
        </div>
    );
};

export const SidePane = () => {
    const sidepane = useAppSelector((state) => state.sidepane);
    const setting = useAppSelector((state) => state.setting);
    const remote = useAppSelector((state) => state.remote);
    const t = useAppSelector((state) => state.globals.translation);
    const [pnstates, setPnstate] = useState([]);
    const dispatch = appDispatch;
    useEffect(() => {
        const framerateSlider = document.querySelector('.framerateSlider');
        const bitrateSlider = document.querySelector('.bitrateSlider');
        sliderBackground(framerateSlider, remote.framerate);
        sliderBackground(bitrateSlider, remote.bitrate);
    }, [remote.bitrate, remote.framerate]);

    const setBitrate = (e) => {
        dispatch(change_bitrate(e.target.value));
        localStorage.setItem('bitrate', e.target.value);
    };
    const setFramerate = (e) => {
        dispatch(change_framerate(e.target.value));
        localStorage.setItem('framerate', e.target.value);
    };
    function sliderBackground(elem, e) {
        elem.style.setProperty(
            '--track-color',
            `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
        );
    }

    useEffect(() => {
        //sidepane.quicks.map((item, i) => {
        //    if (item.src == 'nightlight') {
        //        if (pnstates[i]) document.body.dataset.sepia = true;
        //        else document.body.dataset.sepia = false;
        //    }
        //});
    });

    useEffect(() => {
        var tmp = [];
        var states = isMobile()
            ? sidepane.mobileControl.buttons
            : sidepane.quicks;
        const mobileState = {
            gamePadOpen: !sidepane.mobileControl.gamePadHide,
            keyboardOpen: !sidepane.mobileControl.keyboardHide
        };
        for (var i = 0; i < states.length; i++) {
            var val = getTreeValue(
                { ...setting, ...remote, ...mobileState },
                states[i].state
            );
            if (states[i].name == 'Theme') val = val == 'dark';
            tmp.push(val);
        }

        setPnstate(tmp);
    }, [setting, sidepane, remote]);

    return (
        <>
            <div
                style={{ '--prefix': 'PANE' }}
                className="sidePane dpShad"
                data-hide={sidepane.hide}
            >
                <div className="mainContent">
                    <div className="quickSettings ">
                        {isMobile() ? (
                            <MobileComponent
                                pnstates={pnstates}
                            ></MobileComponent>
                        ) : (
                            <DesktopComponent pnstates={pnstates} />
                        )}

                        <div className="sliderCont flex flex-col items-start">
                            <div className="containerSlider">
                                <p className="sliderName">
                                    Packetloss:{' '}
                                    <span> {remote.packetLoss}</span>
                                    IDR: <span> {remote.idrcount}</span>
                                    decodeFPS: <span> {remote.realfps}</span>
                                    bitrate: <span> {remote.realbitrate}</span>
                                    kbps
                                </p>

                                <div className="sliderName">
                                    {/*{t[Contents.QUALITY]}*/}
                                    Bitrate:
                                    <span>
                                        {Math.round(
                                            (((MAX_BITRATE() - MIN_BITRATE()) /
                                                100) *
                                                remote.bitrate +
                                                MIN_BITRATE()) /
                                                1000
                                        )}
                                    </span>
                                </div>
                                <div className=" sliderWrapper">
                                    <span>1mbs</span>
                                    <input
                                        className="sliders bitrateSlider"
                                        onChange={setBitrate}
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={remote.bitrate}
                                    />
                                    <span>15mbs</span>
                                </div>
                            </div>

                            <div className="containerSlider">
                                <div className="sliderName">
                                    {/*{t[Contents.FRAMERATE]}*/}
                                    Fps:
                                    <span>
                                        {Math.round(
                                            ((MAX_FRAMERATE - MIN_FRAMERATE) /
                                                100) *
                                                remote.framerate +
                                                MIN_FRAMERATE
                                        )}
                                    </span>
                                </div>
                                <div className=" sliderWrapper">
                                    <span>40</span>
                                    <input
                                        className="sliders framerateSlider"
                                        onChange={setFramerate}
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={remote.framerate}
                                    />
                                    <span>120</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <GamePadSetting></GamePadSetting>
                </div>

                {/*<div className="p-1 bottomBar">
                    <div className="px-3 battery-sidepane">
                        <Battery pct />
                    </div>
                </div>*/}
            </div>
            {isMobile() ? (
                <>
                    <VirtKeyboard></VirtKeyboard>
                    <VirtualGamepad></VirtualGamepad>
                </>
            ) : null}
        </>
    );
};

const GamePadSetting = () => {
    const sidepane = useAppSelector((state) => state.sidepane);

    const gamepadDraggable = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.draggable
    );
    const gamepadSettingOpen = sidepane.mobileControl.gamepadSetting.open;

    const selectedOption = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.btnSize
    );

    const handleChange = (e) => {
        appDispatch(change_btnGp_size(e.target.value));
    };
    const handleClose = (e) => {
        appDispatch(sidepane_panehide());
    };

    return (
        <div
            className={
                !gamepadSettingOpen
                    ? 'gamepadSetting slide-out'
                    : 'gamepadSetting slide-in'
            }
        >
            <div className="flex justify-between py-3 mx-[-12px]">
                <MdArrowBack
                    fontSize={'1.2rem'}
                    onClick={() => {
                        appDispatch(toggle_gamepad_setting());
                    }}
                />

                <MdOutlineClose
                    onClick={handleClose}
                    fontSize={'1.2rem'}
                ></MdOutlineClose>
            </div>
            <button
                onClick={() => {
                    appDispatch(toggle_gamepad());
                }}
                className="w-full instbtn outline-none border-none py-3 px-6 text-[14px] rounded-lg mb-4"
            >
                Đóng/mở gamepad ảo
            </button>
            <div className="">
                <p className="text-[0.9rem] mb-[4px]">Size:</p>
                <form className="flex gap-4">
                    <label className="size-choosen">
                        Small
                        <input
                            type="radio"
                            value="1"
                            checked={selectedOption == '1'}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="size-choosen">
                        Medium
                        <input
                            type="radio"
                            value="1.2"
                            checked={selectedOption == '1.2'}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="size-choosen">
                        Big
                        <input
                            type="radio"
                            value="3"
                            checked={selectedOption == '3'}
                            onChange={handleChange}
                        />
                    </label>
                </form>
            </div>

            <button
                className="instbtn outline-none border-none w-full py-3 bold mt-4 rounded-lg"
                onClick={() => {
                    appDispatch(toggle_gamepad_draggable());
                }}
            >
                Đổi vị trí các nút
            </button>

            {gamepadDraggable == 'draggable' ? (
                <>
                    <p className="text-[0.75rem] mt-1">
                        *kéo các nút để chỉnh vị trí
                    </p>
                    <div className="ctnBtn flex mt-4 gap-4 justify-end">
                        <button
                            className="bg-slate-400 rounded-md"
                            onClick={() =>
                                appDispatch(toggle_default_gamepad_position())
                            }
                        >
                            Default
                        </button>
                        <button
                            className="bg-[#0167c0] rounded-md"
                            onClick={() => {
                                appDispatch(toggle_gamepad_draggable());
                                appDispatch(toggle_gamepad_setting());
                            }}
                        >
                            Save
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export const LogMaintain = () => {
    return (
        <div class="bg-red-600 absolute flex gap-4 items-center right-[50%] translate-x-[50%] top-0 text-white font-bold py-2 px-4 rounded">
            <md.MdOutlineSettingsSuggest
                fontSize={'1.5rem'}
            ></md.MdOutlineSettingsSuggest>
            Server is offline
        </div>
    );
};

function MobileComponent({ pnstates }) {
    const sidepane = useAppSelector((state) => state.sidepane);
    const t = useAppSelector((state) => state.globals.translation);

    return (
        <>
            <div className="listBtn">
                {sidepane.mobileControl.buttons.map((qk, idx) => (
                    <div key={idx} className="qkGrp">
                        <div
                            style={{
                                ...qk.style
                            }}
                            className="qkbtn handcr prtclk"
                            onClick={clickDispatch}
                            data-action={qk.action}
                            data-payload={qk.payload || qk.state}
                            data-state={pnstates[idx]}
                        >
                            {Object.keys(md).includes(qk.src) ? (
                                (() => {
                                    const WinApp = md[qk.src];
                                    return <WinApp />;
                                })()
                            ) : Object.keys(fi).includes(qk.src) ? (
                                (() => {
                                    const WinApp = fi[qk.src];
                                    return <WinApp />;
                                })()
                            ) : Object.keys(fa).includes(qk.src) ? (
                                (() => {
                                    const WinApp = fa[qk.src];
                                    return <WinApp />;
                                })()
                            ) : (
                                <Icon
                                    className="quickIcon"
                                    ui={qk.ui}
                                    src={qk.src}
                                    width={14}
                                    invert={pnstates[idx] ? true : null}
                                />
                            )}
                        </div>
                        <div className="qktext">{t[qk.name]}</div>
                    </div>
                ))}
            </div>
            <div className="shortcuts">
                <hr className="mb-4" />
                <div className="listBtn">
                    {sidepane.mobileControl.shortcuts.map((qk, idx) => (
                        <div key={idx} className="qkGrp t">
                            <div
                                style={{
                                    fontSize: '0.6rem'
                                }}
                                className="qkbtn handcr prtclk"
                                onClick={() => Actions.clickShortCut(qk.val)}
                            >
                                {qk.name}
                            </div>
                            {/*<div className="qktext">{t[qk.name]}</div>*/}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
function DesktopComponent({ pnstates }) {
    const t = useAppSelector((state) => state.globals.translation);
    const sidepane = useAppSelector((state) => state.sidepane);

    return (
        <>
            <div className="listBtn">
                {sidepane.quicks.map((qk, idx) => (
                    <div key={idx} className="qkGrp">
                        <div
                            style={{
                                ...qk.style
                            }}
                            className="qkbtn handcr prtclk"
                            onClick={clickDispatch}
                            data-action={qk.action}
                            data-payload={qk.payload || qk.state}
                            data-state={pnstates[idx]}
                        >
                            {Object.keys(md).includes(qk.src) ? (
                                (() => {
                                    const WinApp = md[qk.src];
                                    return <WinApp />;
                                })()
                            ) : Object.keys(fi).includes(qk.src) ? (
                                (() => {
                                    const WinApp = fi[qk.src];
                                    return <WinApp />;
                                })()
                            ) : Object.keys(fa).includes(qk.src) ? (
                                (() => {
                                    const WinApp = fa[qk.src];
                                    return <WinApp />;
                                })()
                            ) : (
                                <Icon
                                    className="quickIcon"
                                    ui={qk.ui}
                                    src={qk.src}
                                    width={14}
                                    invert={pnstates[idx] ? true : null}
                                />
                            )}
                        </div>
                        <div className="qktext">{t[qk.name]}</div>
                    </div>
                ))}
            </div>
            <div className="shortcuts">
                <hr className="mb-4" />
                <div className="listBtn">
                    {sidepane.shortcuts.map((qk, idx) => (
                        <div key={idx} className="qkGrp t">
                            <div
                                style={{
                                    fontSize: '0.8rem'
                                }}
                                className="qkbtn handcr prtclk"
                                onClick={() => Actions.clickShortCut(qk.val)}
                            >
                                {qk.name}
                            </div>
                            {/*<div className="qktext">{t[qk.name]}</div>*/}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
