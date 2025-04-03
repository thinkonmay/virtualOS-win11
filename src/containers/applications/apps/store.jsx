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
                    <DownPage
                    // action={(app) => appDispatch(open_game(app))}
                    />
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

    return (
        <div className="detailpage w-full absolute top-0 flex">
            <div className="detailcont">
                <Image
                    className="rounded"
                    ext
                    h={100}
                    src={capsule_image}
                    absolute
                    err="img/asset/bootlogo.png"
                />
                <div className="flex flex-col items-center text-center relative">
                    <div className="text-xl font-semibold mt-4 lg:mt-6">
                        {name}
                    </div>
                    <div className="text-sm mt-4">{publisher}</div>

                    {subscribed ? (
                        volume != undefined ? (
                            volume.inuse ? (
                                <button className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]">
                                    Vui lòng tắt máy!
                                </button>
                            ) : (
                                <>
                                    <div className="flex mt-5 items-center justify-between gap-2">
                                        <button
                                            onClick={handleDownload}
                                            className=" flex-1 font-semibold text-base rounded-lg instbtn handcr !px-[12px] !py-[12px]"
                                        >
                                            {t[[Contents.TA_CRATE_NEW_PC]]}
                                        </button>
                                        <G4MarketBtn />
                                    </div>

                                    <div className="text-sm p-3  mt-6">
                                        {t[Contents.TA_CRATE_NEW_PC_NOTIFY]}
                                    </div>
                                </>
                            )
                        ) : (
                            <button className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]">
                                volume not available in pb
                            </button>
                        )
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    appDispatch(app_toggle('payment'))
                                }
                                className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]"
                            >
                                {t[Contents.TA_PAYMENT]}
                            </button>
                            <div className="text-l p-3  mt-6">
                                {t[Contents.TA_PAYMENT_DESC]}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="growcont flex flex-col">
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">Screenshots</div>
                    <div className="overflow-x-scroll win11Scroll mt-4">
                        <div className="w-max flex">
                            {screenshots?.map((img, id) => {
                                return (
                                    <div className="mr-6 relative" key={id}>
                                        <Image
                                            className="mr-2 rounded"
                                            h={600}
                                            src={img.path_full}
                                            ext
                                            err="img/asset/bootlogo.png"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs mt-4">
                        <pre>{short_description}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DownPage = ({ action }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const games = useAppSelector((state) => state.globals.games);
    const isNewUser = false;

    return (
        <div className="py-24 relative mx-3">
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
                        <a
                            href="javascript:void(0)"
                            class="inline-block w-1/2 text-center transition-all duration-500 rounded-full text-gray-400 font-semibold py-3 px-3 lg:px-11 hover:text-indigo-600 tab-active:bg-indigo-600 tab-active:rounded-full tab-active:text-white tablink whitespace-nowrap active"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
                    <div
                        className="sm:col-span-2 bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6"
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
