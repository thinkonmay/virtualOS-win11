import {
    appDispatch,
    app_toggle,
    useAppSelector,
    wait_and_claim_volume,
    worker_reload
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { RenderNode } from '../../../../src-tauri/api';
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
        (state) => new RenderNode(state.worker.data).data[0]?.info?.available
    );
    const paid = useAppSelector(
        (state) => state.user.subscription.status == 'PAID'
    );
    const wrongsite = useAppSelector(
        (state) =>
            state.user.subscription.status == 'PAID' &&
            !state.user.subscription.correct_domain
    );
    const cluster = useAppSelector((state) =>
        state.user.subscription.status == 'PAID'
            ? state.user.subscription.cluster
            : null
    );
    const { image, name } = useAppSelector((state) =>
        state.user.subscription.status == 'PAID'
            ? state.user.subscription.usage?.template ?? {
                  image: null,
                  name: null
              }
            : { image: null, name: null }
    );

    const { browser } = detectBrowserAndOS();

    const id = useAppSelector((state) => state.user.id);
    const connect = () => appDispatch(wait_and_claim_volume());
    const pay = () => appDispatch(app_toggle('payment'));
    const loginNow = () => login('google');
    const reload = () => appDispatch(worker_reload());
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

                            {id == 'unknown' ? (
                                <button
                                    onClick={loginNow}
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    Đăng nhập
                                </button>
                            ) : available == 'ready' ||
                              available == 'started' ? (
                                <button
                                    onClick={connect}
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    {available == 'ready'
                                        ? 'Khởi tạo'
                                        : 'Kết nối'}
                                </button>
                            ) : available == 'not_ready' ? (
                                <button
                                    onClick={reload}
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    Máy đang được khởi tạo
                                </button>
                            ) : paid ? (
                                wrongsite ? (
                                    <a
                                        href={`https://${cluster}`}
                                        target="_self"
                                        className="instbtn connectBtn12 connectBtn"
                                    >
                                        {cluster}
                                    </a>
                                ) : (
                                    <button
                                        onClick={reload}
                                        className="instbtn connectBtn12 connectBtn"
                                    >
                                        Reload
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={pay}
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    Thanh toán
                                </button>
                            )}
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
