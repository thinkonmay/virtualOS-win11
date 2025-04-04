import {
    appDispatch,
    refund_request,
    show_chat,
    useAppSelector
} from '../../backend/reducers';

export const RefundPage = () => {
    const refund = () => appDispatch(refund_request());

    const subscription = useAppSelector((state) => state.user.subscription);
    const { total_usage, ended_at, plan_name } = subscription ?? {};
    const another_pending_req = useAppSelector(
        (state) => state.user.wallet.refundRequest?.[0]
    );

    let applicable = false;
    let out_of_day = 0;
    let out_of_time = 0;
    if (plan_name?.includes('week')) {
        out_of_day =
            Date.now() - new Date(ended_at).getTime() > 3 * 24 * 3600 * 1000;
        out_of_time = total_usage > 2;

        applicable =
            subscription != undefined &&
            !out_of_day &&
            !out_of_time &&
            another_pending_req == undefined;
    } else if (plan_name?.includes('month')) {
        out_of_day =
            Date.now() - new Date(ended_at).getTime() > 5 * 24 * 3600 * 1000;
        out_of_time = total_usage > 12;

        applicable =
            subscription != undefined &&
            !out_of_day &&
            !out_of_time &&
            another_pending_req == undefined;
    }

    return (
        <div className="refundPage">
            <div className="title">
                <h2 className="title">Chính sách hoàn lại 80% tiền</h2>
                <p className="m d:max-w-[80% text-xs lg:max-w-[60%] lg:text-base">
                    * Không áp dụng cho các trường hợp người dùng vi phạm điều
                    khoản sử dụng dịch vụ
                </p>
            </div>

            <div className="pl-2 lg:pl-20">
                <h3>Điều kiện áp dụng</h3>
                <div className="flex-row gap-16 mb-5">
                    <div className="mt-3">
                        <h4>Với gói tháng:</h4>
                        <ul>
                            <li>
                                Không quá{' '}
                                <span className="font-bold">5 ngày</span> kể từ
                                thời điểm thanh toán
                            </li>
                            <li>
                                Không quá{' '}
                                <span className="font-bold">12 giờ</span> sử
                                dụng
                            </li>
                        </ul>
                    </div>
                    <div className="mt-3">
                        <h4>Với gói tuần:</h4>
                        <ul>
                            <li>
                                Không quá{' '}
                                <span className="font-bold">2 ngày</span> kể từ
                                thời điểm thanh toán
                            </li>
                            <li>
                                Không quá{' '}
                                <span className="font-bold">3 giờ</span> sử dụng
                            </li>
                        </ul>
                    </div>
                </div>

                <h3 className="mt-8">Quy trình yêu cầu hoàn tiền:</h3>
                <ul className="list-decimal">
                    <li> Click vào yêu cầu hoàn tiền tại đây</li>
                    <li>
                        Mô tả lý do yêu cầu hoàn tiền, lỗi gặp phải (nếu có) với
                        đội hỗ trợ
                    </li>
                    <li>
                        Đội hỗ trợ kĩ thuật sẽ cùng khách hàng khắc phục vấn đề{' '}
                    </li>
                    <li>Gửi QR chuyển tiền & email của bạn vô Fanpage </li>
                    <li>
                        Yêu cầu hoàn tiền sẽ được xử lý trong vòng 1 ngày làm
                        việc.
                    </li>
                </ul>

                {!applicable && subscription != undefined ? (
                    <div>
                        <h3 className="mt-8">
                            Bạn không được áp dụng chính sách hoàn tiền do:
                        </h3>
                        <ul className="list-decimal">
                            {out_of_day ? (
                                <li>
                                    {`Bạn đăng kí từ ngày `}
                                    <span className="font-bold">
                                        {new Date(
                                            subscription?.last_payment
                                        ).toLocaleDateString()}
                                    </span>
                                </li>
                            ) : null}
                            {out_of_time ? (
                                <li>
                                    {`Bạn đã sử dụng tổng cộng `}
                                    <span className="font-bold">
                                        {subscription?.total_usage} giờ chơi
                                    </span>
                                </li>
                            ) : null}
                            {another_pending_req != undefined ? (
                                <li>
                                    {`Bạn đang có một yêu cầu hoàn tiền khác lúc `}
                                    <span className="font-bold">
                                        {new Date(
                                            another_pending_req?.created_at
                                        ).toLocaleString()}
                                    </span>
                                </li>
                            ) : null}
                        </ul>
                    </div>
                ) : null}

                <div className="mt-10 flex-row align-middle">
                    <button
                        onClick={() => appDispatch(show_chat())}
                        className="w-40 h-10 rounded-xl bg-gray-400 text-black mr-3 font-bold"
                    >
                        Tư vấn
                    </button>
                    {applicable ? (
                        <button
                            onClick={refund}
                            className="w-40 h-10 rounded-xl bg-blue-600 text-white font-bold"
                        >
                            Yêu cầu hoàn tiền
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
