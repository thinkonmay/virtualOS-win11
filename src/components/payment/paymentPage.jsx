import { useEffect, useState } from 'react';
import {
    create_payment_pocket,
    verify_transaction
} from '../../backend/actions';
import {
    app_close,
    app_full,
    app_toggle,
    appDispatch,
    fetch_wallet,
    useAppSelector
} from '../../backend/reducers';
import QRCode from 'react-qr-code';
import { GLOBAL } from '../../../src-tauri/api';
import { preloadSilent } from '../../backend/actions/background';

const subcontents = [
    {
        title: 'Gói 2 tuần',
        type: 'plan',
        name: 'week1'
    },
    {
        title: 'Gói tháng',
        type: 'plan',
        name: 'month1'
    },
    {
        title: 'Gói cao cấp',
        type: 'plan',
        name: 'month2'
    },

    {
        title: '12 vCPUs 1 tháng',
        type: 'resource',
        multiply: 30,
        name: 'cpu12'
    },
    {
        title: '10 vCPUs 1 tháng',
        type: 'resource',
        multiply: 30,
        name: 'cpu10'
    },
    {
        title: '24GB RAM 1 tháng',
        type: 'resource',
        multiply: 30,
        name: 'ram24'
    },
    {
        title: 'Tài khoản game 1 tháng',
        type: 'resource',
        multiply: 30,
        name: 'kickey'
    },
    {
        title: '20GB RAM 1 tháng',
        type: 'resource',
        multiply: 30,
        name: 'ram20'
    }
];

export const PaymentPage = ({ value }) => {
    const email = useAppSelector((state) => state.user.email);
    const plans = useAppSelector((state) => state.user.plans);
    const resources = useAppSelector((state) => state.user.resources);
    const [planAmount, setplanAmount] = useState({});
    const [promotion, setPromotion] = useState('');
    const [promotionState, setPromotionState] = useState('unknown');
    useEffect(() => {
        if (promotionState == 'failed')
            setTimeout(() => setPromotionState('unknown'), 2000);
    }, [promotionState]);
    const [step, setStep] = useState(value?.plan != undefined ? 2 : 1);

    let total = 0;
    let instant_deduction = 0;
    let gradual_deduction = 0;
    for (const key in planAmount) total += planAmount[key];
    for (const key in planAmount)
        if (
            subcontents.find((x) => x.name == key)?.type == 'plan' &&
            planAmount[key] > 0
        ) {
            instant_deduction += plans.find((x) => x.name == key)?.amount;
            break;
        }
    for (const key in planAmount)
        if (
            subcontents.find((x) => x.name == key)?.type == 'resource' &&
            planAmount[key] > 0
        )
            gradual_deduction +=
                resources.find((x) => x.name == key)?.amount * 30;

    let picked_plan = value?.plan;
    if (picked_plan == undefined)
        for (const key in planAmount)
            if (
                subcontents.find((x) => x.name == key)?.type == 'plan' &&
                planAmount[key] > 0
            ) {
                picked_plan = key;
                break;
            }

    const additionalPlans = [];
    if (value?.template)
        additionalPlans.push({
            title: `${value.template.name} đã được cài sẵn`,
            name: value.template.code_name,
            amount: 0
        });

    const renderPlan = (plan, index) => {
        const [quantity, setQuantity] = useState(0);

        useEffect(() => {
            set(
                value?.plan == plan.name ||
                    value?.additional?.includes(plan.name) ||
                    value?.template?.code_name == plan.name
                    ? 1
                    : 0
            );
        }, []);

        const increase = (val) => {
            if (!Number.isInteger(val) || quantity + val < 0) return;

            setQuantity((old) => old + val);
            setplanAmount((old) => {
                old[plan.name] = (quantity + val) * plan.amount;
                return old;
            });
        };

        const set = (val) => {
            if (!Number.isInteger(val) || val < 0) return;

            setQuantity(val);
            setplanAmount((old) => {
                old[plan.name] = val * plan.amount;
                return old;
            });
        };

        const enableEdit = step == 1;
        if (!enableEdit && quantity == 0) return null;
        return (
            <div
                key={index}
                className="flex flex-wrap items-center space-y-6 px-3 py-1  sm:gap-6 sm:space-y-0 md:justify-between"
            >
                <div className="w-64 items-center space-y-4 sm:flex sm:space-x-6 sm:space-y-0 md:max-w-md lg:max-w-lg">
                    <a
                        href="#"
                        className="sm:block aspect-square w-10 shrink-0 hidden"
                    >
                        <img
                            className="h-full w-full dark:hidden"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                            alt="imac image"
                        />
                        <img
                            className="hidden h-full w-full dark:block"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                            alt="imac image"
                        />
                    </a>

                    <div className="w-full md:max-w-sm lg:max-w-md">
                        <a
                            href="#"
                            className="font-medium text-gray-900 hover:underline dark:text-white"
                        >
                            {plan.title}
                        </a>
                    </div>
                </div>

                <div className="w-8 shrink-0">
                    <p className="text-base font-normal text-black dark:text-white">
                        {plan.amount / 1000}k
                    </p>
                </div>

                <div className="flex flex-row items-center w-8 mx-8">
                    {enableEdit ? (
                        <button
                            onClick={() => increase(-1)}
                            className="bg-gray-600 group rounded-l-full w-full py-0 border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 text-white hover:text-black hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                        >
                            <svg
                                className="w-8 h-8"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 12h14"
                                />
                            </svg>
                        </button>
                    ) : null}
                    <input
                        type="text"
                        className="border-y outline-none text-black dark:text-white font-semibold text-lg py-1  text-center bg-transparent w-6"
                        placeholder="0"
                        value={quantity}
                        onChange={(x) => set(x.target.value)}
                    />
                    {enableEdit ? (
                        <button
                            onClick={() => increase(1)}
                            className="bg-gray-600 group rounded-r-full w-full py-0 border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 text-white hover:text-black hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                        >
                            <svg
                                className="w-8 h-8"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 12h14m-7 7V5"
                                />
                            </svg>
                        </button>
                    ) : null}
                </div>

                <div className="w-24 hidden sm:block">
                    <p className="text-base font-bold text-black dark:text-white">
                        {(plan.amount * quantity) / 1000}k
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div
            className="w-full h-full px-1 md:px-5 lg-6 mx-auto relative z-10 rounded"
            style={{ color: `var(--dark-txt)` }}
        >
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <Stage step={step} />
                <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-8">
                    <div className="min-w-0 flex-1 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-6 mt-6 flex justify-left">
                            <h2 className=" text-2xl font-semibold text-white">
                                Lựa chọn
                            </h2>
                        </div>
                        {[
                            ...plans.map((x) => ({
                                ...x,
                                ...(subcontents.find((y) => y.name == x.name) ??
                                    {})
                            })),
                            ...resources.map((x) => ({
                                ...x,
                                ...(subcontents.find((y) => y.name == x.name) ??
                                    {})
                            })),
                            ...additionalPlans
                        ]
                            .map((x) => ({
                                ...x,
                                ...(x.multiply
                                    ? { amount: x.amount * x.multiply }
                                    : {})
                            }))
                            .filter((val) => val.title != null)
                            .sort((a, b) => b.amount - a.amount)
                            .map(renderPlan)}
                    </div>

                    <div className="mt-6 w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                        <div className="p-6 hidden sm:block">
                            <h4 className="mb-4 text-xl font-semibold text-white">
                                Phương thức thanh toán
                            </h4>

                            <div className="flow-root">
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <dl className="pb-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                        <dt className="whitespace-nowrap font-semibold text-white">
                                            Order date
                                        </dt>
                                        <dd className="mt-2 text-gray-500 dark:text-gray-400 sm:mt-0 sm:text-right">
                                            {new Date().toLocaleDateString()}
                                        </dd>
                                    </dl>

                                    <dl className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                        <dt className="whitespace-nowrap font-semibold text-white">
                                            Email
                                        </dt>
                                        <dd className="mt-2 text-gray-500 dark:text-gray-400 sm:mt-0 sm:text-right">
                                            {email}
                                        </dd>
                                    </dl>
                                    <dl className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                        <dt className="whitespace-nowrap font-semibold text-white">
                                            Payment method
                                        </dt>
                                        <dd className="mt-2 flex items-center gap-2 sm:mt-0 sm:justify-end">
                                            <img
                                                className="h-auto w-5"
                                                src="img/icon/payment.png"
                                            />
                                            <span className="text-right text-gray-500 dark:text-gray-400">
                                                VietQR
                                            </span>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-y-4 px-6 py-0 sm:py-6">
                            <div className="flex justify-between relative w-full ">
                                <input
                                    type="text"
                                    className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                    onChange={(x) =>
                                        setPromotion(x.target.value)
                                    }
                                    value={promotion}
                                    placeholder="Mã giảm giá"
                                />
                                <button
                                    className=" bg-gray-700 text-white p-2 rounded-md flex justify-center items-center hover:opacity-80 ml-3"
                                    onClick={() => setPromotionState('failed')}
                                >
                                    {promotionState == 'unknown' ? (
                                        <>
                                            Apply
                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M18.5 12A2.5 2.5 0 0 1 21 9.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 1 0 5V17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2.5a2.5 2.5 0 0 1-2.5-2.5Z"
                                                />
                                            </svg>
                                        </>
                                    ) : promotionState == 'success' ? (
                                        <>
                                            Applied
                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            Denied
                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                                                />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="sm:space-y-4 p-6">
                            <h4 className="text-xl font-semibold text-white hidden sm:block">
                                Tổng hợp
                            </h4>

                            <PaymentFlow
                                total={total}
                                initialStep={
                                    step == 2 ? 'requestQR' : 'picking'
                                }
                                setStep={setStep}
                                plan={picked_plan}
                                promotion={promotion}
                                template={value?.template?.code_name}
                                cluster_domain={value?.cluster}
                                instant_deduction={instant_deduction}
                                gradual_deduction={gradual_deduction}
                            />

                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Bằng cách đặt hàng, bạn đồng ý với{' '}
                                <a
                                    href="/legal"
                                    title=""
                                    className="text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                                >
                                    chính sách và điều khoản
                                </a>{' '}
                                của Thinkmay.
                            </p>
                        </div>

                        {/* <div className="space-y-4 bg-gray-50 p-6 dark:bg-gray-700">
                            <p className="text-sm font-medium text-white">
                                Your benefits:
                            </p>
                            <ul className="list-outside list-disc space-y-1 pl-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                                <li>Pre-order guarantee</li>
                                <li>Free shipping</li>
                                <li>Best price</li>
                            </ul>

                            <a
                                href="#"
                                title=""
                                className="inline-block text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                            >
                                {' '}
                                How are shipping costs calculated?{' '}
                            </a>

                            <p className="max-w-xs text-sm font-normal text-gray-500 dark:text-gray-400">
                                Flowbite PRO shipping benefits have been applied
                                to your order.
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentFlow = ({
    promotion,
    template,
    total,
    setStep: stepCallback,
    plan: plan_name,
    initialStep,
    cluster_domain,
    gradual_deduction,
    instant_deduction
}) => {
    const email = useAppSelector((state) => state.user.email);
    const balance = useAppSelector((state) => state.user.balance);
    const has_subscription = useAppSelector(
        (state) => state.user.subscription != undefined
    );
    const [step, setStep] = useState(initialStep);
    const [qrcode, setQRCode] = useState('');
    const [url, setURL] = useState('');
    const [id, setID] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        if (step == 'picking') stepCallback(1);
        else if (step == 'requestQR' || step == 'showQR') stepCallback(2);
        else if (step == 'deduct') stepCallback(3);
    }, [step]);

    const requestQR = async () => {
        const { data, error } = await GLOBAL().rpc('create_pocket_deposit_v3', {
            email,
            amount: total,
            provider: 'PAYOS',
            currency: 'VND',
            discount_code: promotion
        });
        if (error) setStep(error.message);
        else {
            const [
                {
                    id,
                    qrcode,
                    payment_url,
                    data: { data: subdata }
                }
            ] = data;

            const actual_amount = Number.parseInt(subdata?.amount);
            const sdata = {
                accountName: subdata?.accountName,
                amount: actual_amount,
                description:
                    subdata?.description?.split(' ')[1] ?? subdata?.description
            };

            setID(id);
            setQRCode(qrcode);
            setURL(payment_url);
            setData(sdata);
            setStep('showQR');
        }
    };

    const currentAddress = useAppSelector(
        (state) => state.worker.currentAddress
    );
    const register = async () => {
        if (currentAddress != cluster_domain) {
            localStorage.setItem('thinkmay_domain', domain);
            await preloadSilent();
        }

        await create_payment_pocket({
            email,
            plan_name,
            cluster_domain,
            template
        });

        appDispatch(app_close('payment'));
        appDispatch(app_toggle('connectPc'));
    };

    const verify = async () => {
        if (await verify_transaction({ id })) {
            await GLOBAL().rpc('verify_all_deposits');
            await appDispatch(fetch_wallet());
            setStep('deduct');
        }
    };

    useEffect(() => {
        if (step != 'showQR') return;

        const interval = setInterval(verify, 1000);
        return async () => {
            clearInterval(interval);
        };
    }, [step]);

    const payos = async () => {
        const w = window.open();
        w.location.href = url;
    };
    const deny = async () => {
        await GLOBAL().rpc('cancel_transaction', {
            id
        });
        setStep('requestQR');
    };

    switch (step) {
        case 'showQR':
            return (
                <>
                    <div className=" flex justify-center gap-3 items-center rounded-lg p-2  bg-white ">
                        <QRCode
                            size={256}
                            style={{
                                height: '100%',
                                maxHeight: `${Math.round(
                                    window.screen.height * 0.6
                                )}px`
                            }}
                            value={qrcode}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Người nhận
                        </dt>
                        <dd className="font-medium text-white">
                            {data?.accountName}
                        </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Nội dung
                        </dt>
                        <dd className="font-medium text-white">
                            {data?.description}
                        </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Số tiền
                        </dt>
                        <dd className="font-medium text-white">
                            {data?.amount / 1000}k
                        </dd>
                    </dl>
                    <div className="flex flex-row gap-4">
                        <button
                            onClick={deny}
                            className="flex w-full items-center justify-center rounded-lg bg-gray-300 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                            Hủy thanh toán
                        </button>
                    </div>
                </>
            );
        case 'requestQR':
            return (
                <>
                    <div className="space-y-4 hidden sm:block">
                        <div className="space-y-2">
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Tổng thanh toán
                                </dt>
                                <dd className="font-medium text-white">
                                    {total / 1000}k
                                </dd>
                            </dl>
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Đăng kí dịch vụ
                                </dt>
                                <dd className="font-medium text-white">
                                    {instant_deduction / 1000}k
                                </dd>
                            </dl>
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Nâng cấp cấu hình
                                </dt>
                                <dd className="font-medium text-white">
                                    {gradual_deduction / 1000}k
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt className="font-bold text-white">
                            Số tiền phải trả
                        </dt>
                        <dd className="font-bold text-white">
                            {total / 1000}k
                        </dd>
                    </dl>
                    {false ? (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Tiết kiệm
                            </dt>
                            <dd className="font-medium text-green-500">
                                -{0}k
                            </dd>
                        </dl>
                    ) : null}
                    <div className="flex flex-row gap-4">
                        <button
                            onClick={() => setStep('picking')}
                            className="flex w-full items-center justify-center rounded-lg bg-gray-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4   focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                            Chọn lại
                        </button>
                        <button
                            onClick={requestQR}
                            className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Thanh toán
                        </button>
                    </div>
                </>
            );
        case 'deduct':
            return (
                <>
                    <div className="space-y-4  hidden sm:block">
                        <div className="space-y-2">
                            <dl className="flex items-center justify-between gap-4  pt-10">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Số dư trong ví (hiện tại)
                                </dt>
                                <dd className="font-medium text-white">
                                    {balance / 1000}k
                                </dd>
                            </dl>
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Trừ từ ví (sau khi thanh toán)
                                </dt>
                                <dd className="font-medium text-white">
                                    -{instant_deduction / 1000}k
                                </dd>
                            </dl>
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Số dư trong ví (sau khi thanh toán)
                                </dt>
                                <dd className="font-medium text-white">
                                    {(balance - instant_deduction) / 1000}k
                                </dd>
                            </dl>
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Trừ từ ví (trong 1 tháng)
                                </dt>
                                <dd className="font-medium text-white">
                                    -{gradual_deduction / 1000}k
                                </dd>
                            </dl>
                            <dl className="flex items-center justify-between gap-4">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Số dư trong ví (sau 1 tháng)
                                </dt>
                                <dd className="font-medium text-white">
                                    {(balance -
                                        instant_deduction -
                                        gradual_deduction) /
                                        1000}
                                    k
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4">
                        {/* <button
                            onClick={() => setStep('requestQR')}
                            className="flex w-full items-center justify-center rounded-lg bg-gray-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4   focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                        >
                            Nạp vào ví
                        </button> */}
                        {plan_name != undefined && !has_subscription ? (
                            <button
                                onClick={register}
                                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Đăng kí và sử dụng
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    appDispatch(app_close('payment'))
                                }
                                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Hoàn tất
                            </button>
                        )}
                    </div>
                </>
            );
        case 'picking':
            return (
                <>
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt className="font-bold text-white">
                            Số tiền phải trả
                        </dt>
                        <dd className="font-bold text-white">
                            {total / 1000}k
                        </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4  pt-10">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Số dư trong ví (hiện tại)
                        </dt>
                        <dd className="font-medium text-white">
                            {balance / 1000}k
                        </dd>
                    </dl>
                    {false ? (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Tiết kiệm
                            </dt>
                            <dd className="font-medium text-green-500">
                                -{0}k
                            </dd>
                        </dl>
                    ) : null}
                    <button
                        onClick={() =>
                            total > 50000 ? setStep('requestQR') : null
                        }
                        className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Tiếp tục
                    </button>
                </>
            );
        default:
            return (
                <button
                    onClick={() => setStep('requestQR')}
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    {step}
                </button>
            );
    }
};

const Stage = ({ step }) => {
    return (
        <div className="mt-6 sm:mt-8 lg:mt-12">
            <div className="grid grid-cols-3 divide-y divide-gray-200 text-start dark:divide-gray-700 lg:gap-8 lg:divide-y-0 lg:text-center">
                <div
                    className={`py-0 flex justify-center  ${
                        step >= 1 ? 'text-blue-500' : 'text-gray-400'
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                        />
                    </svg>

                    <p className="mt-1 text-base font-medium leading-tight lg:text-sm xl:text-base">
                        Lựa chọn
                    </p>
                </div>
                <div
                    className={`py-0 flex justify-center ${
                        step >= 2 ? 'text-blue-500' : 'text-gray-400'
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                        />
                    </svg>

                    <p className="mt-1 text-base font-medium leading-tight lg:text-sm xl:text-base">
                        Nạp tiền
                    </p>
                </div>

                <div
                    className={`py-0 flex justify-center ${
                        step >= 3 ? 'text-blue-500' : 'text-gray-400'
                    }`}
                >
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <p className="mt-1 text-base font-medium leading-tight lg:text-sm xl:text-base">
                        Đăng kí
                    </p>
                </div>
            </div>

            <div className="mt-6 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 sm:mt-8">
                <div
                    className="h-3 rounded-full bg-primary-700 dark:bg-primary-600"
                    style={{
                        width: `${
                            step == 1
                                ? 15
                                : step == 2
                                  ? 50
                                  : step == 3
                                    ? 85
                                    : 100
                        }%`
                    }}
                ></div>
            </div>
        </div>
    );
};
