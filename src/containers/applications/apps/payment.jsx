import {
    app_payload,
    appDispatch,
    useAppSelector
} from '../../../backend/reducers';
import { PaymentPage } from '../../../components/payment/paymentPage';
import { SubscriptionPage } from '../../../components/payment/subsriptionPage';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/payment.scss';
import './assets/store.scss';

export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );
    const { page: curpage, value: val } = wnapp;

    const handleChangePage = (input) =>
        appDispatch(app_payload({ id: 'payment', key: 'page', value: input }));

    const routing = {
        subscription: 'Đăng kí',
        payment: 'Thanh toán',
        history: 'Lịch sử',
        refund: 'Hoàn tiền'
    };

    const external = {
        history: '/history',
        refund: '/refund'
    };

    const pages2 = ['history', 'refund'];
    const pages = ['subscription', 'payment'];

    const renderRoute = (page, index) => (
        <div
            key={index}
            className={
                page == curpage
                    ? 'item subActive ml-1 sm:ml-4'
                    : 'item ml-1 sm:ml-4'
            }
            onClick={() => handleChangePage(page)}
        >
            {routing[page]}
        </div>
    );
    const renderExternal = (page, index) => (
        <div
            key={index}
            onClick={() => window.open(external[page])}
            className="item ml-1 sm:ml-4"
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
                    <div className="navPayment text-left w-24 sm:w-36 text-sm sm:text-xl font-bold">
                        {pages.map(renderRoute)}
                        {pages2.map(renderExternal)}
                    </div>
                    <div className="win11Scroll w-full">
                        {curpage == 'subscription' ? (
                            <SubscriptionPage
                                value={val}
                                switchPage={handleChangePage}
                                onlyPlan={false}
                            />
                        ) : (
                            <PaymentPage value={val} />
                        )}
                    </div>
                </div>
            </LazyComponent>
        </div>
    );
};
