import dayjs from 'dayjs';
import { MdOutlineCancelPresentation } from 'react-icons/md';
import {
    appDispatch,
    cancel_payment_pocket,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';

export function pocketCancelPlan({ data: { plan_name } }) {
    const t = useAppSelector((state) => state.globals.translation);
    const { ended_at } = useAppSelector((state) => state.user.subscription);
    const currentOrders = useAppSelector(
        (state) => state.user.wallet.currentOrders
    );
    const handleContinue = () => {
        appDispatch(popup_close());

        //cancel plan
        const planFound = currentOrders.find((o) => o.plan_name == plan_name);

        if (!planFound) return;
        appDispatch(cancel_payment_pocket({ id: planFound.id }));
    };
    return (
        <div className="w-[480px] h-auto px-[24px] py-5 rounded-lg flex flex-col gap-y-3">
            <div className="flex justify-center items-center gap-2 text-[#0067c0]">
                <MdOutlineCancelPresentation className="text-5xl text-[#0067c0]"></MdOutlineCancelPresentation>
                <h2>Xác nhận huỷ gói</h2>
            </div>
            <div>
                <p className="mt-[8px] text-lg text-center">
                    Sau khi hủy gói, bạn vẫn có thể sử dụng Thinkmay tới khi gói
                    hiện tại hết hạn{' '}
                    {ended_at ? (
                        <b>vào ngày {dayjs(ended_at).format('DD/MM/YYYY')}</b>
                    ) : null}
                </p>

                <p className="mt-[8px] text-lg text-center">
                    Sau đó gói hiện tại sẽ không được tự động gia hạn.
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
