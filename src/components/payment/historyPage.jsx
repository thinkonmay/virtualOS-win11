import { useAppSelector } from '../../backend/reducers';

export const HistoryPage = () => {
    const historyDeposit = useAppSelector(
        (state) => state.user.wallet.historyDeposit
    );
    const historyPayment = useAppSelector(
        (state) => state.user.wallet.historyPayment
    );
    const transactions = [...historyPayment, ...historyDeposit].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const renderName = (name) => {
        switch (name) {
            case 'month1':
                return 'Mua gói tháng';
            case 'month2':
                return 'Mua gói cao cấp';
            case 'week1':
                return 'Mua gói 2 tuần';
            case 'week2':
                return 'Mua gói 1 tuần';
            case 'ramcpu20':
                return 'Nâng lên 20GB RAM & 10cores cpu';
            case '50GB':
                return 'Nâng lên 50GB';
            case '100GB':
                return 'Nâng lên 100GB';
            case '200GB':
                return 'Nâng lên 200GB';
            default:
                return 'Nạp tiền';
        }
    };

    const renderItem = (item) => (
        <div class="w-full flex-col justify-start items-start gap-5 flex pb-5">
            <div class="w-full justify-start items-center lg:gap-8 gap-4 grid md:grid-cols-12 grid-cols-1">
                <div class="md:col-span-8 col-span-12 w-full justify-start items-center lg:gap-5 gap-4 flex md:flex-row flex-col">
                    <img
                        class="rounded-md object-cover"
                        src="logo.png"
                        height="100rem"
                        alt="Pure Cotton T-Shirt image"
                    />
                    <div class="w-full flex-col justify-start md:items-start items-center gap-3 inline-flex">
                        <h4 class=" text-xl font-medium leading-8">
                            {renderName(item.plan_name)}
                        </h4>
                        <div class="flex-col justify-start md:items-start items-center gap-0.5 flex">
                            <h6 class="text-gray-500 text-base font-normal leading-relaxed whitespace-nowrap">
                                ID: {item.id}
                            </h6>
                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                Date:{' '}
                                {new Date(item.created_at).toLocaleString()}
                            </h6>
                        </div>
                    </div>
                </div>
                <div class="md:col-span-4 col-span-12 justify-between items-center gap-4 flex md:flex-row flex-col">
                    <h4 class=" text-xl font-semibold leading-8">
                        {item.amount}
                    </h4>
                </div>
            </div>
        </div>
    );

    return (
        <section class="py-24 relative justify-self-center text-black   ">
            <div class="w-full  px-4 md:px-5 lg:px-5 mx-auto">
                <div class="w-full flex-col justify-start items-start gap-12 inline-flex">
                    <div class="w-full justify-end items-start gap-8 inline-flex">
                        <div class="w-full flex-col justify-start items-start gap-8 inline-flex">
                            <div class="w-full p-8 bg-gray-100 rounded-xl flex-col justify-start items-start gap-5 flex">
                                <h2 class="w-full  text-2xl font-semibold font-manrope leading-9 pb-5 border-b">
                                    Order Items
                                </h2>
                                {transactions.map(renderItem)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
