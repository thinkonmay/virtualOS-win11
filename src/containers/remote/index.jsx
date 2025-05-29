import { useEffect, useRef } from 'react';
import {
    AudioWrapper,
    RemoteDesktopClient,
    VideoWrapper,
    isMobile
} from '../../../src-tauri/core';
import { Assign, ready } from '../../../src-tauri/singleton';
import { showConnect } from '../../backend/actions';
import {
    appDispatch,
    popup_close,
    set_fullscreen,
    toggle_objectfit,
    useAppSelector
} from '../../backend/reducers';
import './remote.scss';
import toast from 'react-hot-toast';

export const Remote = () => {
    const { active, auth, relative_mouse, fullscreen, objectFit } =
        useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);

    useEffect(() => {
        window.onbeforeunload = (e) => {
            const text = 'Are you sure (｡◕‿‿◕｡)';
            e = e || window.event;
            if (e) e.returnValue = text;
            return text;
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        if (!active || auth == undefined) return;
        if (isMobile()) appDispatch(toggle_objectfit());

        showConnect();
        setupWebRTC();
        ready().then((err) => {
            if (err instanceof Error)
                toast(err.message, {
                    icon: 'ℹ️',
                    duration: 15000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                });
            appDispatch(popup_close());
        });
    }, [active]);

    const setupWebRTC = () =>
        Assign(
            new RemoteDesktopClient(
                new VideoWrapper(remoteVideo.current, auth.videoUrl),
                new AudioWrapper(remoteAudio.current, auth.audioUrl),
                auth.dataUrl,
                auth.microUrl
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
