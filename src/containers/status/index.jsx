import { useEffect, useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { CLIENT } from '../../../src-tauri/singleton';
import './status.scss';

export const Status = () => {
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const [isOpenStats, setOpenStats] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setVideoConnectivity(CLIENT.Metrics.video.status);
            setAudioConnectivity(CLIENT.Metrics.audio.status);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

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
