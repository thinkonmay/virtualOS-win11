import { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { create_payment_pocket } from '../../../backend/actions';
import {
    app_metadata_change,
    appDispatch,
    popup_open,
    show_chat,
    startogg,
    useAppSelector
} from '../../../backend/reducers';
import DepositPage from '../../../components/payment/depositPage';
import { HistoryPage } from '../../../components/payment/historyPage';
import { RefundPage } from '../../../components/payment/refundPage';
import { StoragePage } from '../../../components/payment/storagePage';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';
import './assets/payment.scss';
import './assets/store.scss';
import { SubscriptionPage } from '../../../components/payment/subsriptionPage';

export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );

    const page = wnapp.page; //deposit-sub - refund - storage -history
    const val = wnapp.value;

    const handleChangePage = (input) => {
        appDispatch(
            app_metadata_change({ id: 'payment', key: 'page', value: input })
        );
    };
    return (
        <div
            className="paymentApp wnstore floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Payment"
            />
            <LazyComponent show={!wnapp.hide}>
                <div className="windowScreen wrapperPayment">
                    <div className="navPayment text-left">
                        <div
                            className={
                                page == 'sub' ? 'item subActive' : 'item'
                            }
                            onClick={() => handleChangePage('sub')}
                        >
                            Đăng kí
                        </div>
                        <div
                            className={
                                page == 'storage'
                                    ? 'item subActive'
                                    : 'item text-gray-500'
                            }
                            onClick={() => handleChangePage('storage')}
                        >
                            Thanh toán
                        </div>
                        <div
                            className={
                                page == 'history'
                                    ? 'item subActive'
                                    : 'item text-gray-500'
                            }
                            onClick={() => handleChangePage('history')}
                        >
                            Lịch sử
                        </div>
                        <div
                            className={
                                page == 'refund'
                                    ? 'item subActive'
                                    : 'item text-gray-500'
                            }
                            onClick={() => handleChangePage('refund')}
                        >
                            Hoàn tiền
                        </div>
                    </div>
                    <div className="win11Scroll w-full">
                        {page == 'sub' ? (
                            <SubscriptionPage />
                        ) : page == 'refund' ? (
                            <RefundPage />
                        ) : page == 'history' ? (
                            <HistoryPage />
                        ) : (
                            <StoragePage />
                        )}
                    </div>
                </div>
            </LazyComponent>
        </div>
    );
};
