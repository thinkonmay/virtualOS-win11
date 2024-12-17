import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdArrowForward } from 'react-icons/md';
import { login } from '../../../backend/actions';
import {
    app_toggle,
    appDispatch,
    open_game,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';
import { externalLink } from '../../../backend/utils/constant';
import {
    Icon,
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
            <div className="windowScreen flex relative">
                <LazyComponent show={!wnapp.hide}>
                    <div className="storeNav h-full w-20 flex flex-col">
                        <Icon
                            fafa="faHome"
                            onClick={() => appDispatch(open_game(null))}
                            click="page1"
                            width={20}
                            payload={game == null}
                        />
                    </div>

                    <div className="restWindow msfull win11Scroll">
                        {game == null ? (
                            <DownPage
                                action={(app) => appDispatch(open_game(app))}
                            />
                        ) : (
                            <DetailPage app={game} />
                        )}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const DetailPage = ({ app }) => {
    const not_logged_in = useAppSelector((state) => state.user.id == 'unknown');
    const subscribed = useAppSelector(
        (state) => state.user.subscription.status == 'PAID'
    );
    const t = useAppSelector((state) => state.globals.translation);
    const {
        name,
        code_name,
        metadata: {
            capsule_image,
            short_description,
            screenshots,
            release_date: { date },
            publishers: [publisher]
        }
    } = app;

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
                    <div className="text-sm font-thin ">Release {date}</div>

                    {subscribed ? (
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
                    ) : !not_logged_in ? (
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
                    ) : (
                        <button
                            onClick={() => login('google', false)}
                            className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]"
                        >
                            login
                        </button>
                    )}
                </div>
            </div>
            <div className="growcont flex flex-col">
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">Screenshots</div>
                    <div className="overflow-x-scroll win11Scroll mt-4">
                        <div className="w-max flex">
                            {screenshots.map((img, id) => {
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

    return (
        <div className="pagecont w-full absolute top-0 box-border pt-8">
            <div className='max-w-[1200px] mx-auto'>
                <div className="max-w-screen-lg mx-auto flex flex-wrap items-center justify-center gap-y-2 md:justify-between px-3 mt-2 lg:px-16 lg:mt-4">
                    <div className="">
                        <b className=" storeHeading font-bold">
                            {t[Contents.TA_TILE]}
                        </b>
                        <p className="storeSubHeading text-left mt-2">
                            {t[Contents.TA_SUBTITLE]}
                        </p>
                    </div>
                    <G4MarketBtn></G4MarketBtn>
                </div>
                <div className="appscont mt-16">
                    {games.map((game, i) => (
                        <div
                            key={i}
                            onClick={() => action(game)}
                            className="ribcont p-4 ltShad prtclk"
                            data-action="page2"
                        >
                            <Image
                                className=" mb-2 rounded"
                                src={game.metadata.capsule_image}
                                imgClass="w-[100px] h-[40px] lg:w-[150px] lg:h-[80px] object-cover"
                                ext
                            />
                            <div className="name capitalize">{game.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const G4MarketBtn = () => {
    return (
        <div className="g4MarketCtn">
            <div className="flex items-center justify-between">
                <p className="font-bold text-[10px]">
                    G4<span className="text-[#99EE2D]">Market</span>
                </p>
                <div className="explainCtn">
                    <AiOutlineQuestionCircle fontSize="0.7rem" />
                    <div className="explainText text-[8px]">
                        <p className="font-bold">
                            Mua game bản quyền trên G4
                            <span className="text-[#99EE2D]">Market</span>
                        </p>
                        <br />
                        <p className="mt-2">
                            G4Market là đối tác uy tín của Thinkmay, cung cấp
                            tài khoản chơi game bản quyền với giá rẻ.
                        </p>
                        <br />
                    </div>
                </div>
            </div>

            <a
                href={externalLink.G4MARKET_LINK_STORE}
                target="_blank"
                className="wrapperBtn mt-1 bg-[#99EE2D] text-black  px-1 "
            >
                <span className="text-[8px]">Mua TK game</span>
                <MdArrowForward fontSize={'0.8rem'} />
                <div className="banner"></div>
            </a>
        </div>
    );
};
