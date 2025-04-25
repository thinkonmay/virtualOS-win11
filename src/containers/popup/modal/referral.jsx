import { useEffect, useState } from 'react';
import { isMobile } from '../../../../src-tauri/core';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { originalurl } from '../../../backend/actions/background';

export function shareBanner() {
    const close = () => appDispatch(popup_close());
    const email = useAppSelector((state) => state.user.email);
    const ref = email?.split('@')?.[0] ?? 'share';
    const [url, setURL] = useState('');

    useEffect(() => {
        const url = new URL(originalurl.href);
        url.searchParams.set('ref', ref);
        setURL(url.toString());
    }, []);

    const finishShare = async () => {
        close()
        navigator.clipboard.writeText(url);
        await navigator.share({
            title: `Chơi game ngay trên Thinkmay cùng với ${email}`,
            url
        });
    };

    return (
        <div
            id="promo-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
        >
            <div className="relative">
                <div className="relative rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
                    {isMobile() ? null : (
                        <img
                            src="img/asset/sharebanner.jpg"
                            className="mb-4 h-[288px] w-[704px] rounded bg-cover hidden md:block"
                            alt="promo banner"
                        />
                    )}
                    <span className="mb-4 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-200 dark:text-green-900">
                        <svg
                            className="-ml-1 mr-1 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        Chia sẻ ngay
                    </span>
                    <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                            Nhận ngay{' '}
                            <span className="text-blue-400">01 ngày</span> sử
                            dụng khi giới thiệu bạn bè
                        </h3>
                        <p className="text-sm">
                            Chia sẻ link giới thiệu và nhận khuyến mãi cho mỗi
                            lượt đăng kí mới
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={finishShare}
                            type="button"
                            className="py-2.5 px-5 bg-blue-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-blue-700"
                        >
                            Chia sẻ ngay
                        </button>
                        <button
                            onClick={close}
                            type="button"
                            className="py-2.5 px-5 bg-gray-300 shadow-sm rounded-full transition-all duration-500 text-base text-black font-semibold text-center w-fit block mx-auto hover:bg-blue-300"
                        >
                            Lúc khác
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
