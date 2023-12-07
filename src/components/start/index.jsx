import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { PiPauseBold } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../backend/actions';
import { getTreeValue } from '../../backend/actions';
import { UserEvents } from '../../backend/actions/analytics';
import { fetchApp } from '../../backend/actions/preload';
import Battery from '../shared/Battery';
import { Icon } from '../shared/general';
import './searchpane.scss';
import './sidepane.scss';
import './startmenu.scss';
export * from './start';

export const DesktopApp = () => {
    const user = useSelector((state) => state.user);
    const deskApps = useSelector((state) => {
        var arr = { ...state.desktop };
        var tmpApps = [...arr.apps];

        if (arr.sort == 'name') {
            tmpApps.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            );
        } else if (arr.sort == 'size') {
            tmpApps.sort((a, b) => {
                var anm = a.name,
                    bnm = b.name;

                return anm[bnm.charCodeAt(0) % anm.length] >
                    bnm[anm.charCodeAt(0) % bnm.length]
                    ? 1
                    : -1;
            });
        } else if (arr.sort == 'date') {
            tmpApps.sort((a, b) => {
                var anm = a.name,
                    bnm = b.name;
                var anml = anm.length,
                    bnml = bnm.length;

                return anm[(bnml * 13) % anm.length] >
                    bnm[(anml * 17) % bnm.length]
                    ? 1
                    : -1;
            });
        }

        arr.apps = tmpApps;
        return arr;
    });
    const [holding, setHolding] = useState(false);
    const timeoutRef = useRef(null);

    const handleTouchStart = (e) => {
        Actions.afterMath(e);
        timeoutRef.current = setTimeout(() => {
            setHolding(true);
            e.preventDefault();
            // dispatch({ type: 'GARBAGE'});
            var touch = e.touches[0] || e.changedTouches[0];

            var data = {
                top: touch.clientY,
                left: touch.clientX
            };
            data.menu = e.target.dataset.menu;
            data.attr = e.target.attributes;
            data.dataset = e.target.dataset;
            dispatch({
                type: 'MENUSHOW',
                payload: data
            });
        }, 100); // 1000 milliseconds = 1 second
    };

    const handleTouchEnd = () => {
        clearTimeout(timeoutRef.current);
        //setHolding(false);
    };
    const hasNotReadyApp = useMemo(() => {
        return deskApps.apps.some((app) => app.status == 'NOT_READY');
    }, [deskApps.apps]);

    useEffect(() => {
        const intervalFetchApp = async () => {
            for (let index = 0; index < 10; index++) {
                fetchApp();
                await new Promise((r) => setTimeout(r, 60 * 1000));
            }
        };
        if (hasNotReadyApp) intervalFetchApp();
    }, [hasNotReadyApp]);

    const dispatch = useDispatch();
    const handleDouble = (e) => {
        e.stopPropagation();
        const action = {
            type: e.target.dataset.action,
            payload: e.target.dataset.payload,
            name: e.target.dataset.name
        };

        UserEvents({ content: `click app ${e.target.dataset.name}` });
        dispatch(action);
    };

    return (
        <div className="desktopCont">
            {!deskApps.hide &&
                deskApps.apps.map((app, i) => {
                    return (
                        // to allow it to be focusable (:focus)
                        <div
                            key={i}
                            className="dskApp prtclk relative"
                            tabIndex={0}
                            data-action={app.action}
                            data-menu={app.type ?? 'app'}
                            data-payload={app.payload || 'full'}
                            data-id={app.id ?? 'null'}
                            data-name={app.name}
                            onDoubleClick={handleDouble}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Icon
                                className="dskIcon "
                                click={'null'}
                                src={app.icon}
                                pr
                                width={Math.round(deskApps.size * 36)}
                            />

                            <div className="appName">{app.name}</div>
                            {app?.status == 'PAUSED' ? (
                                <PiPauseBold className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
                            ) : app.status == 'NOT_READY' ? (
                                <AiOutlineCloudDownload className="text-[1.2rem] text-white absolute top-[-3px] right-[-3px]" />
                            ) : null}
                        </div>
                    );
                })}
        </div>
    );
};

export const BandPane = () => {
    const sidepane = useSelector((state) => state.sidepane);

    return (
        <div
            className="bandpane dpShad"
            data-hide={sidepane.banhide}
            style={{ '--prefix': 'BAND' }}
        >
            <div className="bandContainer">
                <Icon className="hvlight" src="defender" width={17} />
                <Icon className="hvlight" src="spotify" width={17} />
                <Icon className="hvlight" src="teams" width={17} />
            </div>
        </div>
    );
};

export const SidePane = () => {
    const sidepane = useSelector((state) => state.sidepane);
    const setting = useSelector((state) => state.setting);
    const tasks = useSelector((state) => state.taskbar);
    const [pnstates, setPnstate] = useState([]);
    const dispatch = useDispatch();

    let [btlevel, setBtLevel] = useState('');
    const childToParent = () => {};

    const clickDispatch = (event) => {
        var action = {
            type: event.target.dataset.action,
            payload: event.target.dataset.payload
        };

        if (action.type) {
            if (action.type != action.type.toUpperCase()) {
                Actions[action.type](action.payload);
            } else dispatch(action);
        }
    };

    const vSlider = document.querySelector('.vSlider');
    const bSlider = document.querySelector('.bSlider');

    const setVolume = (e) => {
        var aud = 3;
        if (e.target.value < 70) aud = 2;
        if (e.target.value < 30) aud = 1;
        if (e.target.value == 0) aud = 0;

        dispatch({ type: 'TASKAUDO', payload: aud });

        sliderBackground(vSlider, e.target.value);
    };

    function sliderBackground(elem, e) {
        elem.style.setProperty(
            '--track-color',
            `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
        );
    }

    const setBrightness = (e) => {
        var brgt = e.target.value;
        document.getElementById('brightoverlay').style.opacity =
            (100 - brgt) / 100;
        dispatch({
            type: 'STNGSETV',
            payload: {
                path: 'system.display.brightness',
                value: brgt
            }
        });
        sliderBackground(bSlider, brgt);
    };

    useEffect(() => {
        sidepane.quicks.map((item, i) => {
            if (item.src == 'nightlight') {
                if (pnstates[i]) document.body.dataset.sepia = true;
                else document.body.dataset.sepia = false;
            }
        });
    });

    useEffect(() => {
        var tmp = [];
        for (var i = 0; i < sidepane.quicks.length; i++) {
            var val = getTreeValue(setting, sidepane.quicks[i].state);
            if (sidepane.quicks[i].name == 'Theme') val = val == 'dark';
            tmp.push(val);
        }

        setPnstate(tmp);
    }, [setting, sidepane]);

    return (
        <div
            className="sidePane dpShad"
            data-hide={sidepane.hide}
            style={{ '--prefix': 'PANE' }}
        >
            <div className="quickSettings p-5 pb-8">
                <div className="qkCont">
                    {sidepane.quicks.map((qk, idx) => {
                        return (
                            <div key={idx} className="qkGrp">
                                <div
                                    className="qkbtn handcr prtclk"
                                    onClick={clickDispatch}
                                    data-action={qk.action}
                                    data-payload={qk.payload || qk.state}
                                    data-state={pnstates[idx]}
                                >
                                    <Icon
                                        className="quickIcon"
                                        ui={qk.ui}
                                        src={qk.src}
                                        width={14}
                                        invert={pnstates[idx] ? true : null}
                                    />
                                </div>
                                <div className="qktext">{qk.name}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="sliderCont">
                    <Icon className="mx-2" src="brightness" ui width={20} />
                    <input
                        className="sliders bSlider"
                        onChange={setBrightness}
                        type="range"
                        min="10"
                        max="100"
                        defaultValue="100"
                    />
                </div>
                <div className="sliderCont">
                    <Icon
                        className="mx-2"
                        src={'audio' + tasks.audio}
                        ui
                        width={18}
                    />
                    <input
                        className="sliders vSlider"
                        onChange={setVolume}
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                    />
                </div>
            </div>
            <div className="p-1 bottomBar">
                <div className="px-3 battery-sidepane">
                    <Battery pct />
                </div>
            </div>
        </div>
    );
};

export const CalnWid = () => {
    const sidepane = useSelector((state) => state.sidepane);
    const [loaded, setLoad] = useState(false);

    const [collapse, setCollapse] = useState('');

    const collapseToggler = () => {
        collapse === '' ? setCollapse('collapse') : setCollapse('');
    };

    useEffect(() => {
        if (!loaded) {
            setLoad(true);
            //const newLocal = window.dycalendar.draw({
            //  target: "#dycalendar",
            //  type: "month",
            //  dayformat: "ddd",
            //  monthformat: "full",
            //  prevnextbutton: "show",
            //  highlighttoday: true,
            //});
        }
    });

    return (
        <div
            className={`calnpane ${collapse} dpShad`}
            data-hide={sidepane.calhide}
            style={{ '--prefix': 'CALN' }}
        >
            <div className="topBar pl-4 text-sm">
                <div className="date">
                    {new Date().toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                <div
                    className="collapser p-2 m-4 rounded"
                    onClick={collapseToggler}
                >
                    {collapse === '' ? (
                        <Icon fafa="faChevronDown" />
                    ) : (
                        <Icon fafa="faChevronUp" />
                    )}
                </div>
            </div>
            <div id="dycalendar"></div>
        </div>
    );
};
