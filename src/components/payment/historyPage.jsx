import { useState } from 'react';
import { useAppSelector } from '../../backend/reducers';
const listHistoryNav = [
    {
        name: 'Tất cả',
        id: 'all'
    },
    {
        name: 'Nạp tiền',
        id: 'deposit'
    },
    {
        name: 'Đăng kí',
        id: 'buy'
    },
    {
        name: 'Nâng cấp',
        id: 'upgrade'
    }
];

export const HistoryPage = () => {
    const historyDeposit = useAppSelector(
        (state) => state.user.wallet.historyDeposit
    );
    const historyPayment = useAppSelector(
        (state) => state.user.wallet.historyPayment
    );
    const [currentNav, setNav] = useState('all'); //all-deposit-upgrade-buy
    const [currentData, setCurrentData] = useState(
        [...historyPayment, ...historyDeposit].sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
    );

    const handleChangeNav = (nav) => {
        setNav(nav);

        switch (nav) {
            case 'all':
                setCurrentData([...historyPayment, ...historyDeposit]);
                break;
            case 'deposit':
                setCurrentData([...historyDeposit]);
                break;

            case 'buy':
                setCurrentData([...historyPayment]);
                break;
            case 'upgrade':
                setCurrentData([]);
                break;

            default:
                break;
        }
    };
    const renderNameDeteils = (name) => {
        let nameFormat = 'Nạp tiền';
        switch (name) {
            case 'month1':
                nameFormat = 'Mua gói tháng';
                break;

            case 'month2':
                nameFormat = 'Mua gói cao cấp';
                break;

            case 'week1':
                nameFormat = 'Mua gói 2 tuần';
                break;
            case 'week2':
                nameFormat = 'Mua gói 1 tuần';
                break;
            case 'ramcpu20':
                nameFormat = 'Nâng lên 20GB RAM & 10cores cpu';
                break;
            case '50GB':
                nameFormat = 'Nâng lên 50GB';
                break;
            case '100GB':
                nameFormat = 'Nâng lên 100GB';
                break;
            case '200GB':
                nameFormat = 'Nâng lên 200GB';
                break;

            default:
                break;
        }

        return nameFormat;
    };

    return (
        <section class="py-24 relative justify-self-center">
            <div class="w-full  px-4 md:px-5 lg:px-5 mx-auto">
                <div class="w-full flex-col justify-start items-start gap-12 inline-flex">
                    <div class="w-full justify-end items-start gap-8 inline-flex">
                        <div class="w-full flex-col justify-start items-start gap-8 inline-flex">
                            <div class="w-full p-8 bg-gray-600 rounded-xl flex-col justify-start items-start gap-5 flex">
                                <h2 class="w-full text-gray-900 text-2xl font-semibold font-manrope leading-9 pb-5 border-b border-gray-200">
                                    Order Items
                                </h2>
                                <div class="w-full flex-col justify-start items-start gap-5 flex pb-5 border-b border-gray-200">
                                    <div class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                        <div class="md:col-span-8 col-span-12 w-full justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                            <img
                                                class="rounded-md object-cover"
                                                src="https://pagedone.io/asset/uploads/1718189222.png"
                                                alt="Pure Cotton T-Shirt image"
                                            />
                                            <div class="w-full flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                <h4 class="text-gray-900 text-xl font-medium leading-8">
                                                    Pure Cotton Regular Fit
                                                    T-Shirt
                                                </h4>
                                                <div class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed whitespace-nowrap">
                                                        Size: M
                                                    </h6>
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Color: White
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                            <h4 class="text-gray-500 text-xl font-semibold leading-8">
                                                $40 x 2
                                            </h4>
                                            <h4 class="text-gray-900 text-xl font-semibold leading-8">
                                                $80
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                        <div class="md:col-span-8 col-span-12 w-full justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                            <img
                                                class="rounded-md object-cover"
                                                src="https://pagedone.io/asset/uploads/1718189265.png"
                                                alt="Men Stretchable Jeans image"
                                            />
                                            <div class="w-full flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                <h4 class="text-gray-900 text-xl font-medium leading-8">
                                                    Men Skinny Fit Stretchable
                                                    Jeans
                                                </h4>
                                                <div class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Size: 32
                                                    </h6>
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Color: Blue
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                            <h4 class="text-gray-500 text-xl font-semibold leading-8">
                                                $52 x 1
                                            </h4>
                                            <h4 class="text-gray-900 text-xl font-semibold leading-8">
                                                $52
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                                        <div class="md:col-span-8 col-span-12 justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                            <img
                                                class="rounded-md object-cover"
                                                src="https://pagedone.io/asset/uploads/1718189276.png"
                                                alt="Men Cotton Casual Shirt image"
                                            />
                                            <div class="flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                <h4 class="text-gray-900 text-xl font-medium leading-8">
                                                    Men Checked Cotton Casual
                                                    Shirt
                                                </h4>
                                                <div class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Size: M
                                                    </h6>
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Color: Dark Blue
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                            <h4 class="text-gray-500 text-xl font-semibold leading-8">
                                                $22 x 1
                                            </h4>
                                            <h4 class="text-gray-900 text-xl font-semibold leading-8">
                                                $22
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1 pb-2.5">
                                        <div class="md:col-span-8 col-span-12 justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                                            <img
                                                class="rounded-md object-cover"
                                                src="https://pagedone.io/asset/uploads/1718189288.png"
                                                alt="Men Colourblocked PU Sneakers image"
                                            />
                                            <div class="flex-col justify-start md:items-start items-center gap-3 inline-flex">
                                                <h4 class="text-gray-900 text-xl font-medium leading-8">
                                                    Men Colourblocked PU
                                                    Sneakers
                                                </h4>
                                                <div class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Size: 38
                                                    </h6>
                                                    <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                        Color: Green & Gray
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                                            <h4 class="text-gray-500 text-xl font-semibold leading-8">
                                                $56 x 1
                                            </h4>
                                            <h4 class="text-gray-900 text-xl font-semibold leading-8">
                                                $56
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full flex-col justify-start items-start gap-5 flex">
                                    <div class="w-full pb-1.5 flex-col justify-start items-start gap-4 flex">
                                        <div class="w-full justify-between items-start gap-6 inline-flex">
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                Subtotal
                                            </h6>
                                            <h6 class="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                $210.00
                                            </h6>
                                        </div>
                                        <div class="w-full justify-between items-start gap-6 inline-flex">
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                Shipping Charge
                                            </h6>
                                            <h6 class="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                $10.00
                                            </h6>
                                        </div>
                                        <div class="w-full justify-between items-start gap-6 inline-flex">
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                Tax Fee
                                            </h6>
                                            <h6 class="text-right text-gray-500 text-base font-medium leading-relaxed">
                                                $22.00
                                            </h6>
                                        </div>
                                    </div>
                                    <div class="w-full justify-between items-start gap-6 inline-flex">
                                        <h5 class="text-gray-900 text-lg font-semibold leading-relaxed">
                                            Total
                                        </h5>
                                        <h5 class="text-right text-gray-900 text-lg font-semibold leading-relaxed">
                                            $242.00
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
