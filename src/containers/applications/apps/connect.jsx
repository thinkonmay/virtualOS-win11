import { useState } from 'react';
import {
    app_toggle,
    appDispatch,
    popup_open,
    useAppSelector,
    wait_and_claim_volume
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { Contents } from '../../../backend/reducers/locales';
import { PlanName } from '../../../backend/utils/constant';
import './assets/connect.scss';
export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const stats = useAppSelector((state) => state.user.stat);
    const user = useAppSelector((state) => state.user);



    const [selector, setSelector] = useState({
        feeling: '',
        control: {
            choose: false
        },
        text: ''
    });

    const emailSplit = () => {
        let result = '';
        result = user?.email?.split('@')?.at(0) || 'Your';

        return result;
    };

    const renderPlanStorage = (planName) => {
        let storage = '150GB + Cloud save';
        if (planName == 'month_01') {
            storage = '150GB + Cloud save';
        }
        if (planName == 'hour_01') {
            storage = '130GB + Cloud save';
        } else if (planName == 'month_02') {
            storage = '200GB + Cloud save';
        }

        return storage;
    };
    const hasComputer = () => {
        const planName = stats?.plan_name
        return planName == PlanName.month_01 || planName == PlanName.hour_01
    }
    const listSpec = [
        {
            name: 'GPU:',
            text: 'Nvidia RTX 3060Ti'
        },
        {
            name: 'RAM:',
            text: '16Gb Ram'
        },
        {
            name: 'CPU:',
            text: 'Intel Xeon™ (up to 3.1 GHz) 8 vCores'
        },
        {
            name: 'STORAGE:',
            text: renderPlanStorage(stats?.plan_name)
        },
        {
            name: 'OS:',
            text: 'Window 10'
        }
    ];
    console.log(stats);
    const connect = () => {
        if (!stats.plan_name) {
            appDispatch(app_toggle('payment'));
            return;
        }
        if (stats?.plan_name == 'hour_02') {
            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        content:
                            'Truy cập Store Games để cài game, do tải khoản của bạn chưa thuê PC riêng',
                        success: false
                    }
                })
            );

            return;
        }
        if (user.isExpired) {
            appDispatch(popup_open({ type: 'warning', data: {} }));
            return;
        }

        appDispatch(wait_and_claim_volume());
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
            >
                <LazyComponent show={!wnapp.hide}>
                    <div className="content">
                        <div className="title">
                            <Icon src="monitor"></Icon>
                            {emailSplit()} PC
                        </div>

                        <div className="containerSpec">
                            <div className="flex flex-col gap-3">
                                {listSpec.map((spec) => (
                                    <div key={spec.text} className="spec">
                                        <b className="">{spec.name}</b>
                                        {spec.text}
                                    </div>
                                ))}
                                <div className="spec mt-4">
                                    {t[Contents.SUGGEST_BROWSER]}
                                </div>
                            </div>

                            <button
                                onClick={connect}
                                className="instbtn connectBtn"
                            >
                                {
                                    hasComputer() ? 'Connect' : 'Payment'
                                }

                            </button>
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
