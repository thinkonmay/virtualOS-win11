import { useState } from 'react';
import {
    appDispatch,
    change_template,
    useAppSelector
} from '../../../backend/reducers';
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
    const [opapp, setOpapp] = useState(null);

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
                name={wnapp.name}
            />
            <div className="windowScreen flex relative">
                <LazyComponent show={!wnapp.hide}>
                    <div className="storeNav h-full w-20 flex flex-col">
                        <Icon
                            fafa="faHome"
                            onClick={() => setOpapp(null)}
                            click="page1"
                            width={20}
                            payload={opapp == null}
                        />
                    </div>

                    <div className="restWindow msfull win11Scroll">
                        {opapp == null ? (
                            <DownPage action={setOpapp} />
                        ) : (
                            <DetailPage app={opapp} />
                        )}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const DetailPage = ({ app }) => {
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

    const download = () =>
        appDispatch(
            change_template({
                template: code_name
            })
        );

    const valid = useAppSelector(
        (state) => state.user.subscription.status == 'PAID'
    );

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
                    {valid ? (
                        <>
                            <button
                                onClick={download}
                                className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]"
                            >
                                Cài đặt
                            </button>
                            <div className="text-l mt-6">
                                Cài đặt sẽ <b>xóa</b> dữ liệu <br /> hiện có
                                trên Thinkmay
                                <br />{' '}
                                <b className="mt-2">Cân nhắc trước khi click</b>
                            </div>
                        </>
                    ) : (
                        <div className="text-l font-thin mt-6">
                            Bạn cần đăng kí dịch vụ <br /> trước khi cài đặt
                        </div>
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
    const games = useAppSelector((state) => state.globals.games);
    const [searchtxt, setShText] = useState('');

    const t = (e) => {};
    const handleSearchChange = (e) => {
        setShText(e.target.value);
    };

    return (
        <div className="pagecont w-full absolute top-0 box-border p-3 lg:p-12 lg: pt-4">
            <div className="flex flex-col justify-center mt-4">
                <b className=" storeHeading font-bold">
                    Tạo máy mới đã tải sẵn game
                </b>
                <p className="storeSubHeading text-center">
                    *Không kèm theo tài khoản game
                </p>
            </div>
            {/* <div className="flex flex-wrap gap-5 w-[10rem] ">
                <div className="relative srchbar right-0 text-sm ">
                    <Icon className="searchIcon" src="search" width={12} />
                    <input
                        type="text"
                        onChange={handleSearchChange}
                        value={searchtxt}
                        placeholder="Search"
                    />
                </div>
            </div> */}

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
