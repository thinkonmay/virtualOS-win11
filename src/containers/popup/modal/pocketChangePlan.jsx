import { MdOutlineChangeCircle } from 'react-icons/md';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';

export function pocketChangePlan({
    data: { plan_name, cluster_domain = 'play.thinkmay.net' }
}) {
    const t = useAppSelector((state) => state.globals.translation);

    const handleContinue = () => {
        appDispatch(popup_close());
    };
    return (
        <div className="w-[480px] h-auto px-[24px] py-5 rounded-lg flex flex-col gap-y-3">
            <div className="flex justify-center items-center gap-2 text-[#0067c0]">
                <MdOutlineChangeCircle className="text-5xl text-[#0067c0]"></MdOutlineChangeCircle>
                <h2>Xác nhận chuyển gói</h2>
            </div>
            <div>
                <p className="mt-[8px] text-lg text-center">
                    Sau khi đăng ký gói M2, gói M1 hiện tại vẫn còn hiệu lực tới
                    11:59:59, 26/02/2025.{' '}
                </p>
                <p className="mt-[8px] text-lg text-center">
                    Sau đó Gói M2 sẽ bắt đầu hiệu lực, với giá 1,699K/ tháng.{' '}
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
