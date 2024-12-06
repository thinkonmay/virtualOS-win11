import { login } from '../../../backend/actions';
import {
    app_toggle,
    appDispatch,
    open_game,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';
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
                    <div className="text-2xl font-semibold mt-6">{name}</div>
                    <div className="text-l font-bold mt-6">{publisher}</div>
                    <div className="text-l font-thin mt-6">Release {date}</div>
                    {subscribed ? (
                        <>
                            <button
                                onClick={handleDownload}
                                className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]"
                            >
                                {t[[Contents.TA_CRATE_NEW_PC]]}
                            </button>
                            <div className="text-l p-3  mt-6">
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
        <div className="pagecont w-full absolute top-0 box-border p-3 lg:p-12 lg: pt-4">
            <div className="flex flex-col justify-center mt-4">
                <b className=" storeHeading font-bold">{t[Contents.TA_TILE]}</b>
                <p className="storeSubHeading text-center">
                    *{t[Contents.TA_SUBTITLE]}
                </p>
            </div>

            <div className="appscont mt-8">
                {games.map((game, i) => (
                    <div
                        key={i}
                        onClick={() => action(game)}
                        className="ribcont p-4 pt-8 ltShad prtclk"
                        data-action="page2"
                    >
                        <Image
                            className="mx-4 mb-6 rounded"
                            w={150}
                            src={game.metadata.capsule_image}
                            ext
                        />
                        <div className="name capitalize">{game.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
