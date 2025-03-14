import { useEffect, useState } from 'react';
import { useAppSelector } from '../../backend/reducers';
import { numberFormat } from '../../backend/utils/format';

function PaymentStatus() {
    const depositStatus = useAppSelector(
        (state) => state.user.wallet.depositStatus
    );

    const [show, setShow] = useState(depositStatus.length >= 1);

    useEffect(() => {
        setShow(depositStatus.length >= 1);
    }, [depositStatus]);
    const renderTitle = () => {
        let title = 'Các lệnh nạp tiền';
        if (depositStatus?.length > 1) {
            title = 'Các lệnh nạp tiền';
        } else if (depositStatus?.length == 1) {
            title = `Lệnh nạp ${numberFormat(depositStatus[0].amount)} đ`;
        }
        return title;
    };

    return (
        <>
            {show ? (
                <div className="absolute z-10 top-10 right-2 flex justify-center">
                    <div className="flex flex-col bg-blue-600 text-white rounded-md rounded-br-none px-6 py-4">
                        <h3 className="mb-2">
                            {renderTitle()} đang được xử lí!
                        </h3>

                        <p>
                            Nếu bạn đã nạp thành công, tiền sẽ được công vào ví
                            sau 2-5'
                        </p>
                        <p className="mt-1">
                            Vui lòng tải lại trang để cập nhật, liên hệ Fanpage
                            nếu gặp lỗi!
                        </p>

                        <button
                            onClick={() => {
                                setShow(false);
                            }}
                            className="instbtn bg-green-600 text-white px-4 py-2 hover:bg-green-700 ml-auto mt-4 text-[14px] font-bold"
                        >
                            Tôi biết!
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default PaymentStatus;
