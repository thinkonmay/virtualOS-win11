import {
    appDispatch,
    app_full,
    app_toggle,
    cache_setting,
    change_preferred_codec,
    popup_close,
    popup_open,
    scancode_toggle,
    show_chat,
    toggle_high_mtu,
    toggle_hq,
    toggle_microphone,
    unclaim_volume,
    useAppSelector,
    wait_and_claim_volume,
    worker_refresh_ui
} from '@/backend/reducers';
import { Icon, LazyComponent, ToolBar } from '@/components/shared/general';
import { useEffect, useState } from 'react';

import { isMobile } from '#/core';
import { preload } from '@/backend/actions/background';
import { Contents } from '@/backend/reducers/locales';
import { detectBrowserAndOS } from '@/backend/utils/detectBrower';
import toast from 'react-hot-toast';
import './assets/connect.scss';

export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const [customizing, openCustomization] = useState(false);
    const [limitClick, setLimitClick] = useState(false);
    useEffect(() => {
        setTimeout(() => (limitClick ? setLimitClick(false) : {}), 2000);
    }, [limitClick]);

    useEffect(() => {
        if (customizing && isMobile())
            appDispatch(app_full({ id: 'connectPc' }));
    }, [customizing]);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const available = useAppSelector(
        (state) => state.worker.data[state.worker.currentAddress]?.availability
    );

    const { cluster, metadata } = useAppSelector(
        (state) => state.user.subscription ?? {}
    );
    const { image, name } = useAppSelector(
        (state) => state.worker.metadata ?? {}
    );
    const addr = useAppSelector((state) => state.worker.currentAddress);
    const { reach_time_limit, reach_date_limit } = metadata ?? {};
    const { browser } = detectBrowserAndOS();

    const limit = (type) =>
        popup_open({
            type: 'extendService',
            data: { type }
        });

    const connect = () => {
        if (limitClick) return;
        if (reach_time_limit) appDispatch(limit('time_limit'));
        else if (reach_date_limit) appDispatch(limit('date_limit'));
        else if (available == 'waiting_shutdown')
            appDispatch(worker_refresh_ui());
        else if (available == 'closable') {
            appDispatch(unclaim_volume());
            appDispatch(wait_and_claim_volume());
        } else appDispatch(wait_and_claim_volume());
        setLimitClick(true);
    };

    const pay = () => appDispatch(app_toggle('payment'));
    const redirect = async () => {
        localStorage.setItem('thinkmay_domain', cluster);
        await preload();
    };

    return (
        <div
            className="connectToPcApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Connect to your PC"
            />
            <div
                className="windowScreen connectAppContent flex flex-col p-[12px] pt-0 relative"
                data-dock="true"
                style={
                    image != null
                        ? {
                              backgroundImage: `url(${image})`,
                              backgroundSize: 'cover'
                          }
                        : {
                              background:
                                  'linear-gradient(180deg, #040218 0%, #140B7E 100%)'
                          }
                }
            >
                {customizing ? (
                    <Customize onClose={() => openCustomization(false)} />
                ) : null}
                <LazyComponent show={!wnapp.hide}>
                    <div className="content">
                        <div className="title">
                            <Icon src="monitor"></Icon>
                            {name}
                        </div>

                        <div className="containerSpec">
                            {!browser.includes('Chrome') ? (
                                <div className="flex flex-col gap-3">
                                    <div className="spec my-5">
                                        {t[Contents.SUGGEST_BROWSER]}
                                    </div>
                                </div>
                            ) : null}
                            {available == 'ready' ? (
                                <>
                                    <button
                                        onClick={connect}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-full shadow-transparent transition-all cursor-pointer active:bg-blue-700"
                                    >
                                        {t[Contents.CA_TURN_ON_PC]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        {t[Contents.CA_CONNECT_EXPLAIN]}
                                        <br />
                                        {t[Contents.CA_CONNECT_EXPLAIN_1]}
                                    </p>
                                    <button
                                        onClick={() => openCustomization(true)}
                                        className="text-gray-400 text-l font-light bg-transparent underline mt-4 cursor-pointer"
                                    >
                                        Tùy chỉnh cấu hình
                                    </button>
                                </>
                            ) : available == 'started' ? (
                                <>
                                    <button
                                        onClick={connect}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-full shadow-transparent transition-all cursor-pointer active:bg-blue-700"
                                    >
                                        {t[Contents.CA_CONNECT]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        {t[Contents.CA_CONNECT_EXPLAIN]}
                                        <br />
                                        {t[Contents.CA_CONNECT_EXPLAIN_1]}
                                    </p>
                                    <button
                                        onClick={() => openCustomization(true)}
                                        className="text-gray-400 text-l font-light bg-transparent underline mt-4 cursor-pointer"
                                    >
                                        Tùy chỉnh cấu hình
                                    </button>
                                </>
                            ) : available == 'no_node' ? (
                                <>
                                    <button
                                        onClick={() => appDispatch(show_chat())}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                    >
                                        {t[Contents.CA_RELOAD_TRY_AGAIN]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        Hãy nhắn hỗ trợ nếu đợi quá 5'!
                                    </p>
                                </>
                            ) : available == 'waiting_shutdown' ? (
                                <>
                                    <button
                                        onClick={connect}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                    >
                                        {t[Contents.CA_INUSE]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        Hãy nhắn hỗ trợ nếu đợi quá 5'!
                                    </p>
                                </>
                            ) : available == 'closable' ? (
                                <>
                                    <button
                                        onClick={connect}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                    >
                                        {t[Contents.CA_INUSE]}
                                    </button>
                                </>
                            ) : available == undefined ? (
                                cluster != undefined ? (
                                    cluster != addr ? (
                                        <>
                                            <button
                                                onClick={redirect}
                                                className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                            >
                                                {t[Contents.CA_WRONG_SERVER]}
                                            </button>
                                            <p className="text-xs text-center mt-3">
                                                {
                                                    t[
                                                        Contents
                                                            .CA_WRONG_SERVER_EXPLAIN
                                                    ]
                                                }
                                                !
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    appDispatch(show_chat())
                                                }
                                                className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                            >
                                                {t[Contents.CA_MISSING_VOLUME]}
                                            </button>
                                            <p className="text-xs text-center mt-3">
                                                {
                                                    t[
                                                        Contents
                                                            .CA_MISSING_VOLUME_EXPLAIN
                                                    ]
                                                }
                                                !
                                            </p>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <button
                                            onClick={pay}
                                            className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                        >
                                            {t[Contents.PAYMENT_APP]}
                                        </button>
                                        <p className="text-xs text-center mt-3">
                                            Hãy nhắn hỗ trợ nếu đã mua gói!
                                        </p>
                                    </>
                                )
                            ) : (
                                <button className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl">
                                    Very weird bug happened
                                </button>
                            )}
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

function Customize({ onClose: close }) {
    const t = useAppSelector((state) => state.globals.translation);
    const HighMTU = useAppSelector((state) => state.worker.HighMTU);
    const { scancode, hq, enable_microphone, preferred_codec } = useAppSelector(
        (state) => state.remote
    );

    const actions = [
        {
            name: t[Contents.HIGH_MTU],
            state: HighMTU,
            action: () => appDispatch(toggle_high_mtu())
        },
        {
            name: `High quality`,
            state: hq,
            action: () => appDispatch(toggle_hq())
        },
        {
            name: `Scan code`,
            state: scancode,
            action: () => appDispatch(scancode_toggle())
        },
        {
            name: `H.265 codec`,
            state: preferred_codec == 'h265',
            action: () =>
                appDispatch(
                    change_preferred_codec(
                        preferred_codec == 'h265' ? 'h264' : 'h265'
                    )
                )
        },
        {
            name: `Microphone`,
            state: enable_microphone,
            action: () => appDispatch(toggle_microphone())
        }
    ];

    const apply = async () => {
        appDispatch(
            popup_open({
                type: 'notify',
                data: {
                    loading: true
                }
            })
        );

        appDispatch(cache_setting());
        toast(`Your changes is applied`, {});
        appDispatch(popup_close());
        close();
    };

    const renderOption = (option, index) => (
        <li
            key={index}
            className="w-full border-b border-gray-200 md:border-b-0 md:border-r dark:border-gray-600"
        >
            <div
                onClick={option.action}
                className={`flex items-center mx-1 my-3 rounded-xl  cursor-pointer ${
                    option.state ? 'bg-blue-950' : 'bg-gray-600'
                }`}
            >
                <label
                    htmlFor="account-moderator"
                    className="w-full p-3 text-sm font-medium text-gray-300 cursor-pointer text-center"
                >
                    {option.name}
                </label>
            </div>
        </li>
    );

    return (
        <div
            id="auth-pop-up"
            tabIndex="-1"
            className="flex overflow-x-auto justify-center items-center absolute bottom-0 top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
            style={{ backdropFilter: 'blur(3px) brightness(0.5)' }}
        >
            <div
                className="fixed w-full h-full max-h-[800px] max-w-[700px] md:h-auto px-8 py-16 rounded-2xl"
                style={{ background: 'var(--fakeMica' }}
            >
                <div className="px-4 space-y-4 md:px-6">
                    <div>
                        <h6 className="mb-2 text-sm font-medium text-white">
                            Advanced setting
                        </h6>
                        <ul className="grid grid-cols-3 items-center w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg md:flex-row bg-gray-700 dark:border-gray-600 dark:text-white list-none ">
                            {actions.map(renderOption)}
                        </ul>
                    </div>
                </div>
                <div className="flex items-center p-6 space-x-4 rounded-b border-gray-600">
                    <button
                        type="submit"
                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                        onClick={apply}
                    >
                        Apply
                    </button>
                    <button
                        type="reset"
                        className="py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 bg-gray-900 text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={close}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
