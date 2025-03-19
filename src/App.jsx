import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { UserEvents } from '../src-tauri/api';
import { isMobile } from '../src-tauri/core';
import { PreloadBackground } from './backend/actions/background';
import { afterMath } from './backend/actions/index';
import { LiveChatWidget } from '@livechat/widget-react';

import {
    appDispatch,
    app_toggle,
    direct_access,
    fetch_store,
    menu_show,
    open_game,
    pointer_lock,
    set_fullscreen,
    store,
    useAppSelector
} from './backend/reducers';
import { Contents } from './backend/reducers/locales';
import ActMenu from './components/menu';
import { PaidTutorial } from './components/onboarding/paidUser';
import { DesktopApp, SidePane, StartMenu } from './components/start';
import { ListQAs } from './components/start/listQa';
import Taskbar from './components/taskbar';
import * as Applications from './containers/applications';
import { Background, BootScreen, LockScreen } from './containers/background';
import Popup from './containers/popup';
import { Remote } from './containers/remote';
import { Status } from './containers/status';
import SubscriptionPaidStatus from './containers/status/subscriptionStatus';
import { ErrorFallback } from './error';
import './index.css';

function App() {
    ReactModal.setAppElement('#root');
    const { id } = useAppSelector((state) => state.user);
    const remote = useAppSelector((x) => x.remote);
    const tutorial = useAppSelector((state) => state.globals.tutorial);
    const pointerLock = useAppSelector((state) => state.remote.pointer_lock);
    const [booting, setLockscreen] = useState(true);
    const [loadingText, setloadingText] = useState(Contents.BOOTING);
    const [delayPayment, setDelayPayment] = useState(false);
    const showChat = useAppSelector((state) => state.globals.chat);

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
        const url = new URL(window.location.href);
        const game = url.searchParams.get('game');
        const domain = url.searchParams.get('server');
        window.LiveChatWidget.call('minimize');
        appDispatch(direct_access(url));
        window.onbeforeunload = (e) => {
            const text = 'Are you sure (｡◕‿‿◕｡)';
            e = e || window.event;
            if (e) e.returnValue = text;
            return text;
        };

        const listDomain = ['play.thinkmay.net', 'play.3.thinkmay.net'];
        const v2_domain = ['play.2.thinkmay.net', 'v4.thinkmay.net'];
        if (listDomain.includes(domain))
            window.open(`https://${domain}`, '_self');
        else if (v2_domain.includes(domain))
            localStorage.setItem('thinkmay_domain', domain);

        const waitForPhoneRotation = async () => {
            const finish_fetch = now();
            while (
                window.screen.width < window.screen.height &&
                !(now() - finish_fetch > 2 * 1000)
            ) {
                setloadingText(Contents.ROTATE_PHONE);
                await new Promise((r) => setTimeout(r, 100));
            }
        };

        let update_ui = true;
        if (url.pathname == '/payment') {
            appDispatch(app_toggle('payment'));
            setDelayPayment(true);
            update_ui = false;
        }

        if (game != null) {
            update_ui = false;
            setDelayPayment(true);
            appDispatch(fetch_store()).then(() => {
                const target = store
                    .getState()
                    .globals.games.find((x) => x.code_name == game);
                if (target != undefined) {
                    appDispatch(open_game(target));
                    appDispatch(app_toggle('store'));
                }
            });
        }

        const now = () => new Date().getTime();
        const start_fetch = now();
        PreloadBackground(update_ui).finally(async () => {
            window.history.replaceState({}, document.title, '/' + '');
            const finish_fetch = now();
            const interval = finish_fetch - start_fetch;
            UserEvents({ type: 'preload/finish', payload: { interval } });
            if (isMobile()) await waitForPhoneRotation();
            setLockscreen(false);
        });
    }, []);

    useEffect(() => {
        if (id != 'unknown' && !booting) setDelayPayment(false);
    }, [id, booting]);

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
        window.LiveChatWidget.call(showChat ? 'maximize' : 'minimize');
    }, [showChat]);

    useEffect(() => {
        if (tutorial != 'close') window.onclick = null;
        else if (remote.fullscreen) {
            window.onclick = null;
            window.oncontextmenu = (ev) => ev.preventDefault();
        } else if (!isMobile() && !remote.active) {
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
                {booting ? <BootScreen loadingText={loadingText} /> : null}
                {id == 'unknown' && !remote.active && !delayPayment ? (
                    <LockScreen />
                ) : null}
                <div className="appwrap ">
                    {pointerLock ? null : (
                        <>
                            <Taskbar />
                            <ActMenu />
                            <StartMenu />
                            <SidePane />
                            <ListQAs></ListQAs>
                            <Popup />
                            <PaidTutorial />
                            {/*<PaymentStatus />*/}
                            <SubscriptionPaidStatus />
                        </>
                    )}
                    {remote.active && !pointerLock ? <Status /> : null}
                    {remote.active ? (
                        <>
                            <Remote />
                        </>
                    ) : (
                        <>
                            <Background />
                            <div className="desktop" data-menu="desk">
                                <DesktopApp />
                                {/*{Object.keys(Tutorials)
                                    .filter((x) => x == tutorial)
                                    .map((key, idx) => {
                                        var WinApp = Tutorials[key];
                                        return <WinApp key={idx} />;
                                    })}*/}

                                {/*<Tutorials.NewTutorial />*/}
                                {Object.keys(Applications).map((key, idx) => {
                                    var WinApp = Applications[key];
                                    return <WinApp key={idx} />;
                                })}
                            </div>
                        </>
                    )}
                </div>
                <LiveChatWidget license="19084863" visibility="maximized" />
            </ErrorBoundary>
        </div>
    );
}

export default App;
