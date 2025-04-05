import {
    app_payload,
    appDispatch,
    useAppSelector
} from '../../../backend/reducers';
import { HistoryPage } from '../../../components/payment/historyPage';
import { PaymentPage } from '../../../components/payment/paymentPage';
import { RefundPage } from '../../../components/payment/refundPage';
import { SubscriptionPage } from '../../../components/payment/subsriptionPage';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/payment.scss';
import './assets/store.scss';

export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );

    const curpage = wnapp.page;
    const val = wnapp.value;

    const handleChangePage = (input) =>
        appDispatch(app_payload({ id: 'payment', key: 'page', value: input }));

    const routing = {
        subscription: 'Đăng kí',
        payment: 'Thanh toán',
        history: 'Lịch sử',
        refund: 'Hoàn tiền'
    };
    const pages = ['subscription', 'payment', 'history', 'refund'];

    const renderRoute = (page) => (
        <div
            className={page == curpage ? 'item subActive' : 'item'}
            onClick={() => handleChangePage(page)}
        >
            {routing[page]}
        </div>
    );

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
                        {pages.map(renderRoute)}
                    </div>
                    <div className="win11Scroll w-full">
                        {curpage == 'subscription' ? (
                            <SubscriptionPage
                                value={val}
                                switchPage={handleChangePage}
                            />
                        ) : curpage == 'refund' ? (
                            <RefundPage value={val} />
                        ) : curpage == 'history' ? (
                            <HistoryPage value={val} />
                        ) : (
                            <PaymentPage value={val} />
                        )}
                    </div>
                </div>
            </LazyComponent>
        </div>
    );
};
