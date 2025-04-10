import { useEffect, useState } from 'react';
import { create_payment_qr } from '../../backend/actions';
import { useAppSelector } from '../../backend/reducers';

export const PaymentPage = ({ value }) => {
    const email = useAppSelector((state) => state.user.email);
    const plans = useAppSelector((state) => state.user.plans);
    const resources = useAppSelector((state) => state.user.resources);
    const [planAmount, setplanAmount] = useState({});
    const [planCount, setplanCount] = useState({});
    let total = 0;
    let count = 0;
    for (const key in planAmount) total += planAmount[key];
    for (const key in planCount) count += planCount[key];

    const pay = () => (total > 0 ? create_payment_qr({ amount: total }) : null);

    const subcontents = [
        {
            title: 'Gói 2 tuần',
            name: 'week1'
        },
        {
            title: '100GB dung lượng',
            name: 'ramdisk'
        },
        {
            title: 'Gói tháng',
            name: 'month1'
        },
        {
            title: 'Gói cao cấp',
            name: 'month2'
        },

        {
            title: '12 vCPUs 1 tháng',
            multiply: 30,
            name: 'cpu12'
        },
        {
            title: '10 vCPUs 1 tháng',
            multiply: 30,
            name: 'cpu10'
        },
        {
            title: '24GB RAM 1 tháng',
            multiply: 30,
            name: 'ram24'
        },
        {
            title: 'Tài khoản game 1 tháng',
            multiply: 30,
            name: 'kickey'
        },
        {
            title: '20GB RAM 1 tháng',
            multiply: 30,
            name: 'ram20'
        }
    ];

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
            setplanCount((old) => {
                old[plan.name] = quantity + val;
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
            setplanCount((old) => {
                old[plan.name] = val;
                return old;
            });
        };

        return (
            <div
                key={index}
                className="flex flex-wrap items-center space-y-6 p-6 sm:gap-6 sm:space-y-0 md:justify-between"
            >
                <div className="w-64 items-center space-y-4 sm:flex sm:space-x-6 sm:space-y-0 md:max-w-md lg:max-w-lg">
                    <a href="#" className="block aspect-square w-10 shrink-0">
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
                    <p className="text-base font-normal text-gray-900 dark:text-white">
                        {plan.amount / 1000}k
                    </p>
                </div>

                <div className="items-center w-8 mx-8">
                    <button
                        onClick={() => increase(1)}
                        className="bg-gray-300 group rounded-t-full w-full py-0 border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                    >
                        <svg
                            className="w-8 h-8 text-black"
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
                                d="m5 15 7-7 7 7"
                            />
                        </svg>
                    </button>
                    <input
                        type="text"
                        className="border-y bg-gray-900 outline-none text-white font-semibold text-lg w-full placeholder:text-white py-1  text-center bg-transparent"
                        placeholder="0"
                        value={quantity}
                        onChange={(x) => set(x.target.value)}
                    />
                    <button
                        onClick={() => increase(-1)}
                        className="bg-gray-300 group rounded-b-full w-full py-0 border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                    >
                        <svg
                            className="w-8 h-8 text-black"
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
                                d="m19 9-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>

                <div className="md:w-24 md:text-right">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                        {(plan.amount * quantity) / 1000}k
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div
            className="w-full h-full px-4 md:px-5 lg-6 mx-auto relative z-10 rounded"
            style={{ color: `var(--dark-txt)` }}
        >
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-8">
                    <div className="min-w-0 flex-1 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-6 mt-6 flex justify-left">
                            <h2 className=" text-2xl font-semibold text-gray-900 dark:text-white">
                                Order Details
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
                        <div className="p-6">
                            <h4 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                Order Details
                            </h4>

                            <div className="flow-root">
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <dl className="pb-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                        <dt className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                                            Order date
                                        </dt>
                                        <dd className="mt-2 text-gray-500 dark:text-gray-400 sm:mt-0 sm:text-right">
                                            {new Date().toLocaleDateString()}
                                        </dd>
                                    </dl>

                                    <dl className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                        <dt className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                                            Email
                                        </dt>
                                        <dd className="mt-2 text-gray-500 dark:text-gray-400 sm:mt-0 sm:text-right">
                                            {email}
                                        </dd>
                                    </dl>
                                    <dl className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                        <dt className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
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
                        <div className="flex space-y-4 p-6">
                            <div className="flex justify-between relative w-full ">
                                <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300"></div>
                                <input
                                    type="text"
                                    className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                    placeholder="Enter your promotion code"
                                />
                                <button className=" bg-gray-700 text-white p-2 rounded-md flex justify-center items-center hover:opacity-80 ml-3">
                                    {false ? (
                                        <>
                                            Apply
                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white ml-1"
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
                                    ) : false ? (
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
                                                    fill-rule="evenodd"
                                                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                                    clip-rule="evenodd"
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

                        <div className="space-y-4 p-6">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order amount
                            </h4>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">
                                            Original price
                                        </dt>
                                        <dd className="font-medium text-gray-900 dark:text-white">
                                            {total / 1000}k
                                        </dd>
                                    </dl>

                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">
                                            Savings
                                        </dt>
                                        <dd className="font-medium text-green-500">
                                            -{0}k
                                        </dd>
                                    </dl>
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">
                                            Tax
                                        </dt>
                                        <dd className="font-medium text-gray-900 dark:text-white">
                                            {total / 1000}k
                                        </dd>
                                    </dl>
                                </div>

                                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                    <dt className="font-bold text-gray-900 dark:text-white">
                                        Total
                                    </dt>
                                    <dd className="font-bold text-gray-900 dark:text-white">
                                        {total / 1000}k
                                    </dd>
                                </dl>
                            </div>

                            <button
                                onClick={pay}
                                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5  py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4   focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Place your order
                            </button>

                            <p className="max-w-xs text-sm font-normal text-gray-500 dark:text-gray-400">
                                By placing your order, you agree to Flowbite's{' '}
                                <a
                                    href="#"
                                    title=""
                                    className="text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                                >
                                    privacy note
                                </a>{' '}
                                and{' '}
                                <a
                                    href="#"
                                    title=""
                                    className="text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                                >
                                    terms of use
                                </a>
                                .
                            </p>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-6 dark:bg-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
