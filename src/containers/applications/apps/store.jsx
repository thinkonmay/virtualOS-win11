import { useEffect, useState } from 'react';
import {
    app_close,
    app_full,
    app_toggle,
    appDispatch,
    change_template,
    show_chat,
    useAppSelector
} from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/store.scss';
import { MdInfoOutline } from 'react-icons/md';
import { Contents } from '../../../backend/reducers/locales';
import { preloadSilent } from '../../../backend/actions/background';

export const MicroStore = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'store')
    );

    const games = useAppSelector((state) => state.globals.games);
    const [game, setGame] = useState(null);
    const [search, openSearch] = useState(false);
    const [confirm, openConfirm] = useState(undefined);
    const [filtered, setFilter] = useState(games);
    useEffect(() => {
        setFilter(games);
    }, [games]);
    useEffect(() => {
        if (wnapp.value?.app)
            setGame(games.find((x) => x.code_name == wnapp.value?.app));
    }, [wnapp]);

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
            <div
                className={`windowScreen relative ${
                    search || confirm != undefined ? '' : 'win11Scroll '
                }`}
            >
                {search ? (
                    <SearchBar
                        close={() => openSearch(false)}
                        setFilter={setFilter}
                    />
                ) : confirm != undefined ? (
                    <Confirmation
                        args={confirm}
                        onClose={() => openConfirm(undefined)}
                    />
                ) : null}
                <LazyComponent show={!wnapp.hide}>
                    {game != null ? (
                        <DetailPage
                            app={game}
                            close={() => setGame(null)}
                            onConfirmation={(arg) => openConfirm(arg)}
                        />
                    ) : (
                        <DownPage
                            open={setGame}
                            filtered={filtered}
                            openSearch={() => openSearch(true)}
                        />
                    )}
                </LazyComponent>
            </div>
        </div>
    );
};

const DetailPage = ({
    app: {
        code_name,
        tag: { hasaccount, samenode },
        name,
        short_description,
        path_full,
        publishers
    },
    onConfirmation,
    close
}) => {
    const t = useAppSelector((state) => state.globals.translation);
    const code = useAppSelector((state) => state.worker.metadata?.code);
    const has_subscription = useAppSelector(
        (state) => state.user.subscription != undefined
    );
    const cluster = useAppSelector((state) => state.user.subscription?.cluster);
    const currentAddress = useAppSelector(
        (state) => state.worker.currentAddress
    );
    const redirect = async () => {
        localStorage.setItem('thinkmay_domain', cluster);
        await preloadSilent();
    };
    const contact = async () => appDispatch(show_chat());
    const [options, setOptions] = useState([
        ...(code_name != null
            ? [
                  {
                      code: 'payment',
                      name: 'Game tải sẵn (free)',
                      clicked: true
                  }
              ]
            : []),
        ...(hasaccount
            ? [
                  {
                      code: 'kickey',
                      name: 'Tài khoản game',
                      clicked: true
                  }
              ]
            : [])
    ]);

    const handleDownload = () =>
        onConfirmation({
            template: code_name
        });
    const handlePayment = () =>
        appDispatch(
            app_full({
                id: 'payment',
                page: 'subscription',
                value: {
                    template: {
                        name,
                        code_name
                    },
                    additional: [
                        ...(options.find((x) => x.code == 'kickey')?.clicked
                            ? ['kickey']
                            : [])
                    ]
                }
            })
        );

    const connect = () => {
        appDispatch(app_toggle('connectPc'));
        appDispatch(app_close('store'));
    };

    const renderOption = (val, index) => {
        const [clicked, setClicked] = useState(true);
        useEffect(() => {
            setOptions((old) => {
                old[index].clicked = clicked;
                return old;
            });
        }, [clicked]);
        return (
            <button
                key={index}
                onClick={() => setClicked((old) => !old)}
                className={`col-span-3 text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900  flex items-center rounded-full justify-center transition-all duration-300 ${
                    clicked ? 'bg-gray-600 text-white ' : ''
                }`}
            >
                {val.name}
            </button>
        );
    };

    return (
        <section className="relative text-white p-20 max-md:p-3">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
                    <div className="data w-full lg:pr-8 pr-0 xl:justify-end justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                        <div className="data w-full max-w-xl">
                            <p className="text-lg font-medium leading-8 text-blue-600 mb-4">
                                Game
                            </p>
                            <h2 className="font-manrope font-bold text-3xl leading-10 text-white mb-2 capitalize">
                                {name}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                                {code == undefined ? (
                                    <h6 className="font-manrope font-semibold text-2xl leading-9 text-pr-5 sm:border-r border-gray-200 mr-5">
                                        Đăng kí thinkmay để chơi
                                    </h6>
                                ) : (
                                    <h6 className="font-manrope font-semibold text-2xl leading-9 text-pr-5 sm:border-r border-gray-200 mr-5">
                                        Tải game miễn phí
                                    </h6>
                                )}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clipPath="url(#clip0_12029_1640)">
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
                                            <g clipPath="url(#clip0_12029_1640)">
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
                                            <g clipPath="url(#clip0_12029_1640)">
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
                                            <g clipPath="url(#clip0_12029_1640)">
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
                                            <g clipPath="url(#clip0_8480_66029)">
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
                            <p className="text-gray-300 text-base font-normal mb-5">
                                {short_description}
                            </p>
                            <ul className="grid gap-y-4 mb-8">
                                {publishers.map((x, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
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
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="font-normal text-base text-white ">
                                            {x}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {options.length > 0 ? (
                                <>
                                    <p className="text-white text-lg leading-8 font-medium mb-4">
                                        Các gói dịch vụ đi kèm
                                    </p>
                                    <div className="w-full pb-8 border-b border-gray-100 flex-wrap">
                                        <div className="grid grid-cols-3 min-[400px]:grid-cols-6 gap-3 max-w-md">
                                            {options.map(renderOption)}
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={close}
                                    className="group py-4 px-5 rounded-full bg-blue-50 text-blue-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-blue-100"
                                >
                                    Quay lại
                                </button>
                                {has_subscription ? (
                                    code == null ? (
                                        cluster != currentAddress ? (
                                            <button
                                                onClick={redirect}
                                                className="text-center w-full px-5 py-4 rounded-[100px] bg-blue-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-blue-700 hover:shadow-blue-400"
                                            >
                                                Về server của mình
                                            </button>
                                        ) : (
                                            <button
                                                onClick={contact}
                                                className="text-center w-full px-5 py-4 rounded-[100px] bg-blue-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-blue-700 hover:shadow-blue-400"
                                            >
                                                Dữ liệu chưa được khởi tạo
                                            </button>
                                        )
                                    ) : code_name == code ? (
                                        <button
                                            onClick={connect}
                                            className="text-center w-full px-5 py-4 rounded-[100px] bg-blue-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-blue-700 hover:shadow-blue-400"
                                        >
                                            Bật máy
                                        </button>
                                    ) : samenode ? (
                                        <button
                                            onClick={handleDownload}
                                            className="text-center w-full px-5 py-4 rounded-[100px] bg-blue-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-blue-700 hover:shadow-blue-400"
                                        >
                                            Cài đặt
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                appDispatch(show_chat())
                                            }
                                            className="text-center w-full px-5 py-4 rounded-[100px] bg-blue-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-blue-700 hover:shadow-blue-400"
                                        >
                                            Liên hệ để cài đặt
                                        </button>
                                    )
                                ) : (
                                    <button
                                        onClick={handlePayment}
                                        className="text-center w-full px-5 py-4 rounded-[100px] bg-blue-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-blue-700 hover:shadow-blue-400"
                                    >
                                        Đăng kí
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="img flex justify-start max-lg:justify-center">
                        <div className="img-box h-[720px] max-lg:h-[480px] max-lg:mx-auto">
                            <img
                                src={path_full}
                                alt="Yellow Tropical Printed Shirt image"
                                className="max-lg:mx-auto lg:ml-auto h-full object-cover rounded-3xl transition-all"
                            ></img>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const DownPage = ({ open, openSearch, filtered }) => {
    return (
        <>
            <div className="py-24 relative mx-3 max-w-50">
                <div className="w-full x-6 lg:px-8 mx-auto">
                    <div className="flex items-center justify-center flex-col gap-5 mb-14">
                        <h2 className="font-manrope font-bold text-4xl text-white text-center">
                            Thinkmay game store
                        </h2>
                        <p className="text-lg font-normal text-gray-500 max-w-3xl mx-auto text-center">
                            Khám phá kho game trên Thinkmay cloudPC.
                        </p>
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-xl px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-800"
                            onClick={openSearch}
                        >
                            Tìm game theo yêu cầu
                        </button>
                    </div>
                    <div className="flex items-center justify-center flex-col gap-5 mb-14">
                        <div className="grid row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14 max-w-screen-2xl">
                            {filtered
                                .filter((x) => x.path_full != null)
                                .map((game, index) => (
                                    <div
                                        key={index}
                                        onClick={() => open(game)}
                                        className={`${
                                            index == 0
                                                ? 'sm:col-span-2 sm:row-span-2'
                                                : index == 1
                                                  ? 'sm:col-span-2 sm:row-span-1'
                                                  : 'sm:col-span-1 sm:row-span-1'
                                        }  bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity`}
                                        style={{
                                            backgroundImage: `url(${game.path_full})`
                                        }}
                                    >
                                        <h6 className="font-bold text-3xl leading-8 text-white mb-4">
                                            {game.name}
                                        </h6>
                                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white h-30">
                                            {game.short_description}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const SearchBar = ({ close, setFilter }) => {
    const games = useAppSelector((state) => state.globals.games);
    const filter = [
        {
            name: 'Có sẵn account',
            func: (arr) => arr.filter((x) => x.tag.hasaccount)
        },
        {
            name: 'Đã được download',
            func: (arr) => arr.filter((x) => x.tag.samenode)
        }
    ];

    const [activeFilter, setActiveFilter] = useState([]);
    const [searchText, setSearchText] = useState('');
    const cancel = () => {
        setActiveFilter([]);
        setSearchText('');
    };

    useEffect(() => {
        let final = games.filter((x) => x.name != null);
        for (const filter of activeFilter) final = filter.func(final);
        setFilter(
            final.filter((x) =>
                x.name.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [activeFilter, searchText]);

    const renderFilter = (filter, index) => {
        const click = () =>
            setActiveFilter((x) =>
                x.find((y) => y.name == filter.name)
                    ? x.filter((y) => y.name != filter.name)
                    : [...x, filter]
            );
        const css = activeFilter.find((x) => x.name == filter.name)
            ? 'after:left-5 bg-blue-600'
            : 'after:left-1 bg-gray-200 dark:bg-gray-700';

        return (
            <div key={index} className="flex items-center justify-between">
                <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                        />
                        <div
                            onClick={click}
                            className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4  rounded-full peer  after:content-[''] after:absolute after:top-[2px]  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${css}`}
                        ></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {filter.name}
                        </span>
                    </label>
                </div>
            </div>
        );
    };

    return (
        <div
            id="promo-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
            style={{
                backdropFilter: 'blur(3px) brightness(0.5)'
            }}
        >
            <div className="relative rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="px-4 space-y-4 md:px-6">
                        {filter.map(renderFilter)}
                        <div className="flex items-center justify-between">
                            <div className="w-full">
                                <form className="flex items-center">
                                    <label
                                        htmlFor="simple-search"
                                        className="sr-only"
                                    >
                                        Search
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="simple-search"
                                            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Search"
                                            value={searchText}
                                            onChange={(x) =>
                                                setSearchText(x.target.value)
                                            }
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-6 space-x-4 rounded-b dark:border-gray-600">
                        <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                            onClick={close}
                        >
                            Apply
                        </button>
                        <button
                            type="reset"
                            className="py-2.5 px-5 text-sm font-medium text-black focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-500 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={cancel}
                        >
                            Reset
                        </button>
                        <button
                            type="reset"
                            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={close}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Confirmation = ({ onClose, args }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const confirm = () => {
        appDispatch(change_template(args));
        onClose();
    };

    return (
        <div
            id="promo-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
            style={{
                backdropFilter: 'blur(3px) brightness(0.5)'
            }}
        >
            <div className="relative rounded-lg p-4 text-center shadow bg-gray-300 dark:bg-gray-800 dark:text-white text-black">
                <div className="relative p-4 w-full max-w-md max-h-full"></div>
                <div className="flex flex-col justify-center items-center gap-3 text-black dark:text-[#B0D0EF]">
                    <MdInfoOutline className="text-4xl text-orange-600"></MdInfoOutline>
                    <h2>{t[Contents.TA_POPUP_TITLE]}</h2>
                </div>
                <div>
                    <p className="mt-[8px] text-lg text-center">
                        {t[Contents.TA_POPUP_SUBTITLE]}
                    </p>
                </div>
                <div className="flex gap-3 justify-end mt-3 mb-2">
                    <button
                        style={{ padding: '6px 14px' }}
                        className="text-base font-medium rounded-md"
                        onClick={onClose}
                    >
                        {t[Contents.TA_POPUP_CLOSE]}
                    </button>
                    <button
                        style={{ padding: '6px 14px' }}
                        onClick={confirm}
                        className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                    >
                        {t[Contents.TA_POPUP_CONTINUE]}
                    </button>
                </div>
            </div>
        </div>
    );
};
