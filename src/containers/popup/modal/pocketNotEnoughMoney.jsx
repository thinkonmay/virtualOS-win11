import { MdOutlineAddCard } from 'react-icons/md';
import {
    app_full,
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { numberFormat } from '../../../backend/utils/format';

export function pocketNotEnoughMoney({ data: { plan_name, plan_price } }) {
    const t = useAppSelector((state) => state.globals.translation);
    const wallet = useAppSelector((state) => state.user.wallet);

    const moneyNeed = numberFormat(plan_price - wallet.money);

    const handleContinue = () => {
        appDispatch(popup_close());
        appDispatch(app_full({ id: 'payment', page: 'deposit' }));
    };
    return (
        <div className="w-[480px] h-auto px-[24px] py-5 rounded-lg flex flex-col gap-y-3">
            <div className="flex justify-center items-center gap-2 text-[#0067c0]">
                <MdOutlineAddCard className="text-5xl text-[#0067c0]"></MdOutlineAddCard>
                <h2>Ví của bạn hiện không đủ tiền</h2>
            </div>
            <div>
                <p className="mt-[8px] text-lg text-center">
                    Bạn cần nạp thêm {moneyNeed}đ vào Ví Thinkmay để đăng ký{' '}
                    {plan_name}.{' '}
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
                    Tôi biết
                </button>
            </div>
        </div>
    );
}
