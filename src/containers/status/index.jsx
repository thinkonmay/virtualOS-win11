import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { CLIENT } from '../../../src-tauri/singleton';
import { useAppSelector } from '../../backend/reducers';
import { localStorageKey } from '../../backend/utils/constant';
import { PaidTutorial } from '../../components/onboarding/paidUser';
import './status.scss';

export const Status = () => {
    const [videoConnectivity, setVideoConnectivity] = useState('not started');
    const [audioConnectivity, setAudioConnectivity] = useState('not started');
    const [isOpenStats, setOpenStats] = useState(false);
    const pinging = useAppSelector((state) => state.remote.ping_status);

    const userCreatedAt = useAppSelector(
        (state) => state.user.subscription?.created_at
    );

    const createDate = dayjs(userCreatedAt);
    const targetDate = dayjs('2024-12-01 00:18');

    const isAfter = createDate > targetDate;

    useEffect(() => {
        const interval = setInterval(() => {
            setVideoConnectivity(CLIENT.Metrics.video.status);
            setAudioConnectivity(CLIENT.Metrics.audio.status);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        setOpenStats(
            videoConnectivity == 'connecting' ||
                videoConnectivity == 'close' ||
                !pinging
        );
    }, [audioConnectivity, videoConnectivity, pinging]);

    //useEffect(() => {
    //    if (
    //        localStorage.getItem(localStorageKey.shownPaidUserTutorial) != 'true'
    //        && videoConnectivity == 'connected'
    //        && audioConnectivity == 'connected'

    //    ) {
    //        appDispatch(show_tutorial('PaidTutorial'));
    //    }

    //}, [audioConnectivity, videoConnectivity])

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
                        <br />
                        Ping: <b>{pinging ? 'TRUE' : 'FALSE'}</b>
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

            {localStorage.getItem(localStorageKey.shownPaidUserTutorial) !=
                'true' && videoConnectivity == 'connected' ? (
                <PaidTutorial />
            ) : null}
        </>
    );
};
