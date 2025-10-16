import { CloseStreaming } from '#/singleton';
import { appDispatch, popup_close, useAppSelector } from '@/backend/reducers';
import { Contents } from '@/backend/reducers/locales';
import { Routing } from '@/containers/applications/apps/assets/DomainSwitch';
import { useEffect, useState } from 'react';

export function connecting() {
    const close = () => {
        CloseStreaming();
        appDispatch(popup_close());
    };
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
                        Connecting video
                    </p>
                    <Routing />
                    <div className="items-center p-6 space-x-4 rounded-b border-gray-600">
                        <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                            onClick={close}
                        >
                            Cancel
                        </button>
                    </div>
                    <Protip />
                </div>
            </div>
        </div>
    );
}

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
