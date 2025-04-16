import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { UserEvents } from '../src-tauri/api';
import { originalurl, PreloadBackground } from './backend/actions/background';
import { afterMath } from './backend/actions/index';

import {
    appDispatch,
    menu_show,
    pointer_lock,
    set_fullscreen,
    useAppSelector
} from './backend/reducers';
import { Contents } from './backend/reducers/locales';
import ActMenu from './components/menu';
import { Tutorial } from './components/onboarding/tutorial';
import { DesktopApp, SidePane, StartMenu } from './components/start';
import Taskbar from './components/taskbar';
import * as Applications from './containers/applications';
import { Background, BootScreen } from './containers/background';
import Popup from './containers/popup';
import { login as Login } from './containers/popup/modal/login';
import { Remote } from './containers/remote';
import { Status } from './containers/status';
import { ErrorFallback } from './error';
import './index.css';

function App() {
    document.body.dataset.theme = 'dark';
    const align = useAppSelector((state) => state.taskbar.align);
    const remote = useAppSelector((x) => x.remote);
    const loggedIn = useAppSelector((state) => state.user.email != '');
    const tutorial = useAppSelector((state) => state.globals.tutorial);
    const pointerLock = useAppSelector((state) => state.remote.pointer_lock);
    const [booting, setLockscreen] = useState(true);
    const [loadingText, setloadingText] = useState(Contents.BOOTING);

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

    useEffect(() => {
        window.OpenWidget.call('minimize');
        window.onbeforeunload = (e) => {
            const text = 'Are you sure (｡◕‿‿◕｡)';
            e = e || window.event;
            if (e) e.returnValue = text;
            return text;
        };

        const now = () => new Date().getTime();
        const start_fetch = now();
        PreloadBackground().finally(async () => {
            const finish_fetch = now();
            const interval = finish_fetch - start_fetch;
            UserEvents({ type: 'preload/finish', payload: { interval } });
            setLockscreen(false);
        });
    }, []);

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
        if (tutorial) window.onclick = null;
        else if (remote.active) {
            window.onclick = null;
            window.oncontextmenu = (ev) => ev.preventDefault();
        } else {
            window.oncontextmenu = ctxmenu;
            window.onclick = afterMath;
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

        const UIStateLoop = setInterval(handleState, 500);
        return () => {
            clearInterval(UIStateLoop);
        };
    }, [remote.fullscreen, tutorial, remote.active]);

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

        const UIStateLoop = setInterval(handleState, 500);
        return () => {
            clearInterval(UIStateLoop);
        };
    }, [remote.pointer_lock]);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {booting ? (
                    <BootScreen loadingText={loadingText} />
                ) : (
                    <>
                        <Login loading={setLockscreen} />
                        <Popup />
                    </>
                )}
                <div className="appwrap ">
                    {pointerLock ? null : (
                        <>
                            <Taskbar />
                            <ActMenu />
                            <StartMenu />
                            <SidePane />
                            <Tutorial />
                            <Toaster
                                position={
                                    align == 'left'
                                        ? 'bottom-right'
                                        : 'top-right'
                                }
                            />
                        </>
                    )}
                    {remote.active && !pointerLock ? <Status /> : null}
                    {remote.active && loggedIn ? (
                        <Remote />
                    ) : (
                        <>
                            <Background />
                            <div
                                className="desktop"
                                data-align={align}
                                data-menu="desk"
                            >
                                <DesktopApp />
                                {Object.keys(Applications).map((key, idx) => {
                                    var WinApp = Applications[key];
                                    return <WinApp key={idx} />;
                                })}
                            </div>
                        </>
                    )}
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default App;
