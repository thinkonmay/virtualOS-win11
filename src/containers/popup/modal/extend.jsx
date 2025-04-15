import { MdInfoOutline } from 'react-icons/md';
import { create_payment_qr } from '../../../backend/actions';
import {
    appDispatch,
    app_full,
    app_toggle,
    popup_close,
    show_chat,
    useAppSelector
} from '../../../backend/reducers';
import { SubscriptionPage } from '../../../components/payment/subsriptionPage';

export function extendService({ data: { type, available_time } }) {
    const clean_after = useAppSelector((state) =>
        new Date(
            2 * 24 * 3600 * 1000 +
                new Date(state.user.subscription?.ended_at).getTime()
        ).toLocaleDateString()
    );

    const deny = () => appDispatch(popup_close());
    const changePlan = () => {
        appDispatch(popup_close());
        appDispatch(
            app_full({
                id: 'payment',
                page: 'payment',
            })
        );
    };

    switch (type) {
        case 'date_limit':
        case 'time_limit':
            return (
                <div
                    id="pro-version-popup"
                    tabIndex="-1"
                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full"
                    style={{
                        backdropFilter: 'brightness(0.2)'
                    }}
                >
                    <div className="relative p-4 w-full max-w-7xl max-h-full">
                        <div className="md:p-8 p-4 shadow dark:bg-gray-950 rounded-lg bg-white">
                            <div className="flex items-center">
                                <a
                                    href="https://flowbite.com"
                                    className="me-3 flex items-center"
                                >
                                    <img
                                        src="logo.png"
                                        className="me-2 h-8"
                                        alt="Flowbite Logo"
                                    />
                                    <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                                        Đã đạt giới hạn sử dụng
                                    </span>
                                </a>
                                {/* <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                    discount
                                </span> */}
                            </div>
                            <p className="mb-4 border-b border-t border-gray-200 py-4 text-lg text-gray-500 dark:border-gray-700 dark:text-white md:mb-6 md:py-6 md:text-xl">
                                {type == 'time_limit' ? 'Bạn đã đạt số giờ chơi tối đa' : 'Gói của bạn đã hết hạn'}
                                <br/>
                                Dữ liệu của bạn sẽ bị xóa sau ngày {clean_after}
                                <br/>
                                Thanh toán ngay để tránh gián đoạn dịch vụ
                            </p>
                            <SubscriptionPage
                                onlyPlan={true}
                                switchPage={changePlan}
                            ></SubscriptionPage>
                        </div>
                    </div>
                </div>
            );
        case 'near_date_limit':
        case 'near_time_limit':
            return (
                <div
                    id="pro-version-popup"
                    tabIndex="-1"
                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full"
                    style={{
                        backdropFilter: 'brightness(0.2)'
                    }}
                >
                    <div className="relative p-4 w-full max-w-7xl max-h-full">
                        <div className="md:p-8 p-4 shadow dark:bg-gray-950 rounded-lg bg-white">
                            <div className="flex items-center">
                                <a
                                    href="https://flowbite.com"
                                    className="me-3 flex items-center"
                                >
                                    <img
                                        src="logo.png"
                                        className="me-2 h-8"
                                        alt="Flowbite Logo"
                                    />
                                    <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                                        Sắp tới giới hạn sử dụng
                                    </span>
                                </a>
                                {/* <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                                    discount
                                </span> */}
                            </div>
                            <p className="mb-4 border-b border-t border-gray-200 py-4 text-lg text-gray-500 dark:border-gray-700 dark:text-white md:mb-6 md:py-6 md:text-xl">
                                Bạn còn lại {available_time}{type == 'near_date_limit' ? ' ngày' : ' giờ'} sử dụng
                                <br></br>
                                Thanh toán ngay để tránh gián đoạn dịch vụ, sau đó hệ thống sẽ tự động gia hạn
                            </p>
                            <SubscriptionPage
                                onlyPlan={true}
                                switchPage={changePlan}
                            ></SubscriptionPage>
                            <div className="sn:flex items-center space-y-4 sm:space-x-4 sm:space-y-0">
                                <button
                                    type="button"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
                                    onClick={deny}
                                >
                                    Lúc khác
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}

// <div className="w-[360px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
//                 <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
//                     <MdInfoOutline className="text-4xl"></MdInfoOutline>
//                     <h3>Gói của bạn sắp hết hạn</h3>
//                 </div
//                 <div>
//                     <p className="mt-[8px] justify-center">
//                         {`Còn lại ${available_time} ngày`}
//                         <br />
//                         {next_plan != undefined && next_plan.amount > money
//                             ? `Bạn cần nạp thêm ${
//                                   (next_plan?.amount - money) / 1000
//                               }k để gia hạn`
//                             : null}
//                     </p>
//                 </div>
//                 <div className="flex gap-3 justify-end mt-3 mb-2">
//                     <button
//                         style={{ padding: '6px 14px' }}
//                         className="text-base font-medium rounded-md"
//                         onClick={deny}
//                     >
//                         Đóng
//                     </button>
//                     {next_plan != undefined && next_plan.amount > money ? (
//                         <button
//                             style={{ padding: '6px 14px' }}
//                             onClick={qr}
//                             className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
//                         >
//                             Nạp ngay
//                         </button>
//                     ) : null}
//                     <button
//                         style={{ padding: '6px 14px' }}
//                         onClick={changePlan}
//                         className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
//                     >
//                         Chọn gói khác
//                     </button>
//                 </div>
//             </div>

// <div className="w-[360px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
//     <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
//         <MdInfoOutline className="text-4xl"></MdInfoOutline>
//         <h3>Bạn sắp sử dụng hết số giờ chơi</h3>
//     </div
//     <div>
//         <p className="mt-[8px]">
//             {`Còn lại ${available_time} giờ sử dụng`}
//             <br />
//             {next_plan != undefined && next_plan.amount > money
//                 ? `Bạn cần nạp thêm ${
//                       (next_plan?.amount - money) / 1000
//                   }k để gia hạn`
//                 : null}
//         </p>
//     </div>
//     <div className="flex gap-3 justify-end mt-3 mb-2">
//         <button
//             style={{ padding: '6px 14px' }}
//             className="text-base font-medium rounded-md"
//             onClick={deny}
//         >
//             Đóng
//         </button>
//         {next_plan != undefined && next_plan.amount > money ? (
//             <button
//                 style={{ padding: '6px 14px' }}
//                 onClick={qr}
//                 className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
//             >
//                 Nạp ngay
//             </button>
//         ) : null}
//         <button
//             style={{ padding: '6px 14px' }}
//             onClick={changePlan}
//             className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
//         >
//             Chọn gói khác
//         </button>
//     </div>
// </div
