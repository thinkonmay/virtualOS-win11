import { APIError, CancelDeployment, POCKETBASE } from '#/api';
import { DevEnv } from '#/api/database';
import {
    appDispatch,
    popup_close,
    useAppSelector,
    worker_refresh_ui
} from '@/backend/reducers';
import { useEffect, useState } from 'react';
import { VncScreen } from 'react-vnc';

let ws = undefined;
export function deployWatch({ data: { vnc, log } }) {
    const progress = useAppSelector((state) => state.worker.progress);
    const rev = [...(progress ?? [])].reverse();
    const [logs, setLog] = useState(rev);
    const [performtime, setPerformTime] = useState({ minutes: 0, seconds: 0 });
    const url = new URL(POCKETBASE().baseURL);
    const proto = url.protocol == 'https:' ? 'wss' : 'ws';
    const vncURL = `${proto}://${url.hostname}:444${vnc}`;

    useEffect(() => {
        if (progress == undefined) return;
        setLog((logs) => [progress.at(-1), ...logs]);
    }, [progress]);

    useEffect(() => {
        ws = new WebSocket(`${proto}://${url.hostname}:444${log}`);
        ws.onmessage = async (ev) => {
            const txt = await ev.data.text();
            setLog((logs) => [txt, ...logs]);
            if (DevEnv) console.log(txt);
        };

        const timer = setInterval(() => {
            setPerformTime((prev) => {
                let totalSec = prev.minutes * 60 + prev.seconds + 1;
                let mins = Math.floor(totalSec / 60);
                let secs = totalSec % 60;
                return { minutes: mins, seconds: secs };
            });
        }, 1000);

        return () => {
            ws.close();
            clearInterval(timer);
        };
    }, []);

    const close = () => {
        ws?.close();
        CancelDeployment(new APIError('user manual cancel deployment'));
        appDispatch(worker_refresh_ui());
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
            <div className="relative w-full h-full max-w-3xl p-4 md:h-auto">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 rounded-t sm:mb-5 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Deployment preview :{' '}
                            {String(performtime.minutes).padStart(2, '0')}:
                            {String(performtime.seconds).padStart(2, '0')}/ 7:00
                            minutes
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="readEventModal"
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <VncScreen
                            url={vncURL}
                            scaleViewport
                            width="384px"
                            height="216px"
                            background="#000000"
                        />
                        <dl>
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                                Details
                            </dt>
                            <dd className="font-light text-[0.6rem] text-gray-500 dark:text-gray-400 overflow-y-auto h-56">
                                {logs.map((x, index) => (
                                    <>
                                        {x}
                                        <br />
                                    </>
                                ))}
                            </dd>
                        </dl>
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
