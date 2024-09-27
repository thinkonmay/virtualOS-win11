import { useEffect, useRef, useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { RemoteDesktopClient } from '../../../src-tauri/core/app';
import { AudioWrapper } from '../../../src-tauri/core/pipeline/sink/audio/wrapper';
import { VideoWrapper } from '../../../src-tauri/core/pipeline/sink/video/wrapper';
import {
    AddNotifier,
    ConnectionEvent
} from '../../../src-tauri/core/utils/log';
import { afterMath } from '../../backend/actions';
import {
    appDispatch,
    hard_reset_async,
    set_fullscreen,
    useAppSelector
} from '../../backend/reducers';
import { assign, client } from '../../backend/reducers/remote';
import { isMobile } from '../../backend/utils/checking';
import './remote.scss';

export const Remote = () => {
    const relative_mouse = useAppSelector((x) => x.remote.relative_mouse);
    const wall = useAppSelector((state) => state.wallpaper);
    const keyboard = useAppSelector(
        (state) => !state.sidepane.mobileControl.keyboardHide
    );
    const gamepad = useAppSelector(
        (state) => !state.sidepane.mobileControl.gamePadHide
    );

    // ConnectStatus = 'not started' | 'started' | 'connecting' | 'connected' | 'closed'
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const [isOpenStats, setOpenStats] = useState(true);
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
                //await TurnOnConfirm(message, text)
                setAudioConnectivity('started');
                setVideoConnectivity('started');
            }

            //Log(LogLevel.Infor,`${message} ${text ?? ""} ${source ?? ""}`)
        });

        SetupWebRTC();
    }, [remote.active]);

    //useEffect(() => {
    //    const got_stuck_one = () => {
    //        return ((['started', 'closed'].includes(videoConnectivity) && audioConnectivity == 'connected') ||
    //            (['started', 'closed'].includes(audioConnectivity) && videoConnectivity == 'connected'))
    //    }
    //    const got_stuck_both = () => {
    //        return (['started', 'closed'].includes(videoConnectivity) &&
    //            ['started', 'closed'].includes(audioConnectivity))
    //    }

    //    const check_connection = () => {
    //        if (got_stuck_one() || got_stuck_both())
    //            SetupWebRTC()
    //    }

    //    if (got_stuck_one() || got_stuck_both()) {
    //        console.log('stuck condition happended, retry after 5s')
    //        const interval = setTimeout(check_connection, 7 * 1000)
    //        return () => { clearTimeout(interval) }
    //    }

    //}, [videoConnectivity, audioConnectivity])
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

    const HandleSuggestion = () => {
        let elem = '';
        if (videoConnectivity == 'closed' && audioConnectivity == 'closed') {
            return (
                <div className="mt-4 flex gap-2 items-center">
                    <button
                        onClick={() => appDispatch(hard_reset_async())}
                        className="instbtn"
                    >
                        Reset
                    </button>
                    hoặc bật lại máy nếu <b>5'</b> chưa có hình & tiếng
                </div>
            );
        }
        if (videoConnectivity == 'closed' || audioConnectivity == 'closed') {
            return (
                <div className="mt-4 flex gap-2 items-center">
                    <button
                        onClick={() => appDispatch(hard_reset_async())}
                        className="instbtn"
                    >
                        Reset
                    </button>
                    nếu sau <b>3'</b> chưa có hình hoặc tiếng
                </div>
            );
        }
    };

    return (
        <div className="relative">
            <video
                className="remote"
                ref={remoteVideo}
                onClick={
                    relative_mouse
                        ? pointerlock
                        : (e) => {
                              afterMath(e);
                          }
                }
                //style={{ backgroundImage: `url(img/wallpaper/${wall.src})` }}
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
                <HandleSuggestion />
            </div>
        </div>
    );
};
