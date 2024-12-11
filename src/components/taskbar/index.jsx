import { useEffect, useState } from 'react';
import { MdOutlineMenuBook } from 'react-icons/md';
import useSound from 'use-sound';
import ringSound from '/audio/ring2.mp3';

import {
    MdArrowBackIos,
    MdArrowForwardIos,
    MdOutlineVideoSettings,
    MdSupportAgent
} from 'react-icons/md';

import { afterMath } from '../../backend/actions';
import {
    appDispatch,
    startogg,
    task_hide,
    task_show,
    toggleQa,
    useAppSelector
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { externalLink } from '../../backend/utils/constant';
import {
    clickDispatch,
    customClickDispatch
} from '../../backend/utils/dispatch';
import { Icon } from '../shared/general';
import './taskbar.scss';

const Taskbar = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const dispatch = appDispatch;
    const remote = useAppSelector((state) => state.remote);
    const tasks = useAppSelector((state) => state.taskbar);
    const apps = useAppSelector((state) => state.apps);
    //const open = useAppSelector((state) => !state.sidepane.hide);
    const tutorialState = useAppSelector(state => state.globals.tutorial)
    const [open, setOpen] = useState(true);
    const defaultapps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.taskbar.apps.includes(x.id))
    );
    const tempapps = useAppSelector((state) =>
        state.apps.apps
            .filter((x) => !x.hide)
            .filter((x) => defaultapps.find((y) => y.id == x.id) == undefined)
    );

    const showPrev = (event) => {
        var ele = event.target;
        while (ele && ele.getAttribute('value') == null)
            ele = ele.parentElement;

        var appPrev = ele.getAttribute('value');
        var xpos = window.scrollX + ele.getBoundingClientRect().left;

        var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

        dispatch(
            task_show({
                app: appPrev,
                pos: offsetx
            })
        );
    };

    const hidePrev = () => {
        dispatch(task_hide());
    };

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const [play] = useSound(ringSound, { volume: 0.1 });

    useEffect(() => {
        remote?.ready ? play() : null;
    }, [remote.ready]);

    const toggleControl = (e) => {
        if (tutorialState == 'PaidTutorial') return
        setOpen((old) => !old);

        //appDispatch(sidepane_panetogg());

        //appDispatch()
        afterMath(e);
    };

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

                    <div
                        id="supportNow"
                        className="p-2 prtclk handcr hvlight flex rounded "
                        // onClick={customDispatch}
                        onClick={() => window.open(externalLink.MESSAGE_LINK)}
                        data-action="sidepane/sidepane_bandtogg"
                        style={{ '--prefix': 'BAND' }}
                    >
                        <MdSupportAgent fontSize={'1.5rem'} />
                    </div>
                    <div
                        className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold rounded "
                        // onClick={clickDispatch}
                        onClick={customDispatch}
                        data-action="toggleQa"
                        style={{ '--prefix': 'QA' }}
                    >
                        <MdOutlineMenuBook fontSize={'1.2rem'} />
                        <span className="hidden md:block">Hướng dẫn</span>
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
                    style={{ '--prefix': 'TASK' }}
                >
                    <audio src={ringSound}></audio>
                    <div className="tasksCont" data-side={tasks.align}>
                        <div className="tsbar" onMouseOut={hidePrev}>
                            <div
                                style={{ '--prefix': 'START' }}
                                className="settingBtn flex items-center prtclk handcr rounded-md p-2 hvlight"
                                onClick={() => {
                                    appDispatch(startogg());
                                }}
                            >
                                <Icon
                                    className="infoBtn tsIcon tsIconInvert"
                                    src="home"
                                    width={32}
                                //click="startmenu/startogg"
                                //style={{ '--prefix': 'START' }}
                                />
                                <p className="text-xm font-semibold">
                                    Tài khoản
                                </p>
                            </div>
                            {defaultapps.map((task, i) => {
                                const isHidden = task.hide;
                                const isActive = task.z == apps.hz;
                                return (
                                    <div
                                        key={i}
                                        onMouseOver={
                                            (!isActive &&
                                                !isHidden &&
                                                showPrev) ||
                                            null
                                        }
                                        value={task.id}
                                    >
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
                                    <div
                                        key={i}
                                        onMouseOver={
                                            (!isActive && showPrev) || null
                                        }
                                        value={key.icon}
                                    >
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
                        className={`${open ? 'slide-in' : 'slide-out'
                            } taskright`}
                        data-remote={remote.active}
                    >
                        <div
                            className="supportNow p-2 prtclk handcr hvlight flex rounded "
                            // onClick={clickDispatch}
                            onClick={() =>
                                window.open(externalLink.MESSAGE_LINK)
                            }
                            data-action="sidepane/sidepane_bandtogg"
                            style={{ '--prefix': 'BAND' }}
                        >
                            <MdSupportAgent fontSize={'1.5rem'} />
                        </div>
                        <div
                            className="settingBtn p-2 prtclk handcr hvlight flex gap-2 items-center font-semibold rounded "
                            // onClick={clickDispatch}
                            id="supportNow"
                            onClick={() => appDispatch(toggleQa())}
                            data-action="sidepane/sidepane_bandtogg"
                            style={{ '--prefix': 'QA' }}
                        >
                            <MdOutlineMenuBook fontSize={'1.2rem'} />
                            <span className="hidden md:block">Hướng dẫn</span>
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
