import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';

export function notify({
    data: { title, tips = true, loading = true, text, timeProcessing = 3.5 }
}) {
    const t = useAppSelector((state) => state.globals.translation);

    return (
        <div
            id="promo-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
            style={{
                backdropFilter: 'brightness(0.3)'
            }}
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div
                    className="relative rounded-lg p-4 text-center shadow text-white"
                    style={{
                        background: 'var(--fakeMica)'
                    }}
                >
                    <div className="mt-4" id="loader">
                        <svg
                            className="progressRing"
                            height={48}
                            width={48}
                            viewBox="0 0 16 16"
                        >
                            <circle cx="8px" cy="8px" r="7px"></circle>
                        </svg>
                    </div>
                    <p className="text-center text-[1.2rem] md:text-3xl mb-[16px]">
                        {title ?? 'Please wait...'}
                    </p>
                    {text ? (
                        <p className="mb-3 md:text-xl text-center"> {text} </p>
                    ) : null}
                    {loading ? (
                        <LoadingProgressBar timeProcessing={timeProcessing} />
                    ) : null}
                    {tips ? <Protip /> : null}
                </div>
            </div>
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
