import { MdInfoOutline } from 'react-icons/md';
import { UserEvents } from '../../../../src-tauri/api';
import {
    appDispatch,
    app_toggle,
    popup_close
} from '../../../backend/reducers';

export function extendService({ data: { type, to, available_time } }) {
    const deny = () => {
        UserEvents({
            type: 'payment/extends_service_denied',
            payload: { type, to, available_time }
        });
        appDispatch(popup_close());
    };
    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-5">
            <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-4xl"></MdInfoOutline>
                <h3>Dịch vụ sắp hết hạn</h3>
            </div>

            <div>
                <p className="mt-[8px]">
                    {type == 'hour_limit' && available_time != undefined ? (
                        <>
                            <b>Thời gian:</b> {to}
                            <br />
                            <b>Số giờ còn lại:</b> {available_time.toFixed(1)}h
                            <br />
                        </>
                    ) : (
                        <>
                            Thời gian: <br /> {to}
                        </>
                    )}
                    <br></br>
                    <b>Lưu ý:</b> Dữ liệu sẽ bị xoá sau khi hết hạn
                    <br></br>
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
                <button
                    style={{ padding: '6px 14px' }}
                    onClick={() => appDispatch(app_toggle('payment'))}
                    className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                >
                    Gia hạn ngay
                </button>
            </div>
        </div>
    );
}
