import dayjs from 'dayjs';
import { MdOutlineLink } from 'react-icons/md';
import { changeTheme } from '../../backend/actions';
import {
    appDispatch,
    popup_open,
    useAppSelector,
    user_delete
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { formatDate } from '../../backend/utils/date';
import DomainSwitch from '../../containers/applications/apps/assets/DomainSwitch';
import LangSwitch from '../../containers/applications/apps/assets/Langswitch';
import { Icon } from './general';
import './index.scss';

function UserInfo() {
    const { email, subscription } = useAppSelector((state) => state.user);
    const {
        cluster,
        created_at,
        last_payment,
        total_usage,
        ended_at,
        usage,
        policy
    } = subscription ?? {};
    const { node } = usage ?? {};
    let { limit_hour, name: plan_name } = policy ?? {};
    const oldPaidUser = dayjs('2024-12-30');
    const endedAtFormat = dayjs(ended_at);
    if (endedAtFormat.isBefore(oldPaidUser, 'day') && limit_hour == 120) {
        limit_hour = 150;
    }

    const t = useAppSelector((state) => state.globals.translation);

    const Paid = () => (
        <div className="restWindow w-full  flex flex-col mt-4">
            {/*{correctsite ? (*/}
            <div className="w-full flex gap-4 justify-between mt-1 items-end">
                <span className="text-left">{t[Contents.TIME]}</span>
                <span>
                    {total_usage?.toFixed(1)} / {limit_hour}h
                </span>
            </div>
            {/*) : null}*/}

            <div className="w-full flex gap-4 justify-between mt-1 items-end">
                <span className="text-left">Gói</span>
                <span>Gói {plan_name}</span>
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
                    <span className="text-left">Server</span>
                    <span>{cluster}</span>
                </div>
            ) : null}
            {node ? (
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">Node</span>
                    <span>{node}</span>
                </div>
            ) : null}
        </div>
    );

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
                <div
                    className="h-full flex flex-col gap-2 p-2 mt-2"
                    data-dock="true"
                >
                    <div className="w-full flex gap-4 justify-between ">
                        <span>Language</span>
                        <LangSwitch />
                    </div>
                    <div className="w-full flex gap-4 justify-between my-[8px] ">
                        <span>Server</span>
                        <DomainSwitch />
                    </div>
                    <div className="w-full flex gap-4 justify-between mt-[1rem]">
                        {subscription != undefined ? (
                            <Paid />
                        ) : (
                            <div className="restWindow w-full  flex flex-col ">
                                <div className="w-full flex gap-4 justify-between mt-2 items-end">
                                    <span className="text-left">
                                        You haven't paid yet
                                    </span>
                                </div>
                                <p></p>
                            </div>
                        )}
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
        </div>
    );
}

export default UserInfo;
