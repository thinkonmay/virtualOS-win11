import {
    appDispatch,
    app_toggle,
    show_chat,
    useAppSelector,
    wait_and_claim_volume,
    worker_refresh_ui
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { login } from '../../../backend/actions';
import { Contents } from '../../../backend/reducers/locales';
import { detectBrowserAndOS } from '../../../backend/utils/detectBrower';
import './assets/connect.scss';
export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const available = useAppSelector(
        (state) => state.worker.data[state.worker.currentAddress]?.availability
    );
    const { cluster, metadata } = useAppSelector(
        (state) => state.user.subscription ?? {}
    );
    const addr = useAppSelector((state) => state.worker.currentAddress);
    const { soft_expired, template } = metadata ?? {};
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

                            {available == 'ready' || available == 'started' ? (
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
                                <>
                                    <button
                                        onClick={reload}
                                        className="instbtn connectBtn12 connectBtn"
                                    >
                                        {t[Contents.CA_RELOAD_TRY_AGAIN]}
                                    </button>
                                    <p className="text-xs text-center mt-3">
                                        Hãy nhắn hỗ trợ nếu đợi quá 5'!
                                    </p>
                                </>
                            ) : available == undefined ? (
                                cluster != undefined ? (
                                    cluster != addr ? (
                                        <>
                                            <button
                                                onClick={redirect}
                                                className="instbtn connectBtn12 connectBtn"
                                            >
                                                {t[Contents.CA_WRONG_SERVER]}
                                            </button>
                                            <p className="text-xs text-center mt-3">
                                                {
                                                    t[
                                                        Contents
                                                            .CA_WRONG_SERVER_EXPLAIN
                                                    ]
                                                }
                                                !
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    appDispatch(show_chat())
                                                }
                                                className="instbtn connectBtn12 connectBtn"
                                            >
                                                {t[Contents.CA_MISSING_VOLUME]}
                                            </button>
                                            <p className="text-xs text-center mt-3">
                                                {
                                                    t[
                                                        Contents
                                                            .CA_MISSING_VOLUME_EXPLAIN
                                                    ]
                                                }
                                                !
                                            </p>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <button
                                            onClick={pay}
                                            className="instbtn connectBtn12 connectBtn"
                                        >
                                            {t[Contents.PAYMENT_APP]}
                                        </button>
                                        <p className="text-xs text-center mt-3">
                                            Hãy nhắn hỗ trợ nếu đã mua gói!
                                        </p>
                                    </>
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
