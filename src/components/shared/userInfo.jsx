import {
    appDispatch,
    useAppSelector,
    user_delete
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { formatDate } from '../../backend/utils/date';
import DomainSwitch from '../../containers/applications/apps/assets/DomainSwitch';
import LangSwitch from '../../containers/applications/apps/assets/Langswitch';
import NodeSwitch from '../../containers/applications/apps/assets/NodeSwitch';
import { Icon } from './general';
import './index.scss';

function UserInfo() {
    const { email, subscription } = useAppSelector((state) => state.user);
    const {
        cluster,
        created_at,
        last_payment,
        plan_name,
        total_usage,
        ended_at,
        policy
    } = subscription ?? {};
    let { limit_hour } = policy ?? {};

    const t = useAppSelector((state) => state.globals.translation);

    const Paid = () => (
        <div className="restWindow w-full  flex flex-col mt-4">
            <div className="w-full flex gap-4 justify-between mt-1 items-end">
                <span className="text-left">Đăng kí gói</span>
                <span>{plan_name}</span>
            </div>
            <div className="w-full flex gap-4 justify-between mt-1 items-end">
                <span className="text-left">{t[Contents.TIME]}</span>
                <span>
                    {total_usage?.toFixed(1)} / {limit_hour}h
                </span>
            </div>
            <div className="w-full flex gap-4 justify-between mt-1 items-end">
                <span className="text-left">Dung lượng</span>
                <span>150GB</span>
            </div>
            {created_at ? (
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">{t[Contents.STARTAT]}</span>
                    <span>{formatDate(created_at)}</span>
                </div>
            ) : null}
            {last_payment ? (
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">{t[Contents.LASTPAID]}</span>
                    <span>{formatDate(last_payment)}</span>
                </div>
            ) : null}
            {ended_at ? (
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">{t[Contents.ENDAT]}</span>
                    <span>{formatDate(ended_at)}</span>
                </div>
            ) : null}
            {cluster ? (
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">Server đăng kí</span>
                    <span>{cluster}</span>
                </div>
            ) : null}
        </div>
    );

    return (
        <div className="userManager">
            <div className="stmenu">
                <div>
                    <div className="pinnedApps mt-[16px] text-center font-semibold pb-1 flex items-center justify-center gap-2">
                        <span>{email ?? 'Admin'}</span>
                        <Icon className="quickIcon" src={'active'} width={14} />
                    </div>
                </div>
                <div
                    className="h-full flex flex-col gap-2 p-2 mt-2"
                    data-dock="true"
                >
                    <div className="w-full flex gap-4 justify-between ">
                        <span>Language</span>
                        <LangSwitch />
                    </div>
                    <div className="w-full flex gap-4 justify-between">
                        <span>Server</span>
                        <DomainSwitch />
                    </div>
                    {subscription != undefined ? (
                        <div className="w-full flex gap-4 justify-between">
                            <span>Node</span>
                            <NodeSwitch />
                        </div>
                    ) : null}
                    <div className="w-full flex gap-4 justify-between">
                        {subscription != undefined ? <Paid /> : null}
                    </div>
                </div>

                <div className="menuBar mt-10">
                    <div
                        className="w-full h-full flex cursor-pointer prtclk items-center justify-center gap-2"
                        onClick={() => appDispatch(user_delete())}
                        data-action="WALLSHUTDN"
                    >
                        <span>Log Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
