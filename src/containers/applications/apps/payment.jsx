import { useState } from 'react';
import {
    MdArrowDropDown,
    MdArrowForwardIos,
    MdArrowRight,
    MdCheck
} from 'react-icons/md';
import { UserEvents } from '../../../../src-tauri/api';
import { createPaymentPocket, login } from '../../../backend/actions';
import {
    app_metadata_change,
    appDispatch,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { externalLink } from '../../../backend/utils/constant';
import DepositPage from '../../../components/payment/depositPage';
import { TransactionHistoryPage } from '../../../components/payment/historyPage';
import { RefundPage } from '../../../components/payment/refundPage';
import { StoragePage } from '../../../components/payment/storagePage';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';
import './assets/payment.scss';
import './assets/store.scss';

const listSubs = [
    {
        active: false,
        highlight: false,
        title: 'Gói 2 tuần',
        price_in_vnd: 199000,
        total_time: 50,
        total_days: 14,
        name: 'week1',
        period: 'tuần',
        bonus: [
            'RTX 3060TI',
            '16GB ram',
            '150GB dung lượng riêng, Cloud-save',
            'Không giới hạn thời gian mỗi session',
            'Có hàng chờ'
        ]
    },
    {
        active: false,
        highlight: true,
        title: 'Gói tháng',
        price_in_vnd: 299000,
        total_time: 120,
        total_days: 30,
        name: 'month1',
        period: 'tháng',
        bonus: [
            'RTX 3060TI',
            '16GB ram',
            '150GB dung lượng riêng, Cloud-save',
            'Không giới hạn thời gian mỗi session',
            'Có hàng chờ'
        ],
        storage: ['50GB: 60k/tháng', '100GB: 110k/tháng']
    },
    {
        active: false,
        highlight: false,
        title: 'Gói 1 tuần',
        price_in_vnd: 99000,
        total_time: 25,
        total_days: 7,
        name: 'week2',
        period: 'tuần',
        bonus: [
            'RTX 3060TI',
            '16GB ram',
            '150GB dung lượng riêng, Cloud-save',
            'Không giới hạn thời gian mỗi session',
            'Có hàng chờ'
        ]
    },

    {
        active: true,
        highlight: false,
        title: 'Gói cao cấp',
        price_in_vnd: 1699000,
        total_time: 9999,
        total_days: 30,
        name: 'month2',
        period: 'tháng',
        bonus: [
            'Sở hữu PC riêng',
            'Không hàng chờ',
            'Cấu hình giống gói tháng',
            '250GB dung lượng riêng, cloud-save',
            'Không giới hạn thời gian mỗi session'
        ]
    },
    {
        active: false,
        highlight: false,
        title: 'Nâng 20gb ram và 20gb vcpu',
        price_in_vnd: 50000,
        total_time: 9999,
        total_days: 30,
        name: 'ramcpu20',
        period: 'tháng',
        bonus: [
            "Cấu hình khỏe hơn để chiến các game AAA như God Of War Ragnarok, Monster Hunter, Dragon's Dogma 2",
            '20gb ram',
            '20gb vcpu'
        ]
    }
];

const listDisableShows = {
    week2: true,
    ramcpu20: true
};
export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );

    const page = wnapp.page; //deposit-sub - refund - storage -history

    //useEffect(() => {
    //    setPage(wnapp.page);
    //}, [wnapp.page]);
    const handleChangePage = (input) => {
        appDispatch(
            app_metadata_change({ id: 'payment', key: 'page', value: input })
        );
    };
    return (
        <div
            className="paymentApp wnstore floatTab dpShad"
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
                name="Payment"
            />
            <div className="windowScreen wrapperPayment">
                <div className="navPayment">
                    <div
                        className={
                            page == 'deposit' ? 'item subActive' : 'item'
                        }
                        onClick={() => handleChangePage('deposit')}
                    >
                        Nạp tiền
                    </div>
                    <div
                        className={
                            page == 'storage' ? 'item subActive' : 'item'
                        }
                        onClick={() => handleChangePage('storage')}
                    >
                        Nâng cấp
                    </div>
                    <div
                        className={page == 'sub' ? 'item subActive' : 'item'}
                        onClick={() => handleChangePage('sub')}
                    >
                        Thuê CloudPC
                    </div>
                    <div
                        className={
                            page == 'history' ? 'item subActive' : 'item'
                        }
                        onClick={() => handleChangePage('history')}
                    >
                        Lịch sử
                    </div>
                    <div
                        className={page == 'refund' ? 'item subActive' : 'item'}
                        onClick={() => handleChangePage('refund')}
                    >
                        Hoàn tiền
                    </div>
                </div>
                <LazyComponent show={!wnapp.hide}>
                    <div className="paymentContent win11Scroll">
                        {page == 'sub' ? (
                            <SubscriptionPage />
                        ) : page == 'refund' ? (
                            <RefundPage />
                        ) : page == 'deposit' ? (
                            <DepositPage />
                        ) : page == 'history' ? (
                            <TransactionHistoryPage />
                        ) : (
                            <StoragePage />
                        )}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const SubscriptionCard = ({ subInfo: sub }) => {
    const status = useAppSelector((state) => state.user.subscription.status);
    const domains = useAppSelector((state) => state.globals.domains);
    const user = useAppSelector((state) => state.user);
    const { ended_at } = useAppSelector((state) => state.user.subscription);

    const wallet = user.wallet;
    const not_logged_in = useAppSelector((state) => state.user.id == 'unknown');
    const max = useAppSelector(
        (state) =>
            state.globals.domains?.findIndex(
                (y) =>
                    y.free ==
                    Math.max(...state.globals.domains.map((x) => x.free))
            ) ?? -1
    );

    const [domain, setDomain] = useState(domains?.[max]?.domain ?? 'unknown');

    const listPlan = {
        week1: true,
        week2: true,
        month1: true,
        month2: true
    };
    const isActivePlan = (plan) => {
        let check = wallet?.currentOrders.find((o) => o.plan_name == plan);
        return check;
    };

    const isHavingPlan = () =>
        wallet?.currentOrders.find((o) => listPlan[o.plan_name]);

    const onChooseSub = () => {
        if (not_logged_in) login('google', false);
        else
            createPaymentPocket({
                plan_name: sub.name,
                cluster_domain: domain,
                plan_price: sub.price_in_vnd,
                plan_title: sub.title
            });
    };

    const handleChangePlan = (plan_name) => {
        if (isHavingPlan()?.id) {
            appDispatch(
                popup_open({
                    type: 'pocketChangePlan',
                    data: {
                        plan_name,
                        plan_price: sub.price_in_vnd,
                        plan_title: sub.title,
                        oldPlanId: isHavingPlan().id
                    }
                })
            );
            return;
        }

        createPaymentPocket({
            plan_name: sub.name,
            cluster_domain: domain,
            plan_price: sub.price_in_vnd,
            plan_title: sub.title
        });
    };
    const handleCancelSub = (plan_name) => {
        appDispatch(
            popup_open({
                type: 'pocketCancelPlan',
                data: {
                    plan_name
                }
            })
        );
    };
    const [isShowDetail, setShowDetail] = useState(sub.highlight);
    const clickDetail = () => {
        setShowDetail((old) => !old);
        UserEvents({
            type: 'payment/detail',
            payload: isShowDetail
        });
    };

    return (
        <div className="sub ltShad relative">
            {sub.highlight ? (
                <div className="banner">
                    <p className="content">Phổ biến</p>
                </div>
            ) : null}

            <div className="wrapperMainContent">
                <div className="wrapperTop">
                    <div className="containerTitle">
                        <p className="font-mono">{sub.title}</p>
                    </div>

                    <hr />
                    <div className="containerPrice">
                        <div className="flex items-end">
                            {
                                <div className="flex">
                                    <h3 className="gradient-text-500 text-lg lg:text-3xl pb-1 uppercase font-mono text-brand-600">
                                        {sub.price_in_vnd / 1000}k
                                    </h3>
                                    <Icon
                                        className="vndIcon ml-2 pb-2"
                                        src="vnd"
                                        invert={1}
                                        width={24}
                                    />
                                    {/*<p className="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">
                                                    / {sub.period}{' '}
                                                </p>*/}
                                </div>
                            }
                        </div>
                        <p className="-mt-2">
                            <span className="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[12px]  lg:text-[13px] lg:leading-4">
                                Giới hạn {sub.total_time}h sử dụng trong{' '}
                                {sub.total_days} ngày
                            </span>
                        </p>
                    </div>
                    <hr />
                </div>
                <div className=" wrapperBottom">
                    <div onClick={clickDetail} className="toggleDeteil">
                        {isShowDetail ? (
                            <MdArrowDropDown style={{ fontSize: '1.6rem' }} />
                        ) : (
                            <MdArrowRight style={{ fontSize: '1.6rem' }} />
                        )}
                        Chi tiết:
                    </div>

                    <ul role="list" className="containerDetails">
                        {isShowDetail &&
                            sub.bonus.map((x, i) => (
                                <li key={i} className="detail">
                                    <MdCheck />

                                    <span className="">{x}</span>
                                </li>
                            ))}
                    </ul>
                    <div className="flex flex-col gap-2 mt-auto">
                        {sub.active && status == 'NO_ACTION' ? (
                            <>
                                <div className="flex flex-col">
                                    <span className="mt-2 w-full mx-auto shadow-sm">
                                        Chọn server:
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 mb-4">
                                    {domains?.map(({ domain, free }, index) =>
                                        free > 0 ? (
                                            <label
                                                key={index}
                                                className="text-blue-500 flex gap-2 items-center"
                                                htmlFor="server1"
                                            >
                                                <input
                                                    // defaultChecked={
                                                    //     index == max
                                                    // }
                                                    onChange={(e) =>
                                                        e.target.checked
                                                            ? setDomain(domain)
                                                            : null
                                                    }
                                                    data={domain}
                                                    type="radio"
                                                    name="server"
                                                    id="server1"
                                                />
                                                <span
                                                    name="play"
                                                    className="text-blue-500"
                                                >
                                                    {domain}
                                                </span>
                                                <div className="flex gap-2 items-center text-xs">
                                                    {free} chỗ trống
                                                    {index == max ? (
                                                        <GreenLight />
                                                    ) : null}
                                                </div>
                                            </label>
                                        ) : null
                                    )}
                                </div>

                                <div
                                    className="flex items-center gap-1 hover:underline cursor-pointer font-semibold"
                                    onClick={() => {
                                        appDispatch(
                                            popup_open({
                                                type: 'serversInfo'
                                            })
                                        );
                                    }}
                                >
                                    Hướng dẫn chọn server <MdArrowForwardIos />
                                </div>
                            </>
                        ) : null}
                        <div className="flex gap-2">
                            {
                                //new user
                                !ended_at ? (
                                    <button
                                        onClick={() => {
                                            if (!sub.active) {
                                                if (sub.name == 'week2') {
                                                    return;
                                                }
                                                return window.open(
                                                    externalLink.MESSAGE_LINK,
                                                    '_blank'
                                                );
                                            }
                                            onChooseSub(sub.name);
                                        }}
                                        type="button"
                                        className={`buyButton
                                flex-1 bg-[#0067c0] ${
                                    !sub.active && sub.name == 'week2'
                                        ? 'bg-red-500'
                                        : ''
                                }`}
                                    >
                                        {!sub.active
                                            ? sub.name == 'week2'
                                                ? 'Tạm đóng'
                                                : 'Đặt trước'
                                            : 'Đăng ký'}
                                    </button>
                                ) : (
                                    <>
                                        {isActivePlan(sub.name) ? (
                                            <button
                                                onClick={() =>
                                                    handleCancelSub(sub.name)
                                                }
                                                className="buyButton bg-red-700 flex-1"
                                            >
                                                Huỷ gia hạn
                                            </button>
                                        ) : sub.active ? (
                                            <button
                                                onClick={() =>
                                                    handleChangePlan(sub.name)
                                                }
                                                className="buyButton bg-green-700 flex-1"
                                            >
                                                Đổi gói
                                            </button>
                                        ) : null}

                                        <button
                                            onClick={() => {
                                                if (!sub.active) {
                                                    if (sub.name == 'week2') {
                                                        return;
                                                    }
                                                    return window.open(
                                                        externalLink.MESSAGE_LINK,
                                                        '_blank'
                                                    );
                                                }
                                                onChooseSub(sub.name);
                                            }}
                                            type="button"
                                            className={`buyButton
                                flex-1 bg-[#0067c0] ${
                                    !sub.active && sub.name == 'week2'
                                        ? 'bg-red-500'
                                        : ''
                                }`}
                                        >
                                            {!sub.active
                                                ? sub.name == 'week2'
                                                    ? 'Tạm đóng'
                                                    : 'Đặt trước'
                                                : 'Mua ngay'}
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GreenLight = () => {
    return (
        <div className="relative h-4 w-4">
            {/* Outer glow effect */}
            <div className="absolute -inset-1 rounded-full bg-green-500/30 blur-sm animate-pulse"></div>
            {/* Inner bright dot */}
            <div className="relative h-4 w-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50">
                {/* Highlight effect */}
                {/*<div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-green-200/60"></div>*/}
            </div>
        </div>
    );
};

const SubscriptionPage = () => {
    const plans = useAppSelector((state) => state.user.plans);

    listSubs.forEach((e) => {
        const plan = plans.find((x) => x.name == e.name);
        if (plan == null || undefined) return;
        e.active = plan.allow_payment;
        e.price_in_vnd = plan.amount;
        e.total_time = plan.limit_hour;
        e.total_days = plan.total_days;
    });

    const listSubfiler = listSubs.map((sub) => {
        if (!sub.active && listDisableShows[sub.name]) return;
        return sub;
    });
    return (
        <div className="subscriptionPage md:!justify-evenly px-0 ">
            {listSubfiler.map(
                (sub, index) =>
                    sub && (
                        <SubscriptionCard
                            key={index}
                            subInfo={sub}
                        ></SubscriptionCard>
                    )
            )}
        </div>
    );
};
