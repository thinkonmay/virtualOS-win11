import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { preload } from './backend/actions/background';
import { afterMath } from './backend/actions/index';
import {
    appDispatch,
    direct_access,
    menu_show,
    pointer_lock,
    set_fullscreen,
    useAppSelector
} from './backend/reducers';
import { UserSession } from './backend/reducers/fetch/analytics';
import { Contents } from './backend/reducers/locales';
import { isMobile } from './backend/utils/checking';
import ActMenu from './components/menu';
import {
    DesktopApp,
    LogMaintain,
    SidePane,
    StartMenu
} from './components/start';
import { WidPane } from './components/start/widget';
import Taskbar from './components/taskbar';
import * as Applications from './containers/applications';
import { Background, BootScreen, LockScreen } from './containers/background';
import Popup from './containers/popup';
import { Remote } from './containers/remote';
import { ErrorFallback } from './error';
import './index.css';

function App() {
    ReactModal.setAppElement('#root');
    const remote = useAppSelector((x) => x.remote);
    const user = useAppSelector((state) => state.user);
    const pointerLock = useAppSelector((state) => state.remote.pointer_lock);
    const [booting, setLockscreen] = useState(true);
    const isMaintaining = useAppSelector(
        (state) => state.globals.maintenance?.isMaintaining
    );

    const ctxmenu = (e) => {
        afterMath(e);
        e.preventDefault();
        var data = {
            top: e.clientY,
            left: e.clientX
        };

        if (e.target.dataset.menu != null) {
            data.menu = e.target.dataset.menu;
            data.dataset = { ...e.target.dataset };
            if (data.menu == 'desk' && remote.active) return;

            appDispatch(menu_show(data));
        }
    };

    const [loadingText, setloadingText] = useState(Contents.BOOTING);
    useEffect(() => {
        const url = new URL(window.location.href).searchParams;
        const ref = url.get('ref');
        if (ref != null) {
            appDispatch(direct_access({ ref }));
            window.history.replaceState({}, document.title, '/' + '');
            window.onbeforeunload = (e) => {
                const text = 'Are you sure (｡◕‿‿◕｡)';
                e = e || window.event;
                if (e) e.returnValue = text;
                return text;
            };
        }

        preload().finally(async () => {
            await new Promise((r) => setTimeout(r, 1000));
            const now = new Date().getTime();
            const timeout = () => new Date().getTime() - now > 10 * 1000;
            while (
                isMobile() &&
                window.screen.width < window.screen.height &&
                !timeout()
            ) {
                setloadingText(Contents.ROTATE_PHONE);
                await new Promise((r) => setTimeout(r, 1000));
            }

            setLockscreen(false);
        });
    }, []);

    useEffect(() => {
        if (user.id == 'unknown') return;

        UserSession(user.email);
    }, [user.id]);

    const fullscreen = async () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Safari */
            await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE11 */
            await elem.msRequestFullscreen();
        }
    };

    const exitfullscreen = async () => {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE11 */
            await document.msExitFullscreen();
        }
    };

    useEffect(() => {
        if (remote.fullscreen) {
            window.onclick = null;
            window.oncontextmenu = (ev) => ev.preventDefault();
        } else {
            window.oncontextmenu = ctxmenu;
            window.onclick = (e) => {
                afterMath(e);
            };
        }

        const job = remote.fullscreen ? fullscreen() : exitfullscreen();
        job?.catch(() => {});

        const handleState = () => {
            const fullscreen =
                document.fullscreenElement != null ||
                document.webkitFullscreenElement != null ||
                document.mozFullScreenElement != null;
            if (fullscreen == remote.fullscreen) return;

            appDispatch(set_fullscreen(fullscreen));
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => clearInterval(UIStateLoop);
    }, [remote.fullscreen]);

    const exitpointerlock = () => {
        document.exitPointerLock();
    };

    useEffect(() => {
        const handleState = () => {
            const fullscreen =
                document.fullscreenElement != null ||
                document.webkitFullscreenElement != null ||
                document.mozFullScreenElement != null;
            const havingPtrLock =
                document.pointerLockElement != null ||
                document.mozPointerLockElement != null ||
                document.webkitPointerLockElement != null;

            if (!fullscreen && havingPtrLock) exitpointerlock();
            if (havingPtrLock != remote.pointer_lock)
                appDispatch(pointer_lock(havingPtrLock));
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => {
            clearInterval(UIStateLoop);
        };
    }, [remote.pointer_lock]);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {booting ? <BootScreen loadingText={loadingText} /> : null}
                {user.id == 'unknown' && !remote.active ? <LockScreen /> : null}
                <div className="appwrap ">
                    {pointerLock ? null : (
                        <>
                            <Taskbar />
                            <ActMenu />
                            <WidPane />
                            <StartMenu />
                            <SidePane />
                            <Popup />
                        </>
                    )}

                    {remote.active ? <Remote /> : <Background />}
                    {!remote.active ? (
                        <div className="desktop" data-menu="desk">
                            <DesktopApp />
                            {Object.keys(Applications).map((key, idx) => {
                                var WinApp = Applications[key];
                                return <WinApp key={idx} />;
                            })}
                        </div>
                    ) : null}
                </div>
                {isMaintaining ? <LogMaintain /> : null}
            </ErrorBoundary>
        </div>
    );
}

export default App;
