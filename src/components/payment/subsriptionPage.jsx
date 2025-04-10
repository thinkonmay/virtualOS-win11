import { useEffect, useState } from 'react';
import {
    app_payload,
    appDispatch,
    popup_open,
    show_chat,
    startogg,
    useAppSelector
} from '../../backend/reducers';
import { create_payment_pocket } from '../../backend/actions';
import { preloadSilent } from '../../backend/actions/background';

const PaymentButton = ({ sub, domain, switchPage }) => {
    const subscription = useAppSelector((state) => state.user.subscription);
    const money = useAppSelector((state) => state.user.wallet.money);
    const { plan_name, next_plan } = subscription ?? {};

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

    const val = useAppSelector(
        (state) => state.apps.apps.find((x) => x.id == 'payment')?.value ?? {}
    );

    const chooseAndswitch = () => {
        appDispatch(
            app_payload({
                id: 'payment',
                key: 'value',
                value: { ...val, plan: sub.name, cluster: domain }
            })
        );
        switchPage('payment');
    };

    return (
        <>
            {/* {plan_name == sub.name ? (
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
            ) : null} */}
            {switchPage != undefined ? (
                <div className="flex gap-2">
                    <button
                        onClick={chooseAndswitch}
                        type="button"
                        className="py-2.5 px-5 bg-blue-600 shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-blue-700"
                    >
                        Chọn
                    </button>
                </div>
            ) : next_plan == sub.name ? (
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

function DomainSelection({ onChangeDomain }) {
    const domains = useAppSelector((state) => state.globals.domains);
    const currentAddress = useAppSelector(
        (state) => state.worker.currentAddress
    );

    useEffect(() => {
        onChangeDomain(currentAddress);
    }, []);

    const chooseDomain = async (e) => {
        const domain = e.target.value;
        if (domain == currentAddress) return;
        onChangeDomain(domain);
        localStorage.setItem('thinkmay_domain', domain);
        await preloadSilent();
    };

    return (
        <div className="block w-full content-center">
            <label className="block text-center mb-2 text-xl font-medium text-white w-full">
                Server
            </label>
            <select
                id="countries"
                defaultValue={currentAddress}
                onChange={chooseDomain}
                className="h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-50 py-2.5 px-4 focus:outline-none justify-self-center cursor-pointer"
            >
                {domains.map((domain, index) => (
                    <option key={index} value={domain.domain}>
                        {domain.domain}
                    </option>
                ))}
            </select>
        </div>
    );
}

export const SubscriptionPage = ({ value, switchPage }) => {
    const plans = useAppSelector((state) => state.user.plans);
    const [domain, setDomain] = useState('');
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
        return (
            <div
                key={index}
                className="flex flex-col p-6 mx-auto max-w-xl text-center bg-white rounded-lg border shadow xl:max-w-lg border-primary-600 dark:bg-gray-800 xl:p-8"
            >
                {plan.highlight ? (
                    <div className="mb-2">
                        <span className="py-1 px-3 text-sm text-primary-800 bg-primary-100 rounded dark:bg-primary-200 dark:text-primary-800">
                            Most popular
                        </span>
                    </div>
                ) : (
                    <div className="mb-2 h-4" />
                )}
                <h3 className="mb-4 text-2xl font-medium text-gray-900 dark:text-white">
                    {plan.title}
                </h3>
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                    {plan.amount / 1000}k
                </span>
                <PaymentButton
                    sub={plan}
                    domain={domain}
                    switchPage={value != undefined ? switchPage : undefined}
                />

                <ul
                    role="list"
                    className="space-y-4 text-left text-gray-900 dark:text-gray-400 mt-12"
                >
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                            <path
                                fillRule="evenodd"
                                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>All tools you need to manage payments</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>No setup, monthly, or hidden fees</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span>Comprehensive security</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                        <span>Get hundreds of feature updates</span>
                    </li>
                    <li className="flex items-center space-x-3">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span> Payouts to your bank account</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-500">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="line-through">
                            Financial reconciliation and reporting
                        </span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-500">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="line-through">
                            24×7 phone, chat, and email support
                        </span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-500">
                        <svg
                            className="flex-shrink-0 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                        </svg>
                        <span className="line-through">
                            Robust developer platform
                        </span>
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <section className="h-full">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        Đăng kí dịch vụ Cloud PC
                    </h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        *chưa bao gồm tài khoản game và các nâng cấp khác
                    </p>
                    <DomainSelection
                        onChangeDomain={setDomain}
                    />
                </div>
                <div className="grid gap-8 xl:grid-cols-3 xl:gap-10">
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
