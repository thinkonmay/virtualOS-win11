import { MdCheckCircleOutline, MdContentCopy } from 'react-icons/md';
import { appDispatch, popup_close } from '../../../backend/reducers';
import { useState } from 'react';

export function share({ data: { ref, discount_code } }) {
    const close = () => appDispatch(popup_close());
    const [isSuccess, setSuccess] = useState(false);
    const [url, setURL] = useState('');

    const handleCopy = () => {
        setSuccess(true);
        navigator.clipboard.writeText(url);
        setTimeout(() => {
            setSuccess(false);
        }, 1500);
    };
    const finishShare = () => {
        close();
    };

    return (
        <div
            id="promo-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
            style={{
                backdropFilter: 'blur(3px) brightness(0.5)'
            }}
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
                    <img
                        src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/promo-banner.jpg"
                        className="mb-4 h-36 w-full rounded bg-cover"
                        alt="promo banner"
                    />
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
                        Today's offer
                    </span>
                    <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                            Mời bạn bè đăng kí Thinkmay
                            <br />
                            để nhận được mã khuyến mại
                        </h3>
                        <p className="text-sm">
                            Chia sẻ Thinkmay tới bạn bè bằng cách share đường
                            link sau
                        </p>
                    </div>
                    <div className="mb-4 space-y-2">
                        <div className="flex justify-between gap-3 items-center rounded-lg p-2 bg-gray-600">
                            <div className="text-white">
                                <p className="line-clamp-1 text-sm">{url}</p>
                            </div>
                            <button className=" bg-slate-300 p-2 rounded-md flex justify-center items-center hover:opacity-80">
                                {!isSuccess ? (
                                    <MdContentCopy
                                        fontSize={'1.3rem'}
                                        className="text-gray-700"
                                        onClick={handleCopy}
                                    />
                                ) : (
                                    <MdCheckCircleOutline
                                        fontSize={'1.3rem'}
                                        className="text-gray-700"
                                    />
                                )}
                            </button>
                        </div>
                        {isSuccess ? (
                            <button
                                type="submit"
                                className="w-full cursor-pointer rounded-lg bg-primary-700 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                onClick={finishShare}
                            >
                                Share to your friends
                            </button>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        id="closeModal"
                        onClick={close}
                        className="bg-transparent inline-flex text-l font-medium text-primary-700 no-underline hover:underline dark:text-primary-500 cursor-pointer"
                    >
                        No thanks
                    </button>
                </div>
            </div>
        </div>
    );
}
