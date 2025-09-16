import * as Actions from '@/backend/actions';
import { getTreeValue } from '@/backend/actions';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import * as fa from 'react-icons/fa';
import * as fi from 'react-icons/fi';
import * as md from 'react-icons/md';

import { isMobile } from '#/core';
import {
    MAX_BITRATE,
    MAX_FRAMERATE,
    MIN_BITRATE,
    MIN_FRAMERATE
} from '#/singleton';
import {
    appDispatch,
    change_bitrate,
    change_framerate,
    useAppSelector
} from '@/backend/reducers';
import { clickDispatch, customClickDispatch } from '@/backend/utils/dispatch';
import { Icon } from '../shared/general';
import './searchpane.scss';
import './sidepane.scss';
import './startmenu.scss';
export * from './start';

export const DesktopApp = () => {
    const desk = useAppSelector((state) => state.desktop);
    const deskApps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.desktop.apps.includes(x.id))
    );
    const t = useAppSelector((state) => state.globals.translation);

    const handleTouchEnd = clickDispatch;
    const handleDouble = customClickDispatch((e) => e.stopPropagation());

    return (
        <div className="desktopCont">
            {!desk.hide &&
                deskApps.map((app, i) => (
                    <div
                        key={i}
                        id={app.id}
                        className="dskApp prtclk relative sm:m-4 m-0"
                        tabIndex={0}
                        data-action={app.action}
                        data-menu={app.menu}
                        data-payload={app.payload || 'full'}
                        data-id={app.id ?? 'null'}
                        data-name={app.name}
                        onDoubleClick={handleDouble}
                        onTouchEnd={handleTouchEnd}
                    >
                        {app.icon == undefined ? (
                            <Icon
                                className={`${app.id}`}
                                click={'null'}
                                width={Math.round(desk.size * 30)}
                                src={app.image ?? app.id}
                                mono={app.mono ?? false}
                                pr
                            />
                        ) : (
                            <Icon
                                icon={app.icon}
                                className={`${app.id}`}
                                click={'null'}
                                width={Math.round(desk.size * 30)}
                            />
                        )}
                        <div className="appName">{t[app.name]}</div>
                    </div>
                ))}
        </div>
    );
};

export const SidePane = () => {
    const sidepane = useAppSelector((state) => state.sidepane);
    const setting = useAppSelector((state) => state.setting);
    const remote = useAppSelector((state) => state.remote);
    const HighMTU = useAppSelector((state) => state.worker.HighMTU);
    const { steam, storage } = useAppSelector(
        (state) => state.worker.data[state.worker.currentAddress] ?? {}
    );
    const [pnstates, setPnstate] = useState({});
    const shutdownable = useAppSelector(
        (state) => state.worker.data[state.worker.currentAddress]?.availability
    );
    const backupable = useAppSelector(
        (state) => state.worker.data[state.worker.currentAddress]?.backup
    );
    const setBitrate = (e) => {
        appDispatch(change_bitrate(e.target.value));
        localStorage.setItem('bitrate', e.target.value);
    };
    const setFramerate = (e) => {
        appDispatch(change_framerate(e.target.value));
        localStorage.setItem('framerate', e.target.value);
    };
    function sliderBackground(elem, e) {
        elem.style.setProperty(
            '--track-color',
            `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
        );
    }

    useEffect(() => {
        let states = isMobile()
            ? sidepane.mobileControl.buttons
            : sidepane.desktopControl.buttons;
        const mobileState = {
            gamePadOpen: !sidepane.mobileControl.gamepadSetting.draggable,
            keyboardOpen:
                sidepane.mobileControl.gamingKeyBoard.editState == 'draggable'
        };

        const tmp = {};
        for (const { state, name } of states) {
            let val = getTreeValue(
                {
                    ...setting,
                    ...remote,
                    ...mobileState,
                    HighMTU,
                    steam,
                    storage
                },
                state
            );
            if (name == 'Theme') val = val == 'dark';
            tmp[state] = val;
        }

        setPnstate(tmp);
    }, [setting, sidepane, remote, HighMTU, steam]);

    useEffect(() => {
        const framerateSlider = document.querySelector('.framerateSlider');
        const bitrateSlider = document.querySelector('.bitrateSlider');
        sliderBackground(framerateSlider, remote.framerate);
        sliderBackground(bitrateSlider, remote.bitrate);
    }, [remote.bitrate, remote.framerate]);

    const data = {
        pnstates,
        sidepane,
        backupable,
        shutdownable,
        remote
    };

    return (
        <div
            style={{ '--prefix': 'PANE' }}
            className="sidePane dpShad"
            data-hide={sidepane.hide}
        >
            <div className="mainContent">
                <div className="quickSettings ">
                    {isMobile() ? (
                        <MobileComponent data={data} />
                    ) : (
                        <DesktopComponent data={data} />
                    )}

                    <div className="sliderCont flex flex-col items-start">
                        <SpecsConnectInfo />

                        <div className="containerSlider mb-[-4px]">
                            <div className="sliderName">
                                <b>Bitrate:</b>
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
                                <span>
                                    {Math.round(MIN_BITRATE() / 1000)}mbps
                                </span>
                                <input
                                    className="sliders bitrateSlider"
                                    onChange={setBitrate}
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={remote.bitrate}
                                />
                                <span>
                                    {Math.round(MAX_BITRATE() / 1000)}mbps
                                </span>
                            </div>
                        </div>
                        <div className="containerSlider">
                            <div className="sliderName">
                                <b>Fps:</b>
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
                <ReduceLag />
            </div>
        </div>
    );
};

const ReduceLag = () => (
    <div className="reduceLagCtn">
        <div className="wrapper ">
            <span className="italic text-[10px] lg:text-sm font-semibold underline">
                Làm sao để giảm giật lag khi chơi game?
            </span>
            <div className="child inset">
                <h3>Cách giảm giật lag khi chơi game</h3>
                <ul className="my-4">
                    <li>
                        Cách 1: Mở trên Chrome, đóng các tab, ứng dụng đang chạy
                        trên thiết bị của bạn.
                    </li>
                    <li>
                        Cách 2:
                        <ul>
                            <li>
                                Giảm bitrate nếu bị delay, tăng nhẹ cho đên khi
                                thấy ổn
                            </li>
                            <li>
                                Chỉnh fps: Thử các mốc: 40, 50, 60, vv mỗi mốc
                                trong 30s <br />
                                + 60-80 với điện thoại
                                <br />+ 50-120 với laptop(phụ thuộc vào cấu
                                hình)
                            </li>
                        </ul>
                    </li>
                </ul>
                <p className="italic">
                    Nếu các cách trên không giúp giảm giật lag, bạn vui lòng
                    liên hệ <b>fanpage Thinkmay</b> để được hỗ trợ nhé!{' '}
                </p>
            </div>
        </div>
    </div>
);

const SpecsConnectInfo = () => {
    const remote = useAppSelector((state) => state.remote);

    return (
        <div className="containerSlider">
            <div className="wrapperSpecsInfo sliderName    mb-1">
                <div className="specsTitle ">
                    Thông số: <AiOutlineQuestionCircle />
                </div>

                <div className="specsExplain">
                    <p>
                        <b>Packetloss</b>: Tỷ lệ dữ liệu bị mất khi truyền từ
                        cloud về thiết bị của bạn. Mức lý tưởng: 0
                    </p>

                    <p>
                        <b>IDR</b>: Thông số tái tạo khung hình bị vỡ. Mức lý
                        tưởng: 10 - 30.
                    </p>

                    <p>
                        <b>Bitrate</b>: Tốc độ truyền dữ liệu mỗi giây. Mức tối
                        thiểu cho cloud gaming: 6Mbps
                    </p>

                    <p>
                        <b>Fps</b>: Số khung hình hiển thị mỗi giây. Mức tối
                        thiểu: 30
                    </p>

                    <p>
                        <b>Decode</b>: Thời gian cần để giải mã tín hiệu video
                        từ cloud. Mức lý tưởng: dưới 1 ms
                    </p>

                    <p>
                        <b>Delay</b>: Độ trễ từ khi thực hiện thao tác game đến
                        khi hành động xuất hiện trên màn hình. Mức lý tưởng:
                        dưới 30 ms
                    </p>
                </div>
            </div>
            <p className="sliderName">
                packetloss: <span> {remote.packetLoss}</span>
                idr: <span> {remote.idrcount}</span>
                bitrate: <span> {remote.realbitrate}</span>
                kbps
            </p>
            <p className="sliderName">
                fps: <span> {remote.realfps}</span>
                {!isNaN(remote.realdecodetime) ? (
                    <>
                        decode: <span> {remote.realdecodetime.toFixed(2)}</span>
                        ms{' '}
                    </>
                ) : null}
                {!isNaN(remote.realdelay) ? (
                    <>
                        delay: <span> {remote.realdelay.toFixed(2)}</span>
                        ms
                    </>
                ) : null}
            </p>
        </div>
    );
};

const MobileBtn = ({ qk, pnstates }) => {
    const t = useAppSelector((state) => state.globals.translation);

    const [isShowExplain, setShowExplain] = useState(false);
    const touchTimerRef = useRef(null);

    const handleTouchStart = () => {
        if (touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
        }

        touchTimerRef.current = setTimeout(() => {
            setShowExplain(true);
        }, 1000); // 1 giây
    };

    const handleTouchEnd = () => {
        if (touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
            touchTimerRef.current = null;
        }
        setShowExplain(false);
    };

    return (
        <div className="qkGrp">
            <div
                style={{
                    ...qk.style
                }}
                className={`qkbtn handcr prtclk ${qk.id}`}
                onClick={clickDispatch}
                data-action={qk.action}
                data-payload={qk.payload || qk.state}
                data-state={pnstates[qk.state]}
                onTouchEnd={handleTouchEnd}
                onTouchStart={handleTouchStart}
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
                        invert={pnstates[qk.state] ? true : null}
                    />
                )}
            </div>
            <div className="qktext">{t[qk.name]}</div>

            {isShowExplain ? (
                <div className="qkExplainTextMobile">
                    <h6 className="text-xs text-center">{t[qk.name]}</h6>
                    {qk.explain ? (
                        <p className="text-[8px] text-center mt-1">
                            {t[qk.explain]}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

const MobileShortCutBtn = ({ qk }) => {
    const t = useAppSelector((state) => state.globals.translation);

    const [isShowExplain, setShowExplain] = useState(false);
    const touchTimerRef = useRef(null);

    const handleTouchStart = () => {
        if (touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
        }

        touchTimerRef.current = setTimeout(() => {
            setShowExplain(true);
        }, 1000); // 1 giây
    };

    const handleTouchEnd = () => {
        if (touchTimerRef.current) {
            clearTimeout(touchTimerRef.current);
            touchTimerRef.current = null;
        }
        setShowExplain(false);
    };

    return (
        <div className="qkGrp">
            <div
                className={`qkbtn handcr prtclk`}
                onClick={() => Actions.clickShortCut(qk.val)}
                onTouchEnd={handleTouchEnd}
                onTouchStart={handleTouchStart}
                style={{
                    fontSize: '0.6rem'
                }}
            >
                {qk.name}
            </div>

            {isShowExplain ? (
                <div className="qkExplainTextMobile">
                    <h6 className="text-xs text-center">{qk.name}</h6>
                    {qk.explain ? (
                        <p className="text-[8px] text-center mt-1">
                            {t[qk.explain]}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
function MobileComponent({
    data: { pnstates, sidepane, shutdownable, backupable, remote }
}) {
    let blacklist = [];
    if (!['started', 'closable'].includes(shutdownable))
        blacklist = ['shutDownVm'];
    if (!remote.active) blacklist.push('close_remote');
    if (backupable == 'ongoing') blacklist.push('restore_game');
    else if (backupable == 'capable') blacklist.push('backup_game');
    else blacklist.push('backup_game', 'restore_game');

    const renderList = sidepane.mobileControl.buttons;
    const generalList = sidepane.generalControl.filter(
        (x) => !blacklist.includes(x.action)
    );

    return (
        <>
            <div className="listBtn">
                {generalList.map((qk, idx) => (
                    <MobileBtn key={idx} pnstates={pnstates} qk={qk} />
                ))}
            </div>
            {generalList.length > 0 ? <hr className="mb-2 lg:mb-1" /> : null}
            <div className="listBtn">
                {renderList.map((qk, idx) => (
                    <MobileBtn key={idx} pnstates={pnstates} qk={qk} />
                ))}
                {sidepane.mobileControl.shortcuts.map((qk, idx) => (
                    <MobileShortCutBtn key={idx} qk={qk} />
                ))}
            </div>
        </>
    );
}
function DesktopComponent({
    data: { pnstates, sidepane, shutdownable, backupable, remote }
}) {
    const t = useAppSelector((state) => state.globals.translation);
    let blacklist = [];
    if (!['started', 'closable'].includes(shutdownable))
        blacklist = ['shutDownVm'];
    if (!remote.active) blacklist.push('close_remote');
    if (backupable == 'ongoing') blacklist.push('restore_game');
    else if (backupable == 'capable') blacklist.push('backup_game');
    else blacklist.push('backup_game', 'restore_game');

    const renderList = sidepane.desktopControl.buttons;
    const generalList = sidepane.generalControl.filter(
        (x) => !blacklist.includes(x.action)
    );

    return (
        <>
            <div className="listBtn">
                {generalList.map((qk, idx) => (
                    <div key={idx} className="qkGrp">
                        <div
                            style={{
                                ...qk.style
                            }}
                            className={`qkbtn handcr prtclk ${qk.id}`}
                            onClick={clickDispatch}
                            data-action={qk.action}
                            data-payload={qk.payload || qk.state}
                            data-state={pnstates[qk.state]}
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
                                    invert={pnstates[qk.state] ? true : null}
                                />
                            )}
                        </div>
                        <div className="qktext flex items-center gap-2">
                            {t[qk.name]}
                        </div>
                    </div>
                ))}
            </div>
            {generalList.length > 0 ? <hr className="mb-2 lg:mb-1" /> : null}
            <div className="listBtn">
                {renderList.map((qk, idx) => (
                    <div key={idx} className="qkGrp">
                        <div
                            style={{
                                ...qk.style
                            }}
                            className={`qkbtn handcr prtclk ${qk.id}`}
                            onClick={clickDispatch}
                            data-action={qk.action}
                            data-payload={qk.payload || qk.state}
                            data-state={pnstates[qk.state]}
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
                                    invert={pnstates[qk.state] ? true : null}
                                />
                            )}
                        </div>
                        <div className="qktext flex items-center gap-2">
                            {t[qk.name]}

                            {qk.explain ? (
                                <div className="qkExplainCtn">
                                    <AiOutlineQuestionCircle fontSize="1rem" />
                                    <div className="qkExplainText">
                                        {t[qk.explain]}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
                {sidepane.desktopControl.shortcuts.map((qk, idx) => (
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
                        {qk?.explain ? (
                            <div className="qktext">{t[qk.explain]}</div>
                        ) : null}
                    </div>
                ))}
            </div>
        </>
    );
}
