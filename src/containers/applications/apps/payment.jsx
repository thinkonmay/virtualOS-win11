import { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import {
    app_metadata_change,
    appDispatch,
    popup_open,
    show_chat,
    startogg,
    useAppSelector
} from '../../../backend/reducers';
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
import { create_payment_pocket } from '../../../backend/actions';

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
    const val = wnapp.value;

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
                <div className="navPayment text-left">
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
                        Đăng kí
                    </div>
                    <div
                        className={
                            page == 'history' ? 'item subActive' : 'item'
                        }
                        onClick={() => handleChangePage('history')}
                    >
                        Giao dịch
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
                            <DepositPage value={val} />
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
    const subscription = useAppSelector((state) => state.user.subscription);
    const money = useAppSelector((state) => state.user.wallet.money);
    const { plan_name, next_plan } = subscription ?? {};

    const [domain, setDomain] = useState();
    const askSth = () => appDispatch(show_chat());
    const info = () => appDispatch(startogg());
    const onChooseSub = () => {
        const plan_name = sub.name;
        const cluster_domain = domain;
        const plan_price = sub.price_in_vnd;
        const plan_title = sub.title;
        if (money < plan_price)
            appDispatch(
                popup_open({
                    type: 'pocketNotEnoughMoney',
                    data: {
                        plan_name: plan_title,
                        plan_price: plan_price
                    }
                })
            );
        else if (subscription != undefined)
            appDispatch(
                create_payment_pocket({
                    plan_name,
                    cluster_domain,
                })
            );
        else
            appDispatch(
                popup_open({
                    type: 'pocketBuyConfirm',
                    data: {
                        plan_name,
                        cluster_domain
                    }
                })
            );
    };

    return (
        <div className="sub ltShad relative">
            {sub.name == plan_name ? (
                <div className="banner">
                    <p className="content">Gói của bạn</p>
                </div>
            ) : sub.highlight ? (
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
                            <h3 className="gradient-text-500 text-lg lg:text-3xl pb-1 uppercase font-mono text-brand-600">
                                {sub.price_in_vnd / 1000}k
                            </h3>
                            <Icon
                                className="vndIcon ml-2 pb-2"
                                src="vnd"
                                invert={1}
                                width={24}
                            />
                        </div>
                        <p className="-mt-2">
                            <span className="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[12px]  lg:text-[13px] lg:leading-4">
                                {`Giới hạn ${sub.total_time}h sử dụng trong ${sub.total_days} ngày`}
                            </span>
                        </p>
                    </div>
                    <hr />
                </div>
                <div className="wrapperBottom">
                    {sub.bonus.map((x, i) => (
                        <span key={i} className="detail">
                            <MdCheck />
                            <span className="text-sm">{x}</span>
                        </span>
                    ))}
                    <div className="flex flex-col gap-2 mt-auto">
                        {sub.active &&
                        subscription == undefined &&
                        money >= sub.price_in_vnd ? (
                            <>
                                <div className="flex flex-col">
                                    <span className="mt-2 w-full mx-auto shadow-sm">
                                        Chọn server:
                                    </span>
                                </div>
                                <DomainSelection
                                    onChangeDomain={setDomain}
                                    domain={domain}
                                />
                            </>
                        ) : null}
                        {plan_name == sub.name ? (
                            <div className="flex flex-col">
                                <span className="w-full mx-auto shadow-sm font-bold">
                                    {`Có giá trị đến ${new Date(
                                        subscription?.ended_at
                                    ).toLocaleDateString()}, còn lại ${
                                        subscription?.policy?.limit_hour -
                                        subscription?.total_usage
                                    }h`}
                                </span>
                            </div>
                        ) : null}
                        {next_plan == sub.name ? (
                            <>
                                <div className="flex gap-2">
                                    <button
                                        onClick={info}
                                        type="button"
                                        style={{ '--prefix': 'START' }}
                                        className="buyButton flex-1 bg-[#11385c]"
                                    >
                                        {`Gia hạn ngày ${new Date(
                                            subscription?.ended_at
                                        ).toLocaleDateString()}`}
                                    </button>
                                </div>
                            </>
                        ) : sub.active ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={onChooseSub}
                                    type="button"
                                    className="buyButton flex-1 bg-[#2d88dd]"
                                >
                                    {subscription != undefined
                                        ? money >= sub.price_in_vnd
                                            ? 'Chuyển sang gói này'
                                            : `Nạp thêm`
                                        : 'Đăng kí'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={askSth}
                                    type="button"
                                    className="buyButton flex-1 bg-[#11385c]"
                                >
                                    Liên hệ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function DomainSelection({ onChangeDomain, domain }) {
    const domains = useAppSelector((state) => state.globals.domains);
    const [location, setLocation] = useState([]);

    const getLatency = async (x) => {
        try {
            const start = new Date();
            await fetch(`https://${x.domain}/`, { method: 'POST' });
            return {
                latency: new Date().getTime() - start,
                ...x
            };
        } catch {
            return {
                latency: 9999,
                ...x
            };
        }
    };

    useEffect(() => {
        Promise.all(domains.map(getLatency)).then((x) => {
            setLocation(x);
            onChangeDomain(
                x.sort((a, b) => a.latency - b.latency)?.[0]?.domain
            );
        });
    }, [domains]);

    const chooseDomain = (e) => onChangeDomain(e.target.value);

    return (
        <div className="h-8 ">
            <select
                className="bg-gray-400 rounded-md w-full h-full"
                value={domain}
                onChange={chooseDomain}
            >
                {location.map((x, index) => (
                    <option key={index} value={x.domain}>
                        {x.domain.replaceAll('.thinkmay.net', '')} {x.latency}ms{' '}
                        {x.free}slot
                    </option>
                ))}
            </select>
        </div>
    );
}

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
