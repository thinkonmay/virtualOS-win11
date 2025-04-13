import { useEffect, useRef } from 'react';
import { MdOutlineKeyboard, MdOutlineSportsEsports } from 'react-icons/md';
import {
    AudioWrapper,
    RemoteDesktopClient,
    VideoWrapper,
    isMobile
} from '../../../src-tauri/core';
import {
    Assign,
    CLIENT,
    ready,
    virtMouseWheel
} from '../../../src-tauri/singleton';
import {
    appDispatch,
    popup_close,
    set_fullscreen,
    toggle_gamepad,
    toggle_keyboard,
    toggle_objectfit,
    useAppSelector
} from '../../backend/reducers';
import { Icon } from '../../components/shared/general';
import { VirtualGamepad } from './control/gamepad';
import GamingKeyboard from './control/gamingKeyboard';
import { VirtKeyboard } from './control/keyboard';
import './remote.scss';
import { showConnect } from '../../backend/actions';

export const Remote = () => {
    const keyboard = useAppSelector(
        (state) => !state.sidepane.mobileControl.keyboardHide
    );
    const gamingKeyboard = useAppSelector(
        (state) => state.sidepane.mobileControl.gamingKeyBoard.open
    );
    const gamepad = useAppSelector(
        (state) => !state.sidepane.mobileControl.gamePadHide
    );
    const draggable = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.draggable
    );
    const { active, auth, relative_mouse, fullscreen, objectFit } =
        useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

    useEffect(() => {
        if (!active || auth == undefined) return;
        if (isMobile()) appDispatch(toggle_objectfit());

        showConnect();
        setupWebRTC();
        ready().then(() => appDispatch(popup_close()));
    }, [active]);

    useEffect(() => {
        if (CLIENT)
            CLIENT.touch.touch_callback = async () => {
                if (keyboard && CLIENT.touch.mode == 'none')
                    appDispatch(toggle_keyboard());
            };
    }, [keyboard]);

    const setupWebRTC = () =>
        Assign(
            new RemoteDesktopClient(
                new VideoWrapper(remoteVideo.current, auth.videoUrl),
                new AudioWrapper(remoteAudio.current, auth.audioUrl),
                auth.dataUrl
            )
        );

    const pointerlock = () => {
        if (!fullscreen) appDispatch(set_fullscreen(true));
        if (
            !(
                document.pointerLockElement != null ||
                document.mozPointerLockElement != null ||
                document.webkitPointerLockElement != null
            )
        )
            remoteVideo.current.requestPointerLock();
    };
    return (
        <div className="relative">
            {isMobile() ? (
                keyboard ? (
                    <VirtKeyboard />
                ) : gamepad || draggable ? (
                    <VirtualGamepad />
                ) : gamingKeyboard ? (
                    <GamingKeyboard />
                ) : (
                    <Plugin></Plugin>
                )
            ) : null}

            <video
                className="remote"
                ref={remoteVideo}
                onClick={relative_mouse ? pointerlock : null}
                autoPlay
                muted
                playsInline
                loop
                style={{
                    objectFit: objectFit
                }}
            ></video>
            <audio
                ref={remoteAudio}
                autoPlay={true}
                playsInline={true}
                controls={false}
                muted={false}
                loop={true}
                style={{ zIndex: -5, opacity: 0 }}
            ></audio>
        </div>
    );
};

const Plugin = () => {
    return (
        <>
            <div
                onClick={() => {
                    appDispatch(toggle_keyboard());
                }}
                className="z-10 absolute bottom-5 right-4 flex items-center justify-center rounded-sm bg-[#212121c4] w-[32px] h-[24px] text-[#ffffffe6]"
            >
                <MdOutlineKeyboard fontSize={'1.4rem'} />
            </div>
            <div
                onClick={() => {
                    appDispatch(toggle_gamepad());
                }}
                className="z-10 absolute bottom-5 left-4 flex items-center justify-center rounded-sm bg-[#212121c4] w-[32px] h-[24px] text-[#ffffffe6]"
            >
                <MdOutlineSportsEsports fontSize={'1.4rem'} />
            </div>

            <div className="z-10 absolute bottom-[40%]  right-4 flex flex-col gap-4">
                <button
                    className="py-2 rounded-md bg-[#212121c4]"
                    onClick={() => {
                        virtMouseWheel(-150);
                    }}
                >
                    <Icon src="mouseUp" width={32} />
                </button>

                <button
                    className="py-2 rounded-md bg-[#212121c4]"
                    onClick={() => {
                        virtMouseWheel(150);
                    }}
                >
                    <Icon src="mouseDown" width={32} />
                </button>
            </div>
        </>
    );
};
