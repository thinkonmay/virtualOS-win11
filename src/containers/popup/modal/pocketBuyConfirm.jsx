import { MdCheckCircleOutline } from 'react-icons/md';
import {
    appDispatch,
    create_payment_pocket,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';

export function pocketBuyConfirm({
    data: { plan_name, cluster_domain = 'play.thinkmay.net' }
}) {
    const t = useAppSelector((state) => state.globals.translation);

    const handleContinue = () => {
        appDispatch(popup_close());
        appDispatch(create_payment_pocket({ plan_name, cluster_domain }));
    };
    return (
        <div className="w-[480px] h-auto px-[24px] py-5 rounded-lg flex flex-col gap-y-3">
            <div className="flex justify-center items-center gap-2 text-[#0067c0]">
                <MdCheckCircleOutline className="text-5xl text-[#0067c0]"></MdCheckCircleOutline>
                <h2>Xác nhận đăng ký gói</h2>
            </div>
            <div>
                <p className="mt-[8px] text-lg text-center">
                    Sau khi xác nhận tiền trong ví sẽ bị trừ
                </p>
                <p className="mt-[8px] text-lg text-center">
                    Bạn vui lòng đợi 10s sau đó tải lại trang để gói được cập
                    nhật
                </p>
            </div>
            <div className="flex gap-3 justify-end mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className="text-base font-medium rounded-md"
                    onClick={() => {
                        appDispatch(popup_close());
                    }}
                >
                    Huỷ
                </button>
                <button
                    style={{ padding: '6px 14px' }}
                    onClick={handleContinue}
                    className="cursor-pointer justify-center  text-base font-medium instbtn h-[40px] rounded-md"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
}
