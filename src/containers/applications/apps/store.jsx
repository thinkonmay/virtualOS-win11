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

    const game = useAppSelector((state) => state.globals.opening);

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
                    {/* <DetailPage /> */}
                    <DownPage />
                    {/* <div className="storeNav h-full w-20 flex flex-col">
                        <Icon
                            icon="home"
                            onClick={() => appDispatch(open_game(null))}
                            click="page1"
                            width={20}
                            payload={game == null}
                        />
                    </div> */}

                    {/* <div className="restWindow msfull win11Scroll">
                        {game == null ? (
                        ) : (
                            <DetailPage app={game} />
                        )}
                    </div> */}
                </LazyComponent>
            </div>
        </div>
    );
};

const DetailPage = ({ app }) => {
    const not_logged_in = useAppSelector((state) => state.user.id == 'unknown');
    const subscribed = useAppSelector(
        (state) => state.user.subscription != undefined
    );
    const { currentAddress, data } = useAppSelector((state) => state.worker);

    const volume = data[currentAddress]?.Volumes?.find(
        (x) => x.pool == 'user_data'
    );

    const t = useAppSelector((state) => state.globals.translation);
    // const { name, code_name, metadata } = app;

    // const {
    //     capsule_image,
    //     short_description,
    //     screenshots,
    //     publishers: [publisher]
    // } = metadata ?? {
    //     screenshots: [],
    //     publishers: []
    // };

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

    return (
    <section class="relative text-white p-20">
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-0">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
                <div class="img flex justify-end">
                    <div class="img-box h-full max-lg:mx-auto">
                        <img src="https://pagedone.io/asset/uploads/1700471600.png" alt="Yellow Tropical Printed Shirt image"
                            class="max-lg:mx-auto lg:ml-auto h-full object-cover rounded-3xl">
                        </img>
                    </div>
                </div>
                <div
                    class="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                    <div class="data w-full max-w-xl">
                        <p class="text-lg font-medium leading-8 text-indigo-600 mb-4">Clothing &nbsp; /&nbsp; Menswear
                        </p>
                        <h2 class="font-manrope font-bold text-3xl leading-10 text-white mb-2 capitalize">Basic
                            Yellow
                            Tropical Printed Shirt</h2>
                        <div class="flex flex-col sm:flex-row sm:items-center mb-6">
                            <h6
                                class="font-manrope font-semibold text-2xl leading-9 text-pr-5 sm:border-r border-gray-200 mr-5">
                                $220</h6>
                            <div class="flex items-center gap-2">
                                <div class="flex items-center gap-1">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_12029_1640)">
                                            <path
                                                d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                fill="#FBBF24" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_12029_1640">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_12029_1640)">
                                            <path
                                                d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                fill="#FBBF24" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_12029_1640">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_12029_1640)">
                                            <path
                                                d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                fill="#FBBF24" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_12029_1640">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_12029_1640)">
                                            <path
                                                d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                fill="#FBBF24" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_12029_1640">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_8480_66029)">
                                            <path
                                                d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                fill="#F3F4F6" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_8480_66029">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                                <span class="pl-2 font-normal leading-7 text-gray-500 text-sm ">1624 review</span>
                            </div>

                        </div>
                        <p class="text-gray-500 text-base font-normal mb-5">
                            Introducing our vibrant Basic Yellow Tropical Printed Shirt - a celebration of style and
                            sunshine! Embrace the essence of summer wherever you go with this eye-catching piece that
                            effortlessly blends comfort and tropical flair. <a href="#"
                                class="text-indigo-600">More....</a>
                        </p>
                        <ul class="grid gap-y-4 mb-8">
                            <li class="flex items-center gap-3">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect width="26" height="26" rx="13" fill="#4F46E5" />
                                    <path
                                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                        stroke="white" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                <span class="font-normal text-base text-white ">Branded shirt</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect width="26" height="26" rx="13" fill="#4F46E5" />
                                    <path
                                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                        stroke="white" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                <span class="font-normal text-base text-white ">3 color shirt</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect width="26" height="26" rx="13" fill="#4F46E5" />
                                    <path
                                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                        stroke="white" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                <span class="font-normal text-base text-white ">Pure Cotton Shirt with 60% as
                                    40%</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect width="26" height="26" rx="13" fill="#4F46E5" />
                                    <path
                                        d="M7.66669 12.629L10.4289 15.3913C10.8734 15.8357 11.0956 16.0579 11.3718 16.0579C11.6479 16.0579 11.8701 15.8357 12.3146 15.3913L18.334 9.37183"
                                        stroke="white" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                <span class="font-normal text-base text-white ">all size is available</span>
                            </li>
                        </ul>
                        <p class="text-gray-900 text-lg leading-8 font-medium mb-4">Size</p>
                        <div class="w-full pb-8 border-b border-gray-100 flex-wrap">
                            <div class="grid grid-cols-3 min-[400px]:grid-cols-5 gap-3 max-w-md">
                                <button
                                    class="bg-white text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">S</button>
                                <button
                                    class="bg-white text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">M</button>
                                <button
                                    class="bg-white text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">L</button>
                                <button
                                    class="bg-white text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">XL</button>
                                <button
                                    class="bg-white text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">XXL</button>

                            </div>

                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8">
                            <div class="flex sm:items-center sm:justify-center w-full">
                                <button
                                    class="group py-4 px-6 border border-gray-400 rounded-l-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300">
                                    <svg class="stroke-gray-900 group-hover:stroke-black" width="22" height="22"
                                        viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
                                        <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                            stroke-linecap="round" />
                                    </svg>
                                </button>
                                <input type="text"
                                    class="font-semibold text-white cursor-pointer text-lg py-[13px] px-6 w-full sm:max-w-[118px] outline-0 border-y border-blue-800 bg-transparent placeholder:text-white text-center hover:bg-gray-50"
                                    placeholder="1">
                                </input>
                                <button
                                    class="group py-4 px-6 border border-gray-400 rounded-r-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300">
                                    <svg class="stroke-gray-900 group-hover:stroke-black" width="22" height="22"
                                        viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="#9CA3AF" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="black" stroke-opacity="0.2"
                                            stroke-width="1.6" stroke-linecap="round" />
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="black" stroke-opacity="0.2"
                                            stroke-width="1.6" stroke-linecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                class="group py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100">
                                <svg class="stroke-indigo-600 " width="22" height="22" viewBox="0 0 22 22" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.7394 17.875C10.7394 18.6344 10.1062 19.25 9.32511 19.25C8.54402 19.25 7.91083 18.6344 7.91083 17.875M16.3965 17.875C16.3965 18.6344 15.7633 19.25 14.9823 19.25C14.2012 19.25 13.568 18.6344 13.568 17.875M4.1394 5.5L5.46568 12.5908C5.73339 14.0221 5.86724 14.7377 6.37649 15.1605C6.88573 15.5833 7.61377 15.5833 9.06984 15.5833H15.2379C16.6941 15.5833 17.4222 15.5833 17.9314 15.1605C18.4407 14.7376 18.5745 14.0219 18.8421 12.5906L19.3564 9.84059C19.7324 7.82973 19.9203 6.8243 19.3705 6.16215C18.8207 5.5 17.7979 5.5 15.7522 5.5H4.1394ZM4.1394 5.5L3.66797 2.75"
                                        stroke="" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                Add to cart</button>
                        </div>
                        <div class="flex items-center gap-3">
                            <button
                                class="group transition-all duration-500 p-4 rounded-full bg-indigo-50 hover:bg-indigo-100 hover:shadow-sm hover:shadow-indigo-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"
                                    fill="none">
                                    <path
                                        d="M4.47084 14.3196L13.0281 22.7501L21.9599 13.9506M13.0034 5.07888C15.4786 2.64037 19.5008 2.64037 21.976 5.07888C24.4511 7.5254 24.4511 11.4799 21.9841 13.9265M12.9956 5.07888C10.5204 2.64037 6.49824 2.64037 4.02307 5.07888C1.54789 7.51738 1.54789 11.4799 4.02307 13.9184M4.02307 13.9184L4.04407 13.939M4.02307 13.9184L4.46274 14.3115"
                                        stroke="#4F46E5" stroke-width="1.6" stroke-miterlimit="10"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </button>
                            <button
                                class="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
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

const DownPage = ({ action }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const games = useAppSelector((state) => state.globals.games);
    const isNewUser = false;

    return (
        <div className="py-24 relative mx-3 max-w-50">
            <div className="w-full x-6 lg:px-8 mx-auto">
                <div className="flex items-center justify-center flex-col gap-5 mb-14">
                    <h2 className="font-manrope font-bold text-4xl text-white text-center">
                        Structural Elegance
                    </h2>
                    <p className="text-lg font-normal text-gray-500 max-w-3xl mx-auto text-center">
                        In the world of architecture or organization, structure
                        provides the backbone for a purposeful and harmonious
                        existence.
                    </p>
                    <div class="flex justify-center items-center bg-gray-100 rounded-full p-1.5 max-w-sm mx-auto">
                        <div class="bg-blue rounded-full w-20 absolute"></div>

                        <a
                            href="javascript:void(0)"
                            class="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-white font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap active bg-blue-900 hover:bg-white"
                            data-tab="tabs-with-background-1"
                            role="tab"
                        >
                            Bill Yearly
                        </a>
                        <a
                            href="javascript:void(0)"
                            class="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-gray-400 font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap"
                            data-tab="tabs-with-background-2"
                            role="tab"
                        >
                            Bill Monthly
                        </a>
                    </div>
                </div>
                <div className="grid row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
                    <div
                        className="sm:col-span-2 row-span-2 bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707712993.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            Architecture Designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            where knowledge meets innovation, and success is
                            sculpted through a blend of skill and vision.
                        </p>
                    </div>

                    <div
                        className=" bg-cover rounded-lg max-sm:h-100 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
                    </div>
                    <div
                        className=" bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6 block"
                        style={{
                            backgroundImage: `url(https://pagedone.io/asset/uploads/1707713043.png)`
                        }}
                    >
                        <h6 className="font-medium text-xl leading-8 text-white mb-4">
                            interior designer
                        </h6>
                        <p className="opacity-0 hover:opacity-100 transition-opacity text-base font-normal text-white/70">
                            crafting exceptional interiors, where aesthetics
                            meet functionality for spaces that inspire and
                            elevate.
                        </p>
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
