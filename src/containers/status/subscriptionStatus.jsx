import { useEffect, useState } from 'react';
import { useAppSelector } from '../../backend/reducers';
import { numberFormat } from '../../backend/utils/format';

function SubscriptionPaidStatus() {
    const planStatus = useAppSelector((state) => state.user.wallet.planStatus);

    const [show, setShow] = useState(planStatus.length >= 1);

    useEffect(() => {
        setShow(planStatus.length >= 1);
    }, [planStatus]);

    const renderTitle = () => {
        let title = 'Các lệnh nạp tiền';
        if (planStatus?.length > 1) {
            title = 'Các lệnh nạp tiền';
        } else if (planStatus?.length == 1) {
            title = `Lệnh nạp ${numberFormat(planStatus[0].amount)} vnđ`;
        }
        return title;
    };

    return (
        <>
            {show ? (
                <div className="absolute z-10 top-10 left-2 flex justify-center">
                    <div className="flex flex-col bg-green-600 text-white rounded-md rounded-br-none px-6 py-4">
                        <h3 className="mb-2">
                            Các lệnh mua gói của bạn đang được xử lí!
                        </h3>

                        <p className="mt-1">
                            Bạn vui lòng đợi từ 2-5' sau đó tải lại trang để cập
                            nhật, <br /> liên hệ Fanpage nếu gặp lỗi!
                        </p>

                        <button
                            onClick={() => {
                                setShow(false);
                            }}
                            className="instbtn bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 ml-auto mt-4 text-[14px] font-bold"
                        >
                            Tôi biết!
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default SubscriptionPaidStatus;
