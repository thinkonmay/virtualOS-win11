import { useEffect, useState } from 'react';

import { TbLoader3 } from 'react-icons/tb';
import { useAppSelector } from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';

export function notify({
    data: { title, tips = true, loading = true, text, timeProcessing = 3.5 }
}) {
    const t = useAppSelector((state) => state.globals.translation);
    return (
        <div className="w-[330px] md:w-[440px] h-auto p-[14px] md:p-[24px] pb-6 md:pb-8">
            <div className="notify-icon">
                <TbLoader3 className="animate-spin" />
            </div>
            <p className="text-center text-[1.2rem] md:text-3xl mb-[16px]">
                {title ?? 'Please wait...'}
            </p>
            {text ? <p className="mb-3 md:text-xl text-center"> {text} </p> : null}
            {loading ? (
                <LoadingProgressBar timeProcessing={timeProcessing} />
            ) : null}
            {tips ? <Protip /> : null}
        </div>
    );
}

const LoadingProgressBar = ({ timeProcessing }) => {
    const [loading, setLoading] = useState(0);

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
            <div className="loading-bar relative">
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
        const interval = setInterval(
            () => setCurrentTip(Math.floor(Math.random() * QUANTITY_TIP)),
            5 * 1000
        );

        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className="mt-[24px]">
            <strong className="md:text-xl">Pro tip:</strong>
            <p className="mt-[8px]">{listDemoTip[currentTip]}</p>
        </div>
    );
};
