import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CLIENT } from '../../../src-tauri/singleton';
import {
    appDispatch,
    set_status_connection,
    toggle_status_connection,
    useAppSelector
} from '../../backend/reducers';
import '../remote/remote.scss';

export const Status = () => {
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const isOpenStats = useAppSelector(
        (state) => state.sidepane.statusConnection
    );

    const sidePaneOpen = useAppSelector((state) => !state.sidepane.hide);

    useEffect(() => {
        const interval = setInterval(() => {
            setVideoConnectivity(CLIENT?.Metrics.video.status);
            setAudioConnectivity(CLIENT?.Metrics.audio.status);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    useEffect(() => {
        appDispatch(set_status_connection(sidePaneOpen));
    }, [sidePaneOpen]);
    useEffect(() => {
        appDispatch(
            set_status_connection(
                videoConnectivity == 'connecting' ||
                    videoConnectivity == 'close'
            )
        );
    }, [audioConnectivity, videoConnectivity]);

    const toggleStats = () => {
        appDispatch(toggle_status_connection());
    };
    return (
        <>
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
                </div>
            </div>
        </>
    );
};
