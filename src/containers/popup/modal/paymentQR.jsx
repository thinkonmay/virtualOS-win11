import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import {
    cancel_transaction,
    verify_transaction
} from '../../../backend/actions';
import {
    appDispatch,
    popup_close,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';
import { fetchPayment } from '../../../backend/actions/background';

export function paymentQR({
    data: { id, code, url, accountName, amount, description, discount_percent }
}) {
    const t = useAppSelector((state) => state.globals.translation);

    const cancel = () => {
        cancel_transaction({ id });
        appDispatch(popup_close(true));
    };

    const verify = async () => {
        if (await verify_transaction({ id })) {
            await fetchPayment();
            appDispatch(popup_close(true));
            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        success: true,
                        content: t[Contents.PAYMENT_DEPOSIT_SUCCESS]
                    }
                })
            );
        }
    };

    useEffect(() => {
        const interval = setInterval(verify, 2000);
        return async () => {
            clearInterval(interval);
        };
    }, []);

    const redirect = () => window.open(url, '_self');

    return (
        <div className="w-[330px] md:w-[400px] h-auto p-[14px] md:p-[24px] pb-6 md:pb-8">
            <div>
                <p className="text-left text-[1.2rem] md:text-2xl mb-[0px]">
                    {t[Contents.PAYMENT_APP]}
                </p>
            </div>
            <p className="text-lg mb-8">{t[Contents.PAYMENT_DEPOSIT]}</p>
            <div className=" flex justify-between gap-3 items-center rounded-lg p-2 bg-slate-200">
                <QRCode
                    size={256}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    value={code}
                    viewBox={`0 0 256 256`}
                />
            </div>
            <div className="flex gap-3 justify-center mt-1 mb-2">
                {t[Contents.PAYMENT_ACCOUNT_NAME]} {accountName}
            </div>
            <div className="flex gap-3 justify-center mt-1 mb-2">
                {t[Contents.PAYMENT_AMOUNT]} {amount} VND
            </div>
            <div className="flex gap-3 justify-center mt-1 mb-2 text-xl">
                {t[Contents.PAYMENT_DESCRIPTION]}: "{description}"
            </div>
            <div className="flex gap-3 justify-center mt-1 mb-2 font-bold text-xl">
                ({t[Contents.PAYMENT_REQUIRE]})
            </div>
            {discount_percent != undefined ? (
                <div className="flex gap-3 justify-center mt-1 mb-2">
                    Bạn được khuyến mãi {discount_percent}% giá trị lần nạp
                </div>
            ) : null}
            <div className="flex gap-3 justify-center mt-1 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className=" text-base font-medium rounded-md"
                    onClick={cancel}
                >
                    Cancel
                </button>
                <a
                    style={{ padding: '6px 14px' }}
                    onClick={redirect}
                    target="_self"
                    className="cursor-pointer  text-base font-medium instbtn rounded-md"
                >
                    Go to PAYOS
                </a>
            </div>
        </div>
    );
}
