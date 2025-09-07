import { useEffect, useState } from 'react';
import { GetAudioMetric, GetVideoMetric } from '../../../src-tauri/singleton';
import {
    appDispatch,
    set_status_connection,
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
            setVideoConnectivity(GetVideoMetric().status);
            setAudioConnectivity(GetAudioMetric().status);
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
