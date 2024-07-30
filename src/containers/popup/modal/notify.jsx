import { useEffect, useState } from 'react';

import { TbLoader3 } from 'react-icons/tb';
import { useAppSelector } from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';

const TIME_RUN_OUT_OF_GPU = 200 * 1000; //sec
export function notify({ data: { title, tips = true, loading = true, text, timeProcessing = 3.5 } }) {
    const t = useAppSelector((state) => state.globals.translation);
    const [textTrans, setTextTrans] = useState('');
    const [isLaterThan15s, setIsLaterThan15s] = useState(false);

    useEffect(() => {
        let interval;
        if (title == 'Connect to PC') {
            const referenceTime = new Date();
            const laterTime = new Date(
                referenceTime.getTime() + TIME_RUN_OUT_OF_GPU
            );

            interval = setInterval(() => {
                const currentTime = new Date();
                if (currentTime > laterTime) {
                    setIsLaterThan15s(true);
                    setTextTrans(t[Contents.RUN_OUT_OF_GPU_STOCK_NOTIFY]);
                    clearInterval(interval);
                }
            }, 6000);
        }

        return () => clearInterval(interval);
    }, [title]);
    useEffect(() => {
        if (t[text]) setTextTrans(t[text])

        setTextTrans(text)
    }, [text]);

    return (
        <div className="w-[330px] h-auto p-[14px] pb-6">
            <div className="notify-icon">
                <TbLoader3 className="animate-spin" />
            </div>
            <p className="text-center text-[1.2rem] mb-[16px]">
                {title ?? 'Please wait...'}
            </p>
            {textTrans ? <p className='mb-3'> {textTrans} </p> : null}
            {loading && !isLaterThan15s ? <LoadingProgressBar timeProcessing={timeProcessing} /> : null}
            {tips ? <Protip /> : null}
        </div>
    );
}

const LoadingProgressBar = ({ timeProcessing }) => {
    const [loading, setLoading] = useState(0);

    console.log(timeProcessing);
    useEffect(() => {
        const interval = setInterval(() => {
            const randomNumber = Math.floor(Math.random() * 5) + 1;
            if (loading != 100) {
                setLoading((prevLoading) =>
                    prevLoading < 94 ? prevLoading + randomNumber : 99
                );
            }
        }, timeProcessing * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [loading]);

    return (
        <div className="loading-container !relative">
            <div className="loading-bar">
                <div
                    className="loading-progress"
                    style={{ width: `${loading}%` }}
                ></div>
            </div>
            <p className="loading-text">{true ? `${loading}%` : ''}</p>
        </div>
    );
};

const Protip = () => {
    const t = useAppSelector((state) => state.globals.translation);

    const [currentTip, setCurrentTip] = useState(0);

    const QUANTITY_TIP = 4;

    const listDemoTip = [
        t[Contents.PRO_TIP_DEMO_0],
        t[Contents.PRO_TIP_DEMO_1],
        t[Contents.PRO_TIP_DEMO_2],
        t[Contents.PRO_TIP_DEMO_3]
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const randomNumber = Math.floor(Math.random() * QUANTITY_TIP);

            setCurrentTip(randomNumber);
        }, 5 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className="mt-[24px]">
            <strong>Pro tip:</strong>
            <p className="mt-[8px]">{listDemoTip[currentTip]}</p>
        </div>
    );
};
