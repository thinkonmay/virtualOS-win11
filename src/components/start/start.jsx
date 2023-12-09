import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeTheme, handleLogOut } from '../../backend/actions';
import { useAppSelector } from '../../backend/reducers';
import { isGreenList, isMobile } from '../../backend/utils/checking';
import LangSwitch from '../../containers/applications/apps/assets/Langswitch';
import { Icon } from '../shared/general';

export const StartMenu = () => {
    const { t, i18n } = useTranslation();

    const { align } = useAppSelector((state) => state.taskbar);
    const user = useAppSelector((state) => state.user);
    const start = useAppSelector((state) => state.startmenu);
    const thm = useAppSelector((state) => state.setting.person.theme);
    var icon = thm == 'light' ? 'sun' : 'moon';

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const usageTime  = undefined
    const total_time = undefined
    const checkPackage = () => {
        const packages = {
            week: '20h',
            month: '100h'
        };

        const usageTime = user?.usageTime?.at(0);
        if (usageTime == undefined)
            return
            
        return packages[usageTime?.package] ?? usageTime?.package;
    };

    return (
        <div
            className="startMenu dpShad"
            data-hide={start.hide}
            style={{ '--prefix': 'START' }}
            data-align={align}
            data-mobile={isMobile()}
        >
            <>
                <div className="stmenu p-[14px]">
                    <div className="pinnedApps mt-[16px] text-center font-semibold pb-1 flex items-center justify-center gap-2">
                        <span>{user.email ?? 'Admin'}</span>
                        {isGreenList() ? (
                            <Icon
                                className="quickIcon"
                                //ui={true}
                                src={'active'}
                                width={14}
                            />
                        ) : null}
                    </div>
                    <h6>
                        {!isGreenList() ? t('timemanager.inActiveUser') : null}
                    </h6>
                    <div className="h-full flex flex-col p-2" data-dock="true">
                        <div className="w-full flex gap-4 justify-between my-[14px] ">
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
                        <div className="restWindow w-full  flex flex-col ">
                            <div className="w-full flex gap-4 justify-between mt-1">
                                <span className="text-left">
                                    {t('timemanager.startAt')}
                                </span>
                                <span>{formatDate(usageTime?.start_time)}</span>
                            </div>
                            <div className="w-full flex gap-4 justify-between mt-1">
                                <span className="text-left">
                                    {t('timemanager.endAt')}
                                </span>
                                <span>{formatDate(usageTime?.end_time)}</span>
                            </div>
                            <hr className="my-[14px]" />
                            <div className="w-full flex gap-4 justify-between  mt-0 md:mt-[14px]">
                                <span className="text-left">
                                    {t('timemanager.time')}
                                </span>
                                <span>
                                    {usageTime?.total_time
                                        ? usageTime?.total_time.toFixed(1) +
                                        '/' +
                                        checkPackage() +
                                        '/' +
                                        usageTime?.package
                                        : 'Invalid'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="menuBar">
                    <div
                        className="flex prtclk items-center gap-2"
                        onClick={handleLogOut}
                        data-action="WALLSHUTDN"
                    >
                        <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.204 4.82a.75.75 0 0 1 .634 1.36A7.51 7.51 0 0 0 4.5 12.991c0 4.148 3.358 7.51 7.499 7.51s7.499-3.362 7.499-7.51a7.51 7.51 0 0 0-4.323-6.804.75.75 0 1 1 .637-1.358 9.01 9.01 0 0 1 5.186 8.162c0 4.976-4.029 9.01-9 9.01C7.029 22 3 17.966 3 12.99a9.01 9.01 0 0 1 5.204-8.17ZM12 2.496a.75.75 0 0 1 .743.648l.007.102v7.5a.75.75 0 0 1-1.493.102l-.007-.102v-7.5a.75.75 0 0 1 .75-.75Z"
                                fill="currentColor"
                            />
                        </svg>
                        <span>Log Out</span>
                    </div>
                </div>
            </>
        </div>
    );
};
