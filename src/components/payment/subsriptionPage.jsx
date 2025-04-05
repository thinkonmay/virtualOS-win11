import { useEffect } from 'react';
import {
    appDispatch,
    popup_open,
    show_chat,
    startogg,
    useAppSelector
} from '../../backend/reducers';
import { create_payment_pocket } from '../../backend/actions';

const PaymentButton = ({ subInfo: sub, domain }) => {
    const subscription = useAppSelector((state) => state.user.subscription);
    const money = useAppSelector((state) => state.user.wallet.money);
    const { plan_name, next_plan } = subscription ?? {};

    const askSth = () => appDispatch(show_chat());
    const info = () => appDispatch(startogg());
    const onChooseSub = () => {
        const plan_name = sub.name;
        const cluster_domain = domain;
        const plan_price = sub.amount;
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
                    cluster_domain
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
        <>
            {plan_name == sub.name ? (
                <div className="flex flex-col mb-3">
                    <span className="w-full mx-auto shadow-sm font-bold text-center">
                        {`Có giá trị đến ${new Date(
                            subscription?.ended_at
                        ).toLocaleDateString()}`}
                    </span>
                    <span className="w-full mx-auto shadow-sm font-bold text-center">
                        {`còn lại ${
                            subscription?.policy?.limit_hour -
                            subscription?.total_usage
                        }h sử dụng`}
                    </span>
                </div>
            ) : null}
            {next_plan == sub.name ? (
                sub.amount <= money ? (
                    <div className="flex gap-2">
                        <button
                            onClick={info}
                            type="button"
                            style={{ '--prefix': 'START' }}
                            className="py-2.5 px-5 bg-blue-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-blue-700"
                        >
                            {`Gia hạn ngày ${new Date(
                                subscription?.ended_at
                            ).toLocaleDateString()}`}
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={onChooseSub}
                            type="button"
                            className="py-2.5 px-5 bg-blue-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-blue-700"
                        >
                            {`Nạp thêm ${
                                (sub.amount - money) / 1000
                            }k để tự động gia hạn`}
                        </button>
                    </div>
                )
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={onChooseSub}
                        type="button"
                        className="py-2.5 px-5 bg-blue-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-blue-700"
                    >
                        {subscription != undefined
                            ? money >= sub.amount
                                ? 'Chuyển sang gói này'
                                : `Nạp thêm`
                            : 'Đăng kí'}
                    </button>
                </div>
            )}
        </>
    );
};

function DomainSelection({ onChangeDomain, domain }) {
    const domains = useAppSelector((state) => state.globals.domains);

    const getLatency = async (x) => {
        try {
            const start = new Date();
            await fetch(`https://${x.domain}/`, { method: 'POST' });
            return {
                latency:
                    x.domain == 'play.2.thinkmay.net'
                        ? 10
                        : new Date().getTime() - start,
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
            onChangeDomain(
                x.sort((a, b) => a.latency - b.latency)?.[0]?.domain
            );
        });
    }, [domains]);

    const chooseDomain = (e) => onChangeDomain(e.target.value);

    return (
        <div className="block w-full content-center">
            <label
                for="countries"
                className="block text-center mb-2 text-xl font-medium text-white w-full"
            >
                Server
            </label>
            <select
                id="countries"
                className="h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-50 py-2.5 px-4 focus:outline-none justify-self-center"
            >
                {domains.map((domain) => (
                    <option onSelect={chooseDomain} value={domain.domain}>
                        {domain.domain}
                    </option>
                ))}
            </select>
        </div>
    );
}

export const SubscriptionPage = () => {
    const plans = useAppSelector((state) => state.user.plans);
    const subcontents = [
        {
            title: 'Gói 2 tuần',
            name: 'week1',
            bonus: [
                'RTX 3060TI',
                '16GB ram',
                '150GB dung lượng riêng, Cloud-save',
                'Không giới hạn thời gian mỗi session',
                'Có hàng chờ'
            ]
        },
        {
            title: 'Gói tháng',
            highlight: true,
            name: 'month1',
            bonus: [
                'RTX 3060TI',
                '16GB ram',
                '150GB dung lượng riêng, Cloud-save',
                'Không giới hạn thời gian mỗi session',
                'Có hàng chờ'
            ]
        },
        {
            title: 'Gói cao cấp',
            name: 'month2',
            bonus: [
                'Sở hữu PC riêng',
                'Không hàng chờ',
                'Cấu hình giống gói tháng',
                '250GB dung lượng riêng, cloud-save',
                'Không giới hạn thời gian mỗi session'
            ]
        }
    ];
    const renderPlan = (plan, index) => {
        return plan.highlight ? (
            <div
                key={index}
                className="flex flex-col mx-auto max-w-sm text-gray-900 rounded-2xl bg-blue-100 transition-all duration-500 hover:bg-blue-200 "
            >
                <div className="uppercase bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-2xl p-3 text-center text-white bg-blue-700">
                    MOST POPULAR
                </div>
                <div className="p-6 xl:py-9 xl:px-12">
                    <h3 className="font-manrope text-2xl font-bold mb-3">
                        {plan.title}
                    </h3>
                    <div className="flex items-center mb-6">
                        <span className="font-manrope mr-2 text-6xl font-semibold text-blue-600">
                            {plan.amount / 1000}k
                        </span>
                        <span className="text-xl text-gray-500 ">/ month</span>
                    </div>
                    <ul className="mb-12 space-y-6 text-left text-lg ">
                        {plan.bonus.map((x) => (
                            <li className="flex items-center space-x-4">
                                <svg
                                    className="flex-shrink-0 w-6 h-6 text-blue-600"
                                    viewBox="0 0 30 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>{x}</span>
                            </li>
                        ))}
                    </ul>
                    <PaymentButton subInfo={plan} domain={plan.domain} />
                </div>
            </div>
        ) : (
            <div className="flex flex-col mx-auto max-w-sm text-gray-900 rounded-2xl p-6 xl:py-9 xl:px-12 bg-blue-100 transition-all duration-500 hover:bg-blue-200 ">
                <h3 className="font-manrope text-2xl font-bold mb-3">
                    {plan.title}
                </h3>
                <div className="flex items-center mb-6">
                    <span className="font-manrope mr-2 text-6xl font-semibold">
                        {plan.amount / 1000}k
                    </span>
                    <span className="text-xl text-gray-500 ">/ month</span>
                </div>
                <ul className="mb-12 space-y-6 text-left text-lg text-gray-500">
                    {plan?.bonus?.map((x) => (
                        <li className="flex items-center space-x-4">
                            <svg
                                className="flex-shrink-0 w-6 h-6 text-blue-600"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z"
                                    stroke="currentColor"
                                    stroke-width="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>{x}</span>
                        </li>
                    ))}
                </ul>
                <PaymentButton subInfo={plan} domain={plan.domain} />
            </div>
        );
    };
    return (
        <section className="py-24 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h2 className="font-manrope text-5xl text-center font-bold text-white mb-4">
                        Đăng kí dịch vụ Cloud PC
                    </h2>
                    <p className="text-gray-300 text-center leading-6 mb-9">
                        *chưa bao gồm tài khoản game và các nâng cấp khác
                    </p>
                    <DomainSelection onChangeDomain={() => {}} domain={''} />
                </div>

                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0 lg:items-center lg:mb-0 mb-40">
                    {plans
                        .map((x) => ({
                            ...x,
                            ...(subcontents.find((y) => y.name == x.name) ?? {})
                        }))
                        .filter((val) => val.title != null)
                        .sort((a, b) => a.amount - b.amount)
                        .map(renderPlan)}
                </div>
            </div>
        </section>
    );
};
