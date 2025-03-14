import { MdOutlineChangeCircle } from 'react-icons/md';
import { modify_payment_pocket } from '../../../backend/actions';
import { appDispatch, popup_close } from '../../../backend/reducers';
import { numberFormat } from '../../../backend/utils/format';

export function pocketChangePlan({
    data: { plan_name, plan_price, plan_title, oldPlanId }
}) {
    const handleContinue = () =>
        modify_payment_pocket({ plan_name, id: oldPlanId });

    return (
        <div className="w-[480px] h-auto px-[24px] py-5 rounded-lg flex flex-col gap-y-3">
            <div className="flex justify-center items-center gap-2 text-[#0067c0]">
                <MdOutlineChangeCircle className="text-5xl text-[#0067c0]"></MdOutlineChangeCircle>
                <h2>Xác nhận chuyển gói</h2>
            </div>
            <div>
                <p className="mt-[8px] text-lg text-center">
                    Sau khi đăng ký {plan_title}, gói hiện tại vẫn còn hiệu lực
                    tới khi hết hạn.
                </p>
                <p className="mt-[8px] text-lg text-center">
                    Sau đó {plan_title} sẽ bắt đầu hiệu lực, với giá{' '}
                    {numberFormat(plan_price)} đ.{' '}
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
