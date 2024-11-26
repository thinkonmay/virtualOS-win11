import { useEffect, useRef } from 'react';
import {
    AudioWrapper,
    RemoteDesktopClient,
    VideoWrapper,
    isMobile
} from '../../../src-tauri/core';
import { Assign, CLIENT } from '../../../src-tauri/singleton';
import {
    appDispatch,
    set_fullscreen,
    toggle_keyboard,
    useAppSelector
} from '../../backend/reducers';
import { VirtualGamepad } from './control/gamepad';
import { VirtKeyboard } from './control/keyboard';
import './remote.scss';

export const Remote = () => {
    const keyboard = useAppSelector(
        (state) => !state.sidepane.mobileControl.keyboardHide
    );
    const gamepad = useAppSelector(
        (state) => !state.sidepane.mobileControl.gamePadHide
    );
    const draggable = useAppSelector(
        (state) => state.sidepane.mobileControl.gamepadSetting.draggable
    );
    const { active, auth, scancode, relative_mouse, fullscreen } =
        useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);
    useEffect(() => {
        if (!active || auth == undefined) return;
        setupWebRTC();
    }, [active]);

    useEffect(() => {
        CLIENT.touch.touch_callback = async () => {
            if (keyboard && CLIENT.touch.mode == 'none')
                appDispatch(toggle_keyboard());
        };
    }, [keyboard]);

    const setupWebRTC = () =>
        Assign(
            new RemoteDesktopClient(
                new VideoWrapper(remoteVideo.current),
                new AudioWrapper(remoteAudio.current),
                auth.signaling,
                auth.webrtc,
                { scancode }
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
                ) : null
            ) : null}
            <video
                className="remote"
                ref={remoteVideo}
                onClick={relative_mouse ? pointerlock : null}
                autoPlay
                muted
                playsInline
                loop
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
