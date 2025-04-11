import {
    appDispatch,
    app_toggle,
    fetch_configuration,
    popup_open,
    show_chat,
    useAppSelector,
    wait_and_claim_volume,
    worker_refresh_ui
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';
import { useEffect, useState } from 'react';
import {
    popup_close,
    toggle_hide_vm,
    toggle_high_mtu,
    toggle_high_queue,
    toggle_hq
} from '../../../backend/reducers';
import { create_or_replace_resources } from '../../../backend/actions';

import { Contents } from '../../../backend/reducers/locales';
import { detectBrowserAndOS } from '../../../backend/utils/detectBrower';
import './assets/connect.scss';
import { preload } from '../../../backend/actions/background';
import toast from 'react-hot-toast';

export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const [customizing, openCustomization] = useState(false);
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

    const connect = () =>
        reach_time_limit
            ? appDispatch(limit('time_limit'))
            : reach_date_limit
              ? appDispatch(limit('date_limit'))
              : appDispatch(wait_and_claim_volume());

    const pay = () => appDispatch(app_toggle('payment'));
    const reload = () => appDispatch(worker_refresh_ui());
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
                            {available == 'ready' || available == 'started' ? (
                                <>
                                    <button
                                        onClick={connect}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-full"
                                    >
                                        {available == 'ready'
                                            ? t[Contents.CA_TURN_ON_PC]
                                            : t[Contents.CA_CONNECT]}
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
                                        onClick={reload}
                                        className="bg-blue-600 text-white text-xl font-light mb-3 h-12 rounded-2xl"
                                    >
                                        {t[Contents.CA_RELOAD_TRY_AGAIN]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        Hãy nhắn hỗ trợ nếu đợi quá 5'!
                                    </p>
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
    const { HideVM, HighQueue, HighMTU, metadata } = useAppSelector(
        (state) => state.worker
    );

    const { configuration } = metadata ?? { configuration: {} };

    const hq = useAppSelector((state) => state.remote.hq);

    const actions = [
        {
            name: t[Contents.HIDE_VM],
            state: HideVM,
            action: () => appDispatch(toggle_hide_vm())
        },
        {
            name: t[Contents.HIGH_MTU],
            state: HighMTU,
            action: () => appDispatch(toggle_high_mtu())
        },
        {
            name: t[Contents.HIGH_QUEUE],
            state: HighQueue,
            action: () => appDispatch(toggle_high_queue())
        },
        {
            name: t[Contents.MAXIMUM_QUALITY],
            state: hq,
            action: () => appDispatch(toggle_hq())
        }
    ];

    const [hwOptions, setHWOption] = useState([
        {
            name: 'ram',
            min: 16,
            max: 24,
            step: 4,
            value: 16
        },
        {
            name: 'cpu',
            min: 8,
            max: 12,
            step: 2,
            value: 8
        },
        {
            name: 'disk',
            min: 150,
            max: 400,
            step: 50,
            value: 150
        }
    ]);

    const defaultVal = (configuration) => [
        {
            name: 'ram',
            min: 16,
            max: 24,
            step: 4,
            value: configuration?.ram ?? 16
        },
        {
            name: 'cpu',
            min: 8,
            max: 12,
            step: 2,
            value: configuration?.cpu ?? 8
        },
        {
            name: 'disk',
            min: configuration?.disk ?? 150,
            max: 400,
            step: 50,
            value: configuration?.disk ?? 150
        }
    ];

    const reset = () => setHWOption(defaultVal(configuration));
    useEffect(() => {
        reset();
    }, [configuration]);

    const apply = async () => {
        for (const option of hwOptions) {
            for (const def of defaultVal(configuration)) {
                if (option.name == def.name && option.value != def.value) {
                    const error = await create_or_replace_resources(
                        `${option.name}${option.value}`
                    );
                    if (error instanceof Error) {
                        appDispatch(popup_close());
                        toast(`Failed to apply your changes`, {});
                        return;
                    }
                }
            }
        }

        await appDispatch(fetch_configuration());
        toast(`Your changes is applied`, {});
        close();
    };

    const games = [
        {
            name: 'Genshin Impact',
            action: () => {}
        }
    ];

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
                    className="w-full p-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer text-center"
                >
                    {option.name}
                </label>
            </div>
        </li>
    );

    const renderGameSetting = (game, index) => (
        <li key={index}>
            <input
                type="checkbox"
                id="frontend-developer"
                name="job_title"
                value=""
                className="hidden peer"
            />
            <label
                htmlFor="frontend-developer"
                className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
            >
                {game.name}
            </label>
        </li>
    );

    const increment = (hw, up) =>
        setHWOption((old) => {
            const index = old.findIndex((x) => x.name == hw.name);
            if (index == -1) return old;
            const dup = [...old];
            const newval = dup[index].value + (up ? hw.step : -hw.step);
            if (newval > hw.max || newval < hw.min) return old;
            dup[index].value = newval;
            return dup;
        });

    const renderHWOption = (hw, index) => {
        return (
            <div key={index} className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {hw.name}
                </label>

                <div className="flex">
                    <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ">
                        {hw.value}
                    </div>
                    <div
                        onClick={() => increment(hw, false)}
                        className="bg-gray-600 ml-1 rounded-full w-8 h-8 my-auto cursor-pointer"
                    >
                        <svg
                            className="w-8 h-8 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h14"
                            />
                        </svg>
                    </div>
                    <div
                        onClick={() => increment(hw, true)}
                        className="bg-gray-600 ml-1 rounded-full w-8 h-8 my-auto cursor-pointer"
                    >
                        <svg
                            className="w-8 h-8 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h14m-7 7V5"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            id="auth-pop-up"
            tabIndex="-1"
            className="flex overflow-x-auto justify-center items-center absolute bottom-0 top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
            style={{ backdropFilter: 'blur(3px) brightness(0.5)' }}
        >
            <div
                className="fixed w-full h-full max-h-[800px] max-w-[700px] md:h-auto p-8 rounded-2xl"
                style={{ background: 'var(--fakeMica' }}
            >
                <div className="px-4 space-y-4 md:px-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col md:flex-row items-center justify-between col-span-2 space-x-3">
                            {hwOptions.map(renderHWOption)}
                        </div>
                    </div>
                    <div>
                        <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                            Advanced setting
                        </h6>
                        <ul className="flex flex-col items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:flex-row dark:bg-gray-700 dark:border-gray-600 dark:text-white list-none ">
                            {actions.map(renderOption)}
                        </ul>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Game setting
                        </label>
                        <ul className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 list-none ">
                            {games.map(renderGameSetting)}
                        </ul>
                    </div>
                </div>
                <div className="flex items-center p-6 space-x-4 rounded-b dark:border-gray-600">
                    <button
                        type="submit"
                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                        onClick={apply}
                    >
                        Apply
                    </button>
                    <button
                        type="reset"
                        className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={reset}
                    >
                        Reset
                    </button>
                    <button
                        type="reset"
                        className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={close}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
