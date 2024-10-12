import {
    appDispatch,
    app_toggle,
    useAppSelector,
    wait_and_claim_volume
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { RenderNode, UserEvents } from '../../../../src-tauri/api';
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
    const isMaintain = useAppSelector(
        (state) => !state.globals.maintenance?.isMaintaining
    );

    const { browser } = detectBrowserAndOS();

    const user = useAppSelector((state) => state.user);
    const emailSplit = () => user?.email?.split('@')?.at(0) || 'Your';
    const connect = () => appDispatch(wait_and_claim_volume());
    const pay = () => {
        UserEvents({type: 'payment/show', payload: 'interact/click'})
        appDispatch(app_toggle('payment'));
    } 
        
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
            >
                <LazyComponent show={!wnapp.hide}>
                    <div className="content">
                        <div className="title">
                            <Icon src="monitor"></Icon>
                            {emailSplit()}
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
                                    disabled
                                    className="instbtn connectBtn12 connectBtn"
                                >
                                    Máy đang được khởi tạo
                                </button>
                            ) : (
                                <button
                                    onClick={pay}
                                    className="instbtn connectBtn"
                                >
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
