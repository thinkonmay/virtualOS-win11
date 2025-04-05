import { useEffect, useState } from 'react';
import { create_payment_qr } from '../../backend/actions';
import { useAppSelector } from '../../backend/reducers';

export const PaymentPage = ({ value }) => {
    const plans = useAppSelector((state) => state.user.plans);
    const [planAmount, setplanAmount] = useState({});
    const [planCount, setplanCount] = useState({});
    let total = 0;
    let count = 0;
    for (const key in planAmount) total += planAmount[key];
    for (const key in planCount) count += planCount[key];

    const pay = (e) =>
        total > 0 ? create_payment_qr({ amount: total }) : null;

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
        }
    ];

    const renderPlan = (plan, index) => {
        const [quantity, setQuantity] = useState(0);

        useEffect(() => {
            if (value.plan == plan.name)
                set(1)
        },[])

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
                className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group cursor-pointer"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                    <div className="md:col-span-2">
                        <div className="flex flex-col max-[500px]:items-center gap-3">
                            <h6 className="font-semibold text-base leading-7 text-white">
                                {plan.title}
                            </h6>
                            <h6 className="font-normal text-base leading-7 text-gray-500">
                                {plan.name}
                            </h6>
                            <h6 className="font-medium text-base leading-7 text-gray-400 transition-all duration-300 group-hover:text-blue-600">
                                {plan.amount / 1000}k
                            </h6>
                        </div>
                    </div>
                    <div className="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
                        <div className="flex items-center h-full">
                            <button
                                onClick={() => increase(-1)}
                                className="bg-gray-300 group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                            >
                                <svg
                                    className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                >
                                    <path
                                        d="M16.5 11H5.5"
                                        stroke=""
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M16.5 11H5.5"
                                        stroke=""
                                        strokeOpacity="0.2"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M16.5 11H5.5"
                                        stroke=""
                                        strokeOpacity="0.2"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <input
                                type="text"
                                className="border-y bg-gray-900 outline-none text-white font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-white py-[15px]  text-center bg-transparent"
                                placeholder="0"
                                value={quantity}
                                onChange={(x) => set(x.target.value)}
                            />
                            <button
                                onClick={() => increase(1)}
                                className="bg-gray-300 group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                            >
                                <svg
                                    className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                >
                                    <path
                                        d="M11 5.5V16.5M16.5 11H5.5"
                                        stroke=""
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M11 5.5V16.5M16.5 11H5.5"
                                        stroke=""
                                        strokeOpacity="0.2"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M11 5.5V16.5M16.5 11H5.5"
                                        stroke=""
                                        strokeOpacity="0.2"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
                        <p className="font-bold text-lg leading-8 text-gray-300 text-center transition-all duration-300 group-hover:text-blue-600">
                            {(plan.amount * quantity) / 1000}k
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="w-full h-full px-4 md:px-5 lg-6 mx-auto relative z-10 rounded"
            style={{ color: `var(--dark-txt)` }}
        >
            <div className="grid grid-cols-12">
                <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
                    <div className="flex items-center justify-between pb-8 border-b border-gray-300">
                        <h2 className="font-manrope font-bold text-3xl leading-10 text-white">
                            Shopping Cart
                        </h2>
                        <h2 className="font-manrope font-bold text-xl leading-8 text-white">
                            {count} Items
                        </h2>
                    </div>
                    <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
                        <div className="col-span-12 md:col-span-6">
                            <p className="font-normal text-lg leading-8 text-gray-400">
                                Product Details
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <div className="grid grid-cols-5">
                                <div className="col-span-3">
                                    <p className="font-normal text-lg leading-8 text-gray-400 text-left">
                                        Quantity
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-normal text-lg leading-8 text-gray-400 text-right">
                                        Total
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {plans
                        .map((x) => ({
                            ...x,
                            ...(subcontents.find((y) => y.name == x.name) ?? {})
                        }))
                        .filter((val) => val.title != null)
                        .sort((a, b) => a.amount - b.amount)
                        .map(renderPlan)}
                </div>
                <div className="mt-10 rounded-xl col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto  py-24 p-10">
                    <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300 justify-self-center">
                        Order Summary
                    </h2>
                    <div className="mt-8 justify-self-center">
                        <div className="flex items-center justify-between pb-6">
                            <p className="font-normal text-lg leading-8 text-black">
                                {count} Items
                            </p>
                            <p className="font-medium text-lg leading-8 text-black">
                                {total / 1000}k
                            </p>
                        </div>
                        <label className="flex  items-center mb-1.5 text-whtie text-sm font-medium">
                            Shipping
                        </label>
                        <div className="flex pb-6"></div>
                        <label className="flex items-center mb-1.5 text-gray-400 text-sm font-medium">
                            Promo Code
                        </label>
                        <div className="flex pb-4 w-full">
                            <div className="relative w-full ">
                                <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300"></div>
                                <input
                                    type="text"
                                    className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                    placeholder="xxxx xxxx xxxx"
                                />
                            </div>
                        </div>
                        <div className="flex items-center border-b border-gray-200">
                            <button className="rounded-lg w-full bg-black py-2.5 px-4 text-white text-sm font-semibold text-center mb-8 transition-all duration-500 hover:bg-black/80">
                                Apply
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-8">
                            <p className="font-medium text-xl leading-8 text-black">
                                {count} Items
                            </p>
                            <p className="font-semibold text-xl leading-8 text-blue-600">
                                {total / 1000}k
                            </p>
                        </div>
                        <button
                            onClick={pay}
                            className="w-full text-center bg-blue-600 rounded-xl py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-blue-700"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
