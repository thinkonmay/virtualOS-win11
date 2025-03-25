import { MdCheckCircleOutline } from 'react-icons/md';
import { appDispatch, popup_close } from '../../../backend/reducers';
import { create_payment_pocket } from '../../../backend/actions';

export function pocketBuyConfirm({ data }) {
    const handleContinue = () => create_payment_pocket({...data,synchronous:true});

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
            </div>
            <div className="flex gap-3 justify-center mt-3 mb-2">
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
