import { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { isMobile } from '../../../src-tauri/core';
import {
    appDispatch,
    show_tutorial,
    sidepane_paneopen,
    useAppSelector
} from '../../backend/reducers';
import { localStorageKey } from '../../backend/utils/constant';

const general = [
    {
        content: (
            <div>
                <h2>Bạn đã đăng kí thành công Thinkmay trên thiết bị</h2>
                <p className="mt-2">
                    Sau đây là các bước để kết nối với CloudPC
                </p>
            </div>
        ),

        locale: { next: "Let's go" },
        placement: 'center',
        target: 'body'
    },
    {
        title: 'Kết nối',
        content: <p> Click vào đây để kết nối tới CloudPC </p>,

        floaterProps: {
            disableAnimation: true
        },
        spotlightPadding: 10,
        locale: {
            next: 'Next' // Continue with "Next",
        },
        target: '.connectBtn12',
        placement: 'right'
    },
    {
        title: 'Thông tin tài khoản',
        content: (
            <p>Xem thông tin về tài khoản của bạn, bao gồm thời gian chơi</p>
        ),

        placement: 'top',
        target: '.infoBtn',
        spotlightPadding: 1
    },
    {
        title: 'Hỗ trợ',
        content: (
            <p>
                Khi bị <b>giật/lag</b> hãy <b>nhắn ngay</b> để được hỗ trợ{' '}
            </p>
        ),

        placement: 'top',
        target: '.supportNow'
    },
    {
        title: 'Tinh chỉnh',
        content: 'Bấm vô đây để tinh chỉnh kết nối sao cho mượt mà nhất',

        placement: 'bottom',
        locale: {
            next: 'Next' // Continue with "Next"
        },
        spotlightPadding: 10,
        styles: {
            options: {
                width: 300
            }
        },
        target: '.settingBtn',
        sidepane_paneopen: true
    },
    {
        title: 'Chia sẻ link',
        content:
            'Chia sẻ kết nối tới CloudPC với bạn bè, nhiều người có thể sử dụng chung',

        placement: 'top',
        target: '.shareLinkBtn',
        spotlightPadding: 1
    },
    {
        title: 'Reset kết nối',
        content: 'Bấm khi bị lỗi đường truyền',

        placement: 'top',
        target: '.resetVideoBtn',
        spotlightPadding: 1
    }
];

const mobileGuide = [
    {
        placement: 'top',
        target: '.virtGamepadBtn',
        content: 'Bật tắt, điều chỉnh lại vị trí, size phù hợp',
        title: 'Bật gamepad ảo',
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.virtKeyboardBtn',
        title: 'Bật bàn phím ảo',
        content: 'LƯU Ý: Chuột sẽ không di được khi đang bật bàn phím ảo',
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.fullscrenBtn',
        title: 'Bật toàn màn hình',
        content: 'Tối ưu điều khiển và hình ảnh khi chơi game',
        spotlightPadding: 1
    }
];
const desktopGuide = [
    {
        placement: 'top',
        target: '.gamingMouseBtn',
        title: 'Chế độ Gaming',
        spotlightPadding: 1,
        content: 'Tối ưu điều khiển và hình ảnh khi chơi game'
    },
    {
        placement: 'top',
        target: '.fixKeyboardBtn',
        title: 'Fix lỗi phím',
        content: 'Một số game yêu cầu bật chế độ này để sử dụng bàn phím',
        spotlightPadding: 1
    }
];



function CustomTooltip(props) {
    const { backProps, closeProps, continuous, index, primaryProps, skipProps, step, tooltipProps } =
        props;

    return (
        <div className="tooltip__body" {...tooltipProps}>
            <button className="tooltip__close" {...closeProps}>
                &times;
            </button>
            {step.title && <h4 className="tooltip__title">{step.title}</h4>}
            <div className="tooltip__content">{step.content}</div>
            <div className="tooltip__footer">
                <button className="tooltip__button" {...skipProps}>
                    {skipProps.title}
                </button>
                <div className="tooltip__spacer">
                    {index > 0 && (
                        <button className="tooltip__button" {...backProps}>
                            {backProps.title}
                        </button>
                    )}
                    {continuous && (
                        <button className="tooltip__button tooltip__button--primary" {...primaryProps}>
                            {primaryProps.title}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function App() {
    return (
        <div>
            <Joyride
                tooltipComponent={CustomTooltip}
            // ...
            />
        </div>
    );
}
export const PaidTutorial = () => {
    const logged_in = useAppSelector((state) => state.user.id != 'unknown');
    const [run, setRun] = useState(false);
    const stop = () => {
        setRun(false);
        appDispatch(show_tutorial('close'));
        localStorage.setItem(localStorageKey.shownPaidUserTutorial, 'true');
    };

    const allSteps = [...general, ...(isMobile() ? mobileGuide : desktopGuide)];

    useEffect(() => {
        if (logged_in) setRun(true);
    }, [logged_in]);

    const handleJoyrideCallback = ({ status, index }) => {
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) stop();
        else if (allSteps[index].sidepane_paneopen)
            appDispatch(sidepane_paneopen());
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            scrollToFirstStep
            continuous
            showProgress
            disableOverlayClose
            steps={allSteps}
            run={run}
            tooltipComponent={CustomTooltip}

        //styles={{
        //    options: {
        //        zIndex: 10000,
        //        overlayColor: 'rgba(0, 0, 0, 0.5)'
        //    },
        //    buttonNext: {
        //        backgroundColor: '#007bff', // Custom background color for the Next button
        //        borderRadius: '4px', // Rounded corners for the button
        //        color: '#fff', // Text color
        //        fontSize: '16px', // Custom font size
        //        padding: '8px 16px', // Padding inside the button
        //        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Add a shadow effect
        //    },
        //    buttonClose: {
        //        display: 'none' // This will hide the close button
        //    }
        //}}
        />
    );
};
