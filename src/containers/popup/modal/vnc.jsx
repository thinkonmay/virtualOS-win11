import { appDispatch, popup_close } from '@/backend/reducers';
import { VncScreen } from 'react-vnc';

export function vnc({ data: { vnc } }) {
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
            <div className="relative w-[920px] h-[500px] p-4 md:h-auto">
                <div className="relative  p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="grid ">
                        <VncScreen
                            url={vnc}
                            scaleViewport
                            style={{
                                width: '854px',
                                height: '480px'
                            }}
                            background="#000000"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                            onClick={close}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5 mr-1.5 -ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
