import { useAppSelector } from '@/backend/reducers';
import { Contents } from '@/backend/reducers/locales';
import { useEffect, useState } from 'react';

export function notify({
    data: {
        title,
        text,
        tips = true,
        loading = true,
        timeProcessing = 3.5,
        circleLoading = true,
        confirmButton = false
    }
}) {
    const close = () => appDispatch(popup_close());

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
                    className="relative rounded-lg p-4 pt-6 text-center shadow text-white"
                    style={{
                        background: 'var(--fakeMica)'
                    }}
                >
                    {circleLoading ? (
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
                    ) : null}
                    <p className="text-center text-[1.2rem] md:text-3xl mb-[16px]">
                        {title ?? 'Please wait...'}
                    </p>
                    {text ? (
                        <p className="mb-3 md:text-xl text-center"> {text} </p>
                    ) : null}
                    {loading ? (
                        <LoadingProgressBar timeProcessing={timeProcessing} />
                    ) : null}
                    {confirmButton ? (
                        <div className="items-center p-6 space-x-4 rounded-b border-gray-600">
                            <button
                                type="submit"
                                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                                onClick={close}
                            >
                                Confirm
                            </button>
                        </div>
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
