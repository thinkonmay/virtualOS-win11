import { useMemo } from 'react';
import { changeTheme } from '../../backend/actions';
import {
    appDispatch,
    useAppSelector,
    user_delete
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { externalLink } from '../../backend/utils/constant';
import LangSwitch from '../../containers/applications/apps/assets/Langswitch';
import { Icon } from './general';
import './index.scss';
function UserInfo() {
    const user = useAppSelector((state) => state.user);
    const stats = useAppSelector((state) => state.user.stat);
    const thm = useAppSelector((state) => state.setting.person.theme);
    var icon = thm == 'light' ? 'sun' : 'moon';
    const t = useAppSelector((state) => state.globals.translation);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const additionalTime = stats?.additional_time ?? 0;
    const preTime = stats?.pre_remain_time ?? 0;
    const planUsageTime = stats?.plan_hour ?? 0;

    const renderPlanName = (planName) => {
        let name = '';
        if (planName == 'month_01') {
            name = 'Cơ bản';
        } else if (planName == 'month_02') {
            name = 'Tiêu chuẩn';
        } else if (planName == 'hour_01') {
            name = 'Gói giờ ';
        } else if (planName == 'hour_02') {
            name = 'Gói giờ lẻ';
        }
        return name;
    };

    const PlanMonth = () => {
        return (
            <div className="restWindow w-full  flex flex-col ">
                {/* <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.PLAN_NAME]}</span>
                    <span>{renderPlanName(stats?.plan_name)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.STARTAT]}</span>
                    <span>{formatDate(stats?.start_time)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.ENDAT]}</span>
                    <span>{formatDate(stats?.end_time)}</span>
                </div> */}
                <div className="w-full flex gap-4 justify-between mt-3 items-end">
                    <span className="text-left">
                        {t[Contents.PLAN_USAGE_TIME]}
                    </span>
                    <span>{planUsageTime}h</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">
                        {t[Contents.ADDITIONAL_TIME]}
                    </span>
                    <span>{additionalTime}h</span>
                </div>
                <hr className="my-[14px]" />
                <div className="w-full flex gap-4 justify-between  mt-0 md:mt-[14px]">
                    <span className="text-left">{t[Contents.TIME]}</span>
                    <span>
                        {stats?.usage_hour ? stats?.usage_hour.toFixed(1) : 0}h
                        / {totalTime + 'h'}
                    </span>
                </div>
            </div>
        );
    };

    const PlanHours = () => {
        return (
            <div className="restWindow w-full  flex flex-col ">
                {/* <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.PLAN_NAME]}:</span>
                    <span>{renderPlanName(stats?.plan_name)}</span>
                </div> */}
                {/*<div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">
                        {t[Contents.STARTAT]}
                    </span>
                    <span>{formatDate(stats?.start_time)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">
                        {t[Contents.ENDAT]}
                    </span>
                    <span>{formatDate(stats?.end_time)}</span>
                </div>*/}
                <div className="w-full flex gap-4 justify-between mt-2 items-end">
                    <span className="text-left">Time:</span>
                    <span>{additionalTime + preTime}h</span>
                </div>
                <div className="w-full flex gap-4 justify-between  mt-2 ">
                    <span className="text-left">{t[Contents.TIME]}:</span>
                    <span className="text-right">
                        {stats?.usage_hour ? stats?.usage_hour.toFixed(1) : 0}h
                    </span>
                </div>
                <hr className="my-[14px]" />

                <div className="w-full flex gap-4 justify-between  mt-0 md:mt-[14px]">
                    <span className="text-left">Thời gian còn lại</span>
                    <span className="text-right">
                        {stats?.remain_time ? stats?.remain_time.toFixed(1) : 0}
                        h
                    </span>
                </div>
                <p></p>
            </div>
        );
    };
    return (
        <div className="userManager">
            <div className="stmenu  p-[14px] pt-2">
                <div>
                    <div className="pinnedApps mt-[16px] text-center font-semibold pb-1 flex items-center justify-center gap-2">
                        <span>{user.email ?? 'Admin'}</span>
                        <Icon
                            className="quickIcon"
                            //ui={true}
                            src={'active'}
                            width={14}
                        />
                    </div>
                    {user.isExpired ? (
                        <p className="text-red-600 mb-4 mt-1 text-right">
                            Vui lòng{' '}
                            <a
                                href={externalLink.FACEBOOK_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline font-semibold"
                            >
                                gia hạn
                            </a>{' '}
                            để tiếp tục sử dụng
                        </p>
                    ) : null}
                </div>
                <div className="h-full flex flex-col p-2" data-dock="true">
                    <div className="w-full flex gap-4 justify-between my-[8px] ">
                        <span>Language</span>
                        <LangSwitch />
                    </div>
                    <div className="w-full flex gap-4 justify-between mb-[12px] md:mb-[24px] ">
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
                                //invert={pnstates[idx] ? true : null}
                            />
                        </div>
                    </div>

                    {/* here */}
                    {/* {_planName.includes('hour') ? <PlanHours /> : <PlanMonth />} */}
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
