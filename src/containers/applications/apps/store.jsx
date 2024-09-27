import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
//import { Icon, Image, LazyComponent, ToolBar } from '../../../'

import { bindStoreId, hasHourSession } from '../../../backend/actions';
import {
    app_toggle,
    appDispatch,
    fetch_store,
    popup_close,
    popup_open,
    useAppSelector,
    wait_and_claim_volume,
    worker_refresh
} from '../../../backend/reducers';
import { formatError } from '../../../backend/utils/formatErr';
import {
    Icon,
    Image,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';
import './assets/store.scss';

const emap = (v) => {
    v = Math.min(1 / v, 10);
    return v / 11;
};
const listDraftApp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const MicroStore = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'store')
    );
    const [tab, setTab] = useState('sthome');
    const [page, setPage] = useState(1);
    const [opapp, setOpapp] = useState({});
    const stat = useAppSelector((state) => state.user.stat);
    const worker = useAppSelector((state) => state.worker);
    //const isValidSub = true
    const isValidSub = stat?.plan_name == 'hour_02';

    const [isConnecting, setConnecting] = useState(false);

    useEffect(() => {
        const checking = async () => {
            const result = await hasHourSession();
            setConnecting(result);
        };
        if (isValidSub) {
            checking();
        }
    }, [worker]);
    const totab = (e) => {
        var x = e.target && e.target.dataset.action;
        if (x) {
            setPage(0);
            setTimeout(() => {
                var target = document.getElementById(x);
                if (target) {
                    var tsof = target.parentNode.parentNode.scrollTop,
                        trof = target.offsetTop;

                    if (Math.abs(tsof - trof) > window.innerHeight * 0.1) {
                        target.parentNode.parentNode.scrollTop =
                            target.offsetTop;
                    }
                }
            }, 200);
        }
    };

    const frontScroll = (e) => {
        if (page == 0) {
            var tabs = ['sthome', 'gamerib'],
                mntab = 'sthome',
                mndis = window.innerHeight;

            tabs.forEach((x) => {
                var target = document.getElementById(x);
                if (target) {
                    var tsof = target.parentNode.parentNode.scrollTop,
                        trof = target.offsetTop;

                    if (Math.abs(tsof - trof) < mndis) {
                        mntab = x;
                        mndis = Math.abs(tsof - trof);
                    }
                }
            });

            setTab(mntab);
        }
    };

    const app_click = async (data) => {
        setOpapp(data);
        setPage(2);
    };

    const handleReconnect = async () => {
        if (!isValidSub) return;
        await appDispatch(worker_refresh());
        const check = await hasHourSession();

        if (!check) {
            setConnecting(false);
            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        content:
                            'Session của bạn đã hết hạn, vui lòng tạo lại session mới',
                        success: false
                    }
                })
            );
            return;
        }
        appDispatch(wait_and_claim_volume());
    };
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
                            onClick={() => {
                                setPage(1);
                            }}
                            click="page1"
                            width={20}
                            payload={page == 1}
                        />
                        {/*<Icon
							fafa="faThLarge"
							onClick={() => {
								setPage(1);
							}}
							click="page1"
							width={20}
							payload={page == 1}
						/>*/}
                        {/* <Icon onClick={() => {}} width={30} ui={true} src={"nvidia"} /> */}

                        {isValidSub && isConnecting ? (
                            <div className="absolute top-1 z-[1] right-4 rounded-lg p-3 bg-slate-200 flex flex-col">
                                <p className="text-orange-700 text-[14px] font-semibold">
                                    Tiếp tục session cũ
                                </p>
                                <button
                                    className="instbtn mt-3 h-[32px] w-[88px] text-sm font-medium self-end"
                                    onClick={handleReconnect}
                                >
                                    Connect
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <div
                        id="storeScroll"
                        className="restWindow msfull win11Scroll"
                        onScroll={frontScroll}
                    >
                        {page == 1 ? <DownPage action={app_click} /> : null}
                        {page == 2 ? <DetailPage app={opapp} /> : null}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const stars = 5;
const reviews = 5000;

const DetailPage = ({ app }) => {
    const [dstate, setDown] = useState(0);

    const t = (e) => { };
    const [Options, SetOptions] = useState([]);
    const user = useAppSelector((state) => state.user);
    const stat = useAppSelector((state) => state.user.stat);
    const isMaintaining = useAppSelector(
        (state) => state.globals.maintenance?.isMaintaining
    );

    const region = ['Hà Nội', 'India'];

    useLayoutEffect(() => {
        const element = document.getElementById('storeScroll');
        element.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    const dispatch = useDispatch();

    const download = async (appId) => {
        const email = user.email;

        try {
            if (stat?.plan_name !== 'hour_02') {
                appDispatch(app_toggle('payment'));
                throw 'Tài khoản chưa mua gói giờ lẻ';
            }
            if (user.isExpired) {
                appDispatch(popup_open({ type: 'warning', data: {} }));
                return;
            }
            if (isMaintaining) {
                throw 'Server is Offline!!!';
            }

            appDispatch(
                popup_open({
                    type: 'notify',
                    data: { loading: true, title: 'Connect to PC' }
                })
            );
            await bindStoreId(email, appId);
            appDispatch(popup_close());
            appDispatch(wait_and_claim_volume());
        } catch (error) {
            appDispatch(popup_close());
            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        content: formatError(error),
                        success: false
                    }
                })
            );
        }
    };

    return (
        <div className="detailpage w-full absolute top-0 flex">
            <div className="detailcont">
                <Image
                    className="rounded"
                    ext
                    h={100}
                    src={app?.logo}
                    absolute
                    err="img/asset/bootlogo.png"
                />
                <div className="flex flex-col items-center text-center relative">
                    <div className="text-2xl font-semibold mt-6">
                        {app?.name}
                    </div>
                    <div className="text-xs text-blue-500">
                        *Bắt buộc phải mở qua Chrome hoặc App
                    </div>

                    <button
                        onClick={() => download(app.id)}
                        className="font-semibold text-base rounded-lg instbtn mt-5 handcr !px-[32px] !py-[12px]"
                    >
                        Play now!
                    </button>

                    <div className="text-sm text-orange-500 mt-2 underline">
                        <a
                            target="_blank"
                            href="https://www.youtube.com/watch?v=qQDiEP4R11A"
                            className="mt-5"
                        >
                            Hướng dẫn sử dụng
                        </a>
                    </div>
                    <div className="flex mt-4">
                        <div>
                            <div className="flex items-center text-sm font-semibold">
                                {stars}
                                <Icon
                                    className="text-orange-600 ml-1"
                                    fafa="faStar"
                                    width={14}
                                />
                            </div>
                            <span className="text-xss">Average</span>
                        </div>
                        <div className="w-px bg-gray-300 mx-4"></div>
                        <div>
                            <div className="text-sm font-semibold">
                                {Math.round(reviews / 100) / 10}K
                            </div>
                            <div className="text-xss mt-px pt-1">Ratings</div>
                        </div>
                    </div>
                    <div className="descnt text-sm  w-0 text-center relative ">
                        {/*{app?.description}
                        
                        */}
                        Hướng dẫn sử dụng
                    </div>
                </div>
            </div>
            <div className="growcont flex flex-col">
                {/*<div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">Screenshots</div>
                    <div className="overflow-x-scroll win11Scroll mt-4">
                        <div className="w-max flex">
                            {app?.screenshoots?.map((img) => {
                                return (
                                    <div
                                        className="mr-6 relative"
                                        key={Math.random()}
                                    >
                                        <Image
                                            key={Math.random()}
                                            className="mr-2 rounded"
                                            h={250}
                                            src={img}
                                            ext
                                            err="img/asset/bootlogo.png"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>*/}
                <div className="briefcont py-2 pb-3">
                    <div className="text-sm">
                        {t('store.description')}
                        Vui lòng <b>giảm</b> độ phân giải của game nếu gặp tình
                        trạng <b> giật lag</b>, độ phân giải mặc định của game
                        là 4K
                    </div>
                    <div className="text-xs mt-4">
                        <pre>{app?.description}</pre>
                    </div>
                </div>
                {/*<div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">
                        {t('store.ratings')}
                    </div>
                    <div className="flex mt-4 items-center">
                        <div className="flex flex-col items-center">
                            <div className="text-5xl reviewtxt font-bold">
                                {stars}
                            </div>
                            <div className="text-xss">
                                {Math.round(reviews / 100) / 10}K RATINGS
                            </div>
                        </div>
                        <div className="text-xss ml-6">
                            {'54321'.split('').map((x, i) => {
                                return (
                                    <div key={i} className="flex items-center">
                                        <div className="h-4">{x}</div>
                                        <Icon
                                            className="text-orange-500 ml-1"
                                            fafa="faStar"
                                            width={8}
                                        />
                                        <div className="w-48 ml-2 bg-orange-200 rounded-full">
                                            <div
                                                style={{
                                                    width:
                                                        emap(
                                                            Math.abs(stars - x)
                                                        ) *
                                                        100 +
                                                        '%',
                                                    padding: '3px 0'
                                                }}
                                                className="rounded-full bg-orange-500"
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="briefcont py-2 pb-3">
                    <div className="text-xs font-semibold">
                        {t('store.features')}
                    </div>
                    <div className="text-xs mt-4">
                        <pre>{app?.feature}</pre>
                    </div>
                </div>*/}
            </div>
        </div>
    );
};

const DownPage = ({ action }) => {
    const [catg, setCatg] = useState('all');
    const games = useAppSelector((state) => state.globals.games);
    const [searchtxt, setShText] = useState('');

    const t = (e) => { };
    const handleSearchChange = (e) => {
        setShText(e.target.value);
    };

    useEffect(() => {
        if (games.length == 0) {
            appDispatch(fetch_store());
        }
    }, []);
    const CheckAppPriority = (volume_class = '') => {
        let priority = '';
        if (volume_class.includes('LA')) {
            priority = 'LA';
        } else if (volume_class.includes('HA')) {
            priority = '';
        }

        return <span>{priority == 'LA' ? t('info.LA') : ''}</span>;
    };
    const renderSearchResult = () => {
        const keyword = searchtxt.toLowerCase();
        const cloneApp = [...games];

        return cloneApp.map((app, index) => {
            const appName = app.name.toLowerCase();
            if (appName.includes(keyword)) {
                return (
                    <div
                        key={index}
                        className="ribcont ltShad prtclk"
                        onClick={() => {
                            action(app);
                        }}
                        data-action="page2"
                        style={{
                            background: app.steam_off
                                ? 'linear-gradient(to right, #f7e67b, #c8ae54)'
                                : ''
                        }}
                    >
                        <Image
                            className="img"
                            //w={'inherit'}
                            //h={'inherit'}
                            src={app.logo}
                            ext
                            absolute
                        />
                        <div className="name capitalize  text-xs text-center font-semibold">
                            {app.name}
                        </div>
                        <div className="text-[11px] text-center font-regular">
                            {app.steam_off ? `(${t('info.withoutAcc')})` : ''}
                        </div>
                        <div className="text-[11px] text-center font-regular">
                            {CheckAppPriority(app.volume_class)}
                        </div>
                    </div>
                );
            }
        });
    };
    return (
        <div
            id="storeScroll"
            className="pagecont w-full absolute top-0 box-border p-3 lg:p-12 lg: pt-4"
        >
            <p className="storeHeading mt-4">
                <b className="font-bold">DÀNH RIÊNG CHO GÓI GIỜ</b>
                {/*tức các game sau:*/}
            </p>
            <p className="storeHeading text-base mt-4">
                Game đã được cài sẵn, click để chơi ngay!
            </p>
            <p className="storeHeading text-sm mt-1 mb-4">
                *Toàn bộ dữ liệu sẽ bị xoá khi tắt máy
            </p>
            <div className="flex flex-wrap gap-5 justify-between">
                {/*<div className="flex items-center ">
                    <div
                        className="catbtn handcr"
                        value={catg == 'all'}
                        onClick={() => setCatg('all')}
                    >
                        All
                    </div>
                    <div
                        className="catbtn handcr"
                        value={catg == 'app'}
                        onClick={() => setCatg('app')}
                    >
                        Apps
                    </div>
                    <div
                        className="catbtn handcr"
                        value={catg == 'game'}
                        onClick={() => setCatg('game')}
                    >
                        Games
                    </div>
                </div>*/}
                <div className="relative srchbar right-0 text-sm ">
                    <Icon className="searchIcon" src="search" width={12} />
                    <input
                        type="text"
                        onChange={handleSearchChange}
                        value={searchtxt}
                        placeholder="Search"
                    />
                </div>
            </div>

            <div className="appscont mt-8">
                {games.length > 0
                    ? renderSearchResult()
                    : listDraftApp.map((i) => (
                        <div
                            key={i}
                            className="animate-pulse ribcont p-4 pt-8 ltShad prtclk"
                            data-action="page2"
                        >
                            <Image
                                className="mx-4 mb-6 rounded bg-slate-200"
                                w={100}
                                h={100}
                                ext
                            />
                            <div className="capitalize text-xs text-center font-semibold"></div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
