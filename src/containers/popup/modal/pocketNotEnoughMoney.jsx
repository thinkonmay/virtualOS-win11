import { MdOutlineAddCard } from 'react-icons/md';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { numberFormat } from '../../../backend/utils/format';
import { create_payment_qr } from '../../../backend/actions';

export function pocketNotEnoughMoney({ data: { plan_price } }) {
    const t = useAppSelector((state) => state.globals.translation);
    const wallet = useAppSelector((state) => state.user.wallet);
    const handleContinue = async () => {
        appDispatch(popup_close());
        await create_payment_qr({
            amount: plan_price - (wallet?.money ?? 0)
        });
    };

    return (
        <div className="w-120 h-auto px-[24px] py-5 rounded-lg flex flex-col gap-y-3">
            <div className="flex justify-center items-center gap-2 text-[#0067c0]">
                <MdOutlineAddCard className="text-5xl text-[#0067c0]"></MdOutlineAddCard>
                <h2>Nạp thêm vào ví</h2>
            </div>
            <div>
                <p className="mt-[8px] text-lg text-center">
                    {`Bạn cần nạp thêm ${numberFormat(
                        plan_price - wallet.money
                    )}đ vào ví`}
                </p>
            </div>
            <div className="flex gap-3 justify-center mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className="text-base font-medium rounded-md"
                    onClick={() => appDispatch(popup_close())}
                >
                    Huỷ
                </button>
                <button
                    style={{ padding: '6px 14px' }}
                    onClick={handleContinue}
                    className="cursor-pointer justify-center  text-base font-medium instbtn h-[40px] rounded-md"
                >
                    Nạp ngay
                </button>
            </div>
        </div>
    );
}
