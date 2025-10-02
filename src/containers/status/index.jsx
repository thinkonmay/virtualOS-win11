import { GetAudioMetric, GetVideoMetric } from '#/singleton';
import {
    appDispatch,
    set_status_connection,
    useAppSelector
} from '@/backend/reducers';
import { useEffect, useState } from 'react';
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
            const video_metrics = GetVideoMetric();
            const audio_metrics = GetAudioMetric();
            if (video_metrics != undefined)
                setVideoConnectivity(video_metrics.status);
            if (audio_metrics != undefined)
                setAudioConnectivity(audio_metrics.status);
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
