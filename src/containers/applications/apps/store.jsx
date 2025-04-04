import { useEffect, useState } from 'react';
import {
    app_toggle,
    appDispatch,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';
import {
    Image,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';
import './assets/store.scss';

export const MicroStore = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'store')
    );

    const [game, setGame] = useState(null);

    return (
        <div
            className="wnstore floatTab dpShad"
            data-size={wnapp.size}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
            id={wnapp.icon + 'App'}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name={'Template'}
            />
            <div className="windowScreen win11Scroll">
                <LazyComponent show={!wnapp.hide}>
                    {game != null ? (
                        <DetailPage app={game} close={() => setGame(null)} />
                    ) : (
                        <DownPage open={setGame} />
                    )}
                </LazyComponent>
            </div>
        </div>
    );
};

const DetailPage = ({ app, close }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const { currentAddress, data } = useAppSelector((state) => state.worker);
    const subscribed = useAppSelector(
        (state) => state.user.subscription != undefined
    );
    const volume = data[currentAddress]?.Volumes?.find(
        (x) => x.pool == 'user_data'
    );

    const { name, code_name, metadata } = app;
    const {
        capsule_image,
        short_description,
        screenshots,
        publishers: [publisher]
    } = metadata ?? {
        screenshots: [],
        publishers: []
    };

    const handleDownload = () => {
        appDispatch(
            popup_open({
                type: 'yesNo',
                data: {
                    template: code_name
                }
            })
        );
    };

    const [index,setIndex] = useState(Math.round(Math.random() * (screenshots.length - 1)));
    useEffect(() => {
        const i = setInterval(() => {
            setIndex(old => (old + 1 )% screenshots.length);
            console.log(index)
        },5000)

        return () => {
            clearInterval(i);
        };
    }, []);

    return (
        <section className="relative text-white p-20">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
                    <div className="img flex justify-end">
                        <div className="img-box h-full max-lg:mx-auto">
                            <img
                                src={screenshots?.[index]?.path_full}
                                alt="Yellow Tropical Printed Shirt image"
                                className="max-lg:mx-auto lg:ml-auto h-full object-cover rounded-3xl transition-all"
                            ></img>
                        </div>
                    </div>
                    <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                        <div className="data w-full max-w-xl">
                            <p className="text-lg font-medium leading-8 text-blue-600 mb-4">
                                Game
                            </p>
                            <h2 className="font-manrope font-bold text-3xl leading-10 text-white mb-2 capitalize">
                                {app.name}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                                {/* <h6 className="font-manrope font-semibold text-2xl leading-9 text-pr-5 sm:border-r border-gray-200 mr-5">
                                    $220
                                </h6> */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_12029_1640)">
                                                <path
                                                    d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                    fill="#FBBF24"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_12029_1640">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_12029_1640)">
                                                <path
                                                    d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                    fill="#FBBF24"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_12029_1640">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_12029_1640)">
                                                <path
                                                    d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                    fill="#FBBF24"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_12029_1640">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_12029_1640)">
                                                <path
                                                    d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                    fill="#FBBF24"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_12029_1640">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_8480_66029)">
                                                <path
                                                    d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                    fill="#F3F4F6"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_8480_66029">
                                                    <rect
                                                        width="20"
                                                        height="20"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <span className="pl-2 font-normal leading-7 text-gray-500 text-sm ">
                                        1624 review
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-base font-normal mb-5">
                                {short_description}
                            </p>
                            <ul className="grid gap-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <svg
                                        width="26"
                                        height="26"
                                        viewBox="0 0 26 26"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="26"
                                            height="26"
                                            rx="13"
                                            fill="#4F46E5"
                                        />
                                        <path
                                            d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                            stroke="white"
                                            stroke-width="1.6"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                    <span className="font-normal text-base text-white ">
                                        Branded shirt
                                    </span>
                                </li>
                            </ul>
                            <p className="text-white text-lg leading-8 font-medium mb-4">
                                Hiện có
                            </p>
                            <div className="w-full pb-8 border-b border-gray-100 flex-wrap">
                                <div className="grid grid-cols-3 min-[400px]:grid-cols-6 gap-3 max-w-md">
                                    <button className="bg-white col-span-3 text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">
                                        Tài khoản steam
                                    </button>
                                    <button className="bg-white col-span-3 text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">
                                        Dữ liệu tải sẵn
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={close} className="group py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100">
                                    Close
                                </button>
                                <button onClick={handleDownload} className="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const DownPage = ({ open }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const games = useAppSelector((state) => state.globals.games);

    return (
        <div className="py-24 relative mx-3 max-w-50">
            <div className="w-full x-6 lg:px-8 mx-auto">
                <div className="flex items-center justify-center flex-col gap-5 mb-14">
                    <h2 className="font-manrope font-bold text-4xl text-white text-center">
                        Thinkmay game store
                    </h2>
                    <p className="text-lg font-normal text-gray-500 max-w-3xl mx-auto text-center">
                        Explore a wide range of games, from action-packed
                        adventures to immersive RPGs, all at your fingertips.
                        Join our community of gamers and discover your next
                        favorite title today!
                    </p>
                    <div className="flex justify-center items-center bg-gray-100 rounded-full p-1.5 max-w-sm mx-auto">
                        <div className="bg-blue rounded-full w-20 absolute"></div>

                        <a
                            href="javascript:void(0)"
                            className="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-white font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap active bg-blue-900 hover:bg-white"
                            data-tab="tabs-with-background-1"
                            role="tab"
                        >
                            Có tài khoản
                        </a>
                        <a
                            href="javascript:void(0)"
                            className="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-gray-400 font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap"
                            data-tab="tabs-with-background-2"
                            role="tab"
                        >
                            Không có tài khoản
                        </a>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-col gap-5 mb-14">
                    <div className="grid row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14 max-w-screen-2xl">
                        {games
                            .filter((x) => x.metadata?.screenshots?.length > 0)
                            .map((game, index) => (
                                <div
                                    onClick={() => open(game)}
                                    className={`${
                                        index == 0
                                            ? 'sm:col-span-2 sm:row-span-2'
                                            : index == 1
                                              ? 'sm:col-span-2'
                                              : 'sm:col-span-1'
                                    }  bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity`}
                                    style={{
                                        backgroundImage: `url(${game.metadata?.screenshots?.[0]?.path_full})`
                                    }}
                                >
                                    <h6 className="font-bold text-3xl leading-8 text-white mb-4">
                                        {game.name}
                                    </h6>
                                    <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white h-30">
                                        {game.metadata?.short_description}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex items-center justify-center flex-col gap-5 mb-14">
                    <button className="w-200 rounded-lg py-4 px-6 text-center bg-blue-100 text-lg font-medium text-blue-600 transition-all duration-300 hover:text-white hover:bg-blue-600">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};
