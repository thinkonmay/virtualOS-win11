import { useEffect, useRef, useState } from 'react';
import { RemoteDesktopClient } from '../../../src-tauri/core/app';
import { AudioWrapper } from '../../../src-tauri/core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../src-tauri/core/pipeline/sink/video/wrapper';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import {
    AddNotifier,
    ConnectionEvent
} from '../../../src-tauri/core/utils/log';
import { afterMath } from '../../backend/actions';
import {
    appDispatch,
    set_fullscreen,
    useAppSelector
} from '../../backend/reducers';
import { assign, client } from '../../backend/reducers/remote';
import { isMobile } from '../../backend/utils/checking';
import './remote.scss';

export const Remote = () => {
    // ConnectStatus = 'not started' | 'started' | 'connecting' | 'connected' | 'closed'
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const [isOpenStats, setOpenStats] = useState(false);
    const relative_mouse = useAppSelector((x) => x.remote.relative_mouse);
    const keyboard = useAppSelector(
        (state) => !state.sidepane.mobileControl.keyboardHide
    );
    const gamepad = useAppSelector(
        (state) => !state.sidepane.mobileControl.gamePadHide
    );
    const remote = useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

    useEffect(() => {
        if (!remote.active || remote.auth == undefined) return;

        AddNotifier(async (message, text, source) => {
            if (message == ConnectionEvent.WebRTCConnectionClosed)
                source == 'audio'
                    ? setAudioConnectivity('closed')
                    : setVideoConnectivity('closed');
            if (message == ConnectionEvent.WebRTCConnectionDoneChecking)
                source == 'audio'
                    ? setAudioConnectivity('connected')
                    : setVideoConnectivity('connected');
            if (message == ConnectionEvent.WebRTCConnectionChecking)
                source == 'audio'
                    ? setAudioConnectivity('connecting')
                    : setVideoConnectivity('connecting');

            if (message == ConnectionEvent.ApplicationStarted) {
                setAudioConnectivity('started');
                setVideoConnectivity('started');
            }
        });

        SetupWebRTC();
    }, [remote.active]);

    useEffect(() => {
        if (client == null) return;
        else if (isMobile()) client?.PointerVisible(true);

        if (keyboard || gamepad) client.hid.disable = true;
        else client.hid.disable = false;

        client.touch.mode =
            isMobile() && !keyboard
                ? gamepad
                    ? 'gamepad'
                    : 'trackpad'
                : 'none';
    }, [gamepad, keyboard]);

    const pointerlock = () => {
        appDispatch(set_fullscreen(true));
        remoteVideo.current.requestPointerLock();
    };

    const SetupWebRTC = () => {
        const video = new VideoWrapper(remoteVideo.current);
        const audio = new AudioWrapper(remoteAudio.current);
        assign(
            () =>
                new RemoteDesktopClient(
                    video,
                    audio,
                    remote.auth.signaling,
                    remote.auth.webrtc,
                    { scancode: remote.scancode }
                )
        );
    };

    return (
        <div className="relative">
            <video
                className="remote"
                ref={remoteVideo}
                onClick={relative_mouse ? pointerlock : (e) => afterMath(e)}
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
            <div
                className={`${
                    isOpenStats ? 'slide-in' : 'slide-out'
                }  statusConnection`}
            >
                <p>
                    Video: <b>{videoConnectivity}</b>
                    <br />
                    Audio: <b>{audioConnectivity}</b>
                </p>
                <button
                    className="btn-show"
                    onClick={() => setOpenStats((old) => !old)}
                >
                    {isOpenStats ? (
                        <MdArrowBackIos style={{ fontSize: '1.2rem' }} />
                    ) : (
                        <MdArrowForwardIos style={{ fontSize: '1.2rem' }} />
                    )}
                </button>
            </div>
        </div>
    );
};
