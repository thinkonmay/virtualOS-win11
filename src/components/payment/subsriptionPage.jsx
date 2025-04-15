import { useEffect, useState } from 'react';
import {
    app_payload,
    appDispatch,
    startogg,
    useAppSelector
} from '../../backend/reducers';
import {
    create_payment_pocket,
    replace_payment_pocket
} from '../../backend/actions';
import { preloadSilent } from '../../backend/actions/background';

const PaymentButton = ({ template, domain, sub, switchPage }) => {
    const email = useAppSelector((state) => state.user.email);
    const subscription = useAppSelector((state) => state.user.subscription);
    const money = useAppSelector((state) => state.user.balance);
    const currentAddress = useAppSelector(
        (state) => state.worker.currentAddress
    );
    const { next_plan } = subscription ?? {};

    const info = () => appDispatch(startogg());
    const onChooseSub = async () => {
        if (
            currentAddress != domain &&
            domain != '' &&
            domain != undefined &&
            domain != null
        ) {
            localStorage.setItem('thinkmay_domain', domain);
            await preloadSilent();
        }

        const plan_name = sub.name;
        const cluster_domain = domain ?? currentAddress;
        const plan_price = sub.amount;
        const result =
            subscription != undefined
                ? money >= plan_price
                    ? await replace_payment_pocket({ email, plan_name })
                    : chooseAndswitch()
                : money >= plan_price
                  ? await create_payment_pocket({
                        email,
                        plan_name,
                        cluster_domain,
                        template
                    })
                  : chooseAndswitch();
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
                            Nạp thêm để tiếp tục đăng kí
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
                            : money >= sub.amount
                              ? 'Đăng kí'
                              : 'Thanh toán'}
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

const Addon = {
    no_waiting_line: ({ value }) => (
        <li
            className={`flex items-center space-x-3 ${
                !value ? 'text-gray-500' : ''
            }`}
        >
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
            <span className={!value ? 'line-through' : ''}>
                Không có hàng chờ
            </span>
        </li>
    ),
    multiple_cluster: ({ value }) => (
        <li
            className={`flex items-center space-x-3 ${
                !value ? 'text-gray-500' : ''
            }`}
        >
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
            <span className={!value ? 'line-through' : ''}>
                Luôn luôn có server backup
            </span>
        </li>
    ),
    time: ({ value }) => (
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
            {value == 0 ? (
                <span className="line-through">Giới hạn giờ chơi</span>
            ) : (
                <span>Tối đa {value}h chơi</span>
            )}
        </li>
    ),
    storage_limit: ({ value }) => (
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
            {value == 0 ? (
                <span className="line-through">Giới hạn dung lượng tối đa</span>
            ) : (
                <span>Giới hạn {value}GB dung lượng tối đa</span>
            )}
        </li>
    ),
    storage_credit: ({ value }) => (
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
            {value == 0 ? (
                <span className="line-through">Giới hạn dung lượng</span>
            ) : (
                <span>{value}GB credit dung lượng</span>
            )}
        </li>
    )
};

export const SubscriptionPage = ({ value, switchPage, onlyPlan }) => {
    const plans = useAppSelector((state) => state.user.plans);
    const subscription = useAppSelector((state) => state.user.subscription);
    const [domain, setDomain] = useState('');
    const subcontents = [
        {
            title: 'Gói 2 tuần',
            name: 'week1',
            bonus: {
                time: 50,
                storage_limit: 200,
                storage_credit: 100,
                no_waiting_line: false,
                multiple_cluster: false
            }
        },
        {
            title: 'Gói tháng',
            highlight: true,
            name: 'month1',
            bonus: {
                time: 120,
                storage_limit: 400,
                storage_credit: 200,
                no_waiting_line: false,
                multiple_cluster: false
            }
        },
        {
            title: 'Gói cao cấp',
            name: 'month2',
            bonus: {
                time: 0,
                storage_limit: 0,
                storage_credit: 0,
                no_waiting_line: true,
                multiple_cluster: true
            }
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
                            Phổ biến
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
                    template={value?.template?.code_name}
                    domain={domain}
                    switchPage={switchPage}
                />

                <ul
                    role="list"
                    className="space-y-4 text-left text-gray-900 dark:text-gray-400 mt-12"
                >
                    {Object.keys(plan.bonus).map((key, idx) => {
                        var Obj = Addon[key];
                        return Obj != undefined ? (
                            <Obj key={idx} value={plan.bonus[key]} />
                        ) : null;
                    })}
                </ul>
            </div>
        );
    };

    return (
        <section className="h-full">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                {!onlyPlan ? (
                    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
                            Đăng kí dịch vụ Cloud PC
                        </h2>
                        <p className="mb-5 font-light text-gray-300 sm:text-xl">
                            *chưa bao gồm tài khoản game và các nâng cấp khác
                        </p>
                        {subscription == undefined ? (
                            <DomainSelection onChangeDomain={setDomain} />
                        ) : null}
                    </div>
                ) : null}
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
