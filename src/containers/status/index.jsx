import { useEffect, useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { AddNotifier, ConnectionEvent } from '../../../src-tauri/core';
import { useAppSelector } from '../../backend/reducers';
import './status.scss';

export const Status = () => {
    // ConnectStatus = 'not started' | 'started' | 'connecting' | 'connected' | 'closed'
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const [isOpenStats, setOpenStats] = useState(false);
    const remote = useAppSelector((store) => store.remote);

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
    }, [remote.active]);

    return (
        <div className="relative">
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
