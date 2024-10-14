import { MdOutlinePowerSettingsNew } from 'react-icons/md';
import { RenderNode } from '../../../src-tauri/api';
import { changeTheme } from '../../backend/actions';
import {
    appDispatch,
    unclaim_volume,
    useAppSelector,
    user_delete,
    wait_and_claim_volume
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { formatDate } from '../../backend/utils/date';
import LangSwitch from '../../containers/applications/apps/assets/Langswitch';
import { Icon } from './general';
import './index.scss';

function UserInfo() {
    const correctsite = useAppSelector(
        (state) =>
            (state.user.subscription.status == 'IMPORTED' ||
                state.user.subscription.status == 'PAID') &&
            state.user.subscription.correct_domain
    );
    const {
        email,
        subscription: {
            node,
            cluster,
            plan,
            total_usage,
            limit_hour,
            created_at,
            ended_at,
            template
        }
    } = useAppSelector((state) => state.user);
    const shutdownable = useAppSelector(
        (state) => new RenderNode(state.worker.data).data[0]?.info?.available
    );
    const thm = useAppSelector((state) => state.setting.person.theme);
    var icon = thm == 'light' ? 'sun' : 'moon';
    const t = useAppSelector((state) => state.globals.translation);

    const renderPlanName = {
        month1: (
            <div className="restWindow w-full  flex flex-col ">
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">{t[Contents.STARTAT]}</span>
                    <span>{formatDate(created_at)}</span>
                </div>
                {ended_at ? (
                    <div className="w-full flex gap-4 justify-between mt-1 items-end">
                        <span className="text-left">{t[Contents.ENDAT]}</span>
                        <span>{formatDate(ended_at)}</span>
                    </div>
                ) : null}
                {correctsite ? (
                    <div className="w-full flex gap-4 justify-between mt-4 items-end">
                        <span className="text-left">{t[Contents.TIME]}</span>
                        <span>
                            {(+total_usage / 60).toFixed(2)}h / {limit_hour}h
                        </span>
                    </div>
                ) : null}
                {template && correctsite ? (
                    <div className="w-full flex gap-4 justify-between mt-1 items-end">
                        <span className="text-left">Template</span>
                        <span>{template}</span>
                    </div>
                ) : null}
                {cluster ? (
                    <div className="w-full flex gap-4 justify-between mt-1 items-end">
                        <span className="text-left">Domain</span>
                        <span>{cluster}</span>
                    </div>
                ) : null}
                {node && correctsite ? (
                    <div className="w-full flex gap-4 justify-between mt-1 items-end">
                        <span className="text-left">Node</span>
                        <span>{node}</span>
                    </div>
                ) : null}
            </div>
        ),
        hour1: <div className="restWindow w-full  flex flex-col "></div>,
        undefined: (
            <div className="restWindow w-full  flex flex-col ">
                <div className="w-full flex gap-4 justify-between mt-2 items-end">
                    <span className="text-left">You haven't paid yet</span>
                </div>
                <p></p>
            </div>
        )
    };

    return (
        <div className="userManager">
            <div className="stmenu  p-[14px] pt-2">
                <div>
                    <div className="pinnedApps mt-[16px] text-center font-semibold pb-1 flex items-center justify-center gap-2">
                        <span>{email ?? 'Admin'}</span>
                        <Icon
                            className="quickIcon"
                            //ui={true}
                            src={'active'}
                            width={14}
                        />
                    </div>
                </div>
                <div className="h-full flex flex-col p-2" data-dock="true">
                    <div className="w-full flex gap-4 justify-between my-[8px] ">
                        <span>Language</span>
                        <LangSwitch />
                    </div>
                    <div className="w-full flex gap-4 justify-between mb-[12px] md:mb-[24px]">
                        <span>Theme</span>
                        <div
                            className="strBtn handcr prtclk"
                            onClick={changeTheme}
                        >
                            <Icon
                                className="quickIcon"
                                ui={true}
                                src={icon}
                                width={14}
                            />
                        </div>
                    </div>
                    <div className="w-full flex gap-4 justify-between mb-[12px] md:mb-[24px] ">
                        {correctsite ? (
                            shutdownable == 'started' ? (
                                <>
                                    <span>Shut down</span>
                                    <div
                                        className="strBtn handcr prtclk"
                                        onClick={() =>
                                            appDispatch(unclaim_volume())
                                        }
                                    >
                                        <MdOutlinePowerSettingsNew
                                            size={'1rem'}
                                        />
                                    </div>
                                </>
                            ) : shutdownable == 'ready' ? (
                                <>
                                    <span>Connect</span>
                                    <div
                                        className="strBtn handcr prtclk"
                                        onClick={() =>
                                            appDispatch(wait_and_claim_volume())
                                        }
                                    >
                                        <Icon
                                            className="quickIcon"
                                            ui={true}
                                            src={'power'}
                                            width={14}
                                        />
                                    </div>
                                </>
                            ) : null
                        ) : null}
                    </div>

                    {renderPlanName[plan]}
                </div>
            </div>

            <div className="menuBar">
                <div
                    className="w-full h-full flex cursor-pointer prtclk items-center justify-center gap-2"
                    onClick={() => appDispatch(user_delete())}
                    data-action="WALLSHUTDN"
                >
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
