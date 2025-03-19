import {
    appDispatch,
    app_toggle,
    popup_open,
    useAppSelector,
    wait_and_claim_volume,
    worker_refresh_ui
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { Contents } from '../../../backend/reducers/locales';
import { detectBrowserAndOS } from '../../../backend/utils/detectBrower';
import './assets/connect.scss';
import { login } from '../../../backend/actions';
export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const not_signed = useAppSelector((state) => state.user.id == 'unknown');
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const available = useAppSelector(
        (state) => state.worker.data[state.worker.currentAddress]?.availability
    );
    const { cluster, usage } = useAppSelector(
        (state) => state.user.subscription ?? {}
    );
    const { soft_expired, template } = usage ?? {};
    const { image, name } = template ?? {};
    const { browser } = detectBrowserAndOS();

    // const expire_popup = () =>
    //     popup_open({
    //         type: 'extendService',
    //         data: {
    //             type: 'expired',
    //             to: ''
    //         }
    //     });

    // const connect = () =>
    //     soft_expired
    //         ? appDispatch(expire_popup())
    //          : appDispatch(wait_and_claim_volume());

    const connect = () => appDispatch(wait_and_claim_volume());
    const pay = () => appDispatch(app_toggle('payment'));
    const loginNow = () => login('google');
    const reload = () => appDispatch(worker_refresh_ui());
    const redirect = () => {
        localStorage.setItem('thinkmay_domain', cluster);
        window.location.reload();
    };

    return (
        <div
            className="connectToPcApp floatTab dpShad"
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
                name="Connect to your PC"
            />
            <div
                className="windowScreen connectAppContent flex flex-col p-[12px] pt-0"
                data-dock="true"
                style={
                    image != null
                        ? {
                              backgroundImage: `url(${image})`,
                              backgroundSize: 'cover'
                          }
                        : {
                              background:
                                  'linear-gradient(180deg, #040218 0%, #140B7E 100%)'
                          }
                }
            >
                <LazyComponent show={!wnapp.hide}>
                    <div className="content">
                        <div className="title">
                            <Icon src="monitor"></Icon>
                            {name}
                        </div>

                        <div className="containerSpec">
                            {!browser.includes('Chrome') ? (
                                <div className="flex flex-col gap-3">
                                    <div className="spec my-5">
                                        {t[Contents.SUGGEST_BROWSER]}
                                    </div>
                                </div>
                            ) : null}

                            {not_signed ? (
                                <button
                                    onClick={loginNow}
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    Login
                                </button>
                            ) : available == 'ready' ||
                              available == 'started' ? (
                                <>
                                    <button
                                        onClick={connect}
                                        className="instbtn connectBtn12 connectBtn"
                                    >
                                        {available == 'ready'
                                            ? t[Contents.CA_TURN_ON_PC]
                                            : t[Contents.CA_CONNECT]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        {t[Contents.CA_CONNECT_EXPLAIN]}
                                    </p>
                                </>
                            ) : available == 'no_node' ? (
                                <button
                                    onClick={reload}
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    {t[Contents.CA_RELOAD_TRY_AGAIN]}
                                </button>
                            ) : available == undefined ? (
                                cluster != undefined ? (
                                    <button
                                        onClick={redirect}
                                        className="instbtn connectBtn12 connectBtn"
                                    >
                                        {t[Contents.CA_NOTAVAILABLE]}
                                    </button>
                                ) : (
                                    <button
                                        onClick={pay}
                                        className="instbtn connectBtn12 connectBtn"
                                    >
                                        {t[Contents.PAYMENT_APP]}
                                    </button>
                                )
                            ) : (
                                <button className="instbtn connectBtn12 connectBtn">
                                    Very weird bug happened
                                </button>
                            )}
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
