import { MdInfoOutline } from 'react-icons/md';
import { create_payment_qr } from '../../../backend/actions';
import {
    appDispatch,
    app_toggle,
    popup_close,
    show_chat,
    useAppSelector
} from '../../../backend/reducers';

export function extendService({ data: { type, available_time } }) {
    const money = useAppSelector((state) => state.user.wallet.money);
    const next_plan_name = useAppSelector(
        (state) => state.user.subscription?.next_plan
    );
    const clean_after = useAppSelector((state) =>
        new Date(
            2 * 24 * 3600 * 1000 +
                new Date(state.user.subscription?.ended_at).getTime()
        ).toLocaleDateString()
    );
    const next_plan = useAppSelector((state) =>
        state.user.plans.find((x) => x.name == next_plan_name)
    );

    const deny = () => appDispatch(popup_close(true));
    const support = () => {
        appDispatch(popup_close(true));
        appDispatch(show_chat());
    };
    const qr = async () => {
        appDispatch(popup_close(true));
        await create_payment_qr({ amount: next_plan?.amount - money });
    };
    const changePlan = () => {
        appDispatch(popup_close(true));
        appDispatch(app_toggle('payment'));
    };

    switch (type) {
        case 'date_limit':
            return (
                <div className="w-[360px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
                    <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                        <MdInfoOutline className="text-4xl"></MdInfoOutline>
                        <h3>Dịch vụ đã hết hạn</h3>
                    </div>

                    <div>
                        <p className="mt-[8px]">
                            {`Dữ liệu của bạn sẽ bị xóa sau ${clean_after}`}
                        </p>
                    </div>
                    {next_plan != undefined && next_plan.amount > money
                        ? `Bạn cần nạp thêm ${
                              (next_plan?.amount - money) / 1000
                          }k để gia hạn`
                        : null}
                    <div className="flex gap-3 justify-center mt-3 mb-2">
                        <button
                            style={{ padding: '6px 14px' }}
                            className="text-base font-medium rounded-md"
                            onClick={support}
                        >
                            Tư vấn
                        </button>
                        {next_plan != undefined && next_plan.amount > money ? (
                            <button
                                style={{ padding: '6px 14px' }}
                                onClick={qr}
                                className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                            >
                                Nạp ngay
                            </button>
                        ) : null}
                        <button
                            style={{ padding: '6px 14px' }}
                            onClick={changePlan}
                            className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                        >
                            Chọn gói khác
                        </button>
                    </div>
                </div>
            );
        case 'time_limit':
            return (
                <div className="w-[360px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
                    <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                        <MdInfoOutline className="text-4xl"></MdInfoOutline>
                        <h3>Bạn đã sử dụng hết giới hạn thời gian</h3>
                    </div>

                    <div>
                        <p className="mt-[8px]">
                            {`Dữ liệu của bạn sẽ bị xóa sau ${clean_after}`}
                        </p>
                    </div>
                    {next_plan != undefined && next_plan.amount > money
                        ? `Bạn cần nạp thêm ${
                              (next_plan?.amount - money) / 1000
                          }k để gia hạn`
                        : null}
                    <div className="flex gap-3 justify-center mt-3 mb-2">
                        <button
                            style={{ padding: '6px 14px' }}
                            className="text-base font-medium rounded-md"
                            onClick={support}
                        >
                            Tư vấn
                        </button>
                        {next_plan != undefined && next_plan.amount > money ? (
                            <button
                                style={{ padding: '6px 14px' }}
                                onClick={qr}
                                className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                            >
                                Nạp ngay
                            </button>
                        ) : null}
                        <button
                            style={{ padding: '6px 14px' }}
                            onClick={changePlan}
                            className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                        >
                            Chọn gói khác
                        </button>
                    </div>
                </div>
            );
        case 'near_date_limit':
            return (
                <div className="w-[360px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
                    <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                        <MdInfoOutline className="text-4xl"></MdInfoOutline>
                        <h3>Gói của bạn sắp hết hạn</h3>
                    </div>

                    <div>
                        <p className="mt-[8px] justify-center">
                            {`Còn lại ${available_time} ngày`}
                            <br />
                            {next_plan != undefined && next_plan.amount > money
                                ? `Bạn cần nạp thêm ${
                                      (next_plan?.amount - money) / 1000
                                  }k để gia hạn`
                                : null}
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end mt-3 mb-2">
                        <button
                            style={{ padding: '6px 14px' }}
                            className="text-base font-medium rounded-md"
                            onClick={deny}
                        >
                            Đóng
                        </button>
                        {next_plan != undefined && next_plan.amount > money ? (
                            <button
                                style={{ padding: '6px 14px' }}
                                onClick={qr}
                                className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                            >
                                Nạp ngay
                            </button>
                        ) : null}
                        <button
                            style={{ padding: '6px 14px' }}
                            onClick={changePlan}
                            className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                        >
                            Chọn gói khác
                        </button>
                    </div>
                </div>
            );
        case 'near_time_limit':
            return (
                <div className="w-[360px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
                    <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                        <MdInfoOutline className="text-4xl"></MdInfoOutline>
                        <h3>Bạn sắp sử dụng hết số giờ chơi</h3>
                    </div>

                    <div>
                        <p className="mt-[8px]">
                            {`Còn lại ${available_time} giờ sử dụng`}
                            <br />
                            {next_plan != undefined && next_plan.amount > money
                                ? `Bạn cần nạp thêm ${
                                      (next_plan?.amount - money) / 1000
                                  }k để gia hạn`
                                : null}
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end mt-3 mb-2">
                        <button
                            style={{ padding: '6px 14px' }}
                            className="text-base font-medium rounded-md"
                            onClick={deny}
                        >
                            Đóng
                        </button>
                        {next_plan != undefined && next_plan.amount > money ? (
                            <button
                                style={{ padding: '6px 14px' }}
                                onClick={qr}
                                className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                            >
                                Nạp ngay
                            </button>
                        ) : null}
                        <button
                            style={{ padding: '6px 14px' }}
                            onClick={changePlan}
                            className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                        >
                            Chọn gói khác
                        </button>
                    </div>
                </div>
            );
    }
}
