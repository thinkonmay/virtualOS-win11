import { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { isMobile } from '../../../src-tauri/core';
import {
    appDispatch,
    show_paid_user_tutorial,
    sidepane_paneopen,
    useAppSelector
} from '../../backend/reducers';
import { localStorageKey } from '../../backend/utils/constant';
const mobileGuide = [
    {
        content: (
            <div>
                <h2>Cảm ơn bạn đã tin dùng Thinkmay!</h2>
                <p className="mt-2">
                    Sau đây là cách để bạn connect tới chiếc PC trên cloud của
                    mình
                </p>
            </div>
        ),
        locale: { next: "Let's go" },
        placement: 'center',
        target: 'body'
    },
    {
        content: (
            <p>
                Bạn chỉ cần bấm để kết nối tới máy
                <br />
                <p>
                    <b>LƯU Ý:</b> Bắt buộc phải mở trên <b>CHROME</b> hoặc{' '}
                    <b>APP</b>{' '}
                </p>
            </p>
        ),
        floaterProps: {
            disableAnimation: true
        },
        spotlightPadding: 10,
        locale: {
            next: 'Next' // Continue with "Next",
        },
        target: '.connectBtn12',
        title: 'Kết nối',
        placement: 'right'
    },
    {
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
        title: 'Tinh chỉnh'
    },
    {
        placement: 'top',
        target: '.shutdownBtn',
        title: 'Tắt máy đúng cách',
        spotlightPadding: 1,
        content: 'Để trách gặp lỗi không đáng có!'
    },
    {
        placement: 'top',
        target: '.lowNetworkBtn',
        title: 'Chế độ sóng yếu',
        content: (
            <p>
                Bật khi mạng không ổn định, đặt bitrate <b>40</b>
            </p>
        ),
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.shareLinkBtn',
        title: 'Chia sẻ link',
        content: '2,3 người có thể điều khiển chung 1 máy',
        spotlightPadding: 1
    },
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
        content: 'Nên bật khi chơi',
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.resetVideoBtn',
        title: 'Reset lại kết nối khi gặp lỗi',
        content: 'Bấm khi bị lỗi đường truyền',
        spotlightPadding: 1
    },
    {
        content: <p>Ngày đăng kí, giờ sử dụng còn lại</p>,
        placement: 'top',
        target: '.infoBtn',
        title: 'Xem thông tin của bạn ',
        spotlightPadding: 1
    },
    {
        content: (
            <p>
                Khi bị <b>giật/lag</b> hãy <b>nhắn</b> ngay với kĩ thuật để được
                hỗ trợ tinh chỉnh kịp thời
            </p>
        ),
        placement: 'top',
        target: '.supportNow',
        title: 'Cần hỗ trợ'
    }
];
const desktopGuide = [
    {
        content: (
            <div>
                <h2>Cảm ơn bạn đã tin dùng Thinkmay!</h2>
                <p className="mt-2">
                    Sau đây là cách để bạn connect tới chiếc PC trên cloud của
                    mình
                </p>
            </div>
        ),
        locale: { next: "Let's go" },
        placement: 'center',
        target: 'body'
    },
    {
        content: (
            <p>
                Bạn chỉ cần bấm để kết nối tới máy
                <br />
                <p>
                    <b>LƯU Ý:</b> Bắt buộc phải mở trên <b>CHROME</b> hoặc{' '}
                    <b>APP</b>{' '}
                </p>
            </p>
        ),
        floaterProps: {
            disableAnimation: true
        },
        spotlightPadding: 10,
        locale: {
            next: 'Next' // Continue with "Next",
        },
        target: '.connectBtn12',
        title: 'Kết nối',
        placement: 'right'
    },
    {
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
        title: 'Tinh chỉnh'
    },
    {
        placement: 'top',
        target: '.shutdownBtn',
        title: 'Tắt máy đúng cách',
        spotlightPadding: 1,
        content: 'Để trách gặp lỗi không đáng có!'
    },

    {
        placement: 'top',
        target: '.lowNetworkBtn',
        title: 'Chế độ sóng yếu',
        content: (
            <p>
                Bật khi mạng không ổn định, đặt bitrate <b>40</b>
            </p>
        ),
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.gamingMouseBtn',
        title: 'Bật khi chơi game để khoá chuột',
        spotlightPadding: 1,
        content: 'Tránh trường hợp xuất hiện 2 con chuột cùng 1 lúc'
    },
    {
        placement: 'top',
        target: '.shareLinkBtn',
        title: 'Chia sẻ link',
        content: 'Hỗ trợ nhiều người có thể điều khiển chung 1 máy',
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.fixKeyboardBtn',
        title: 'Fix lỗi phím',
        content: 'Một số game sẽ không nhận phím, bật để fix',
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.fullscrenBtn',
        title: 'Bật toàn màn hình',
        content: 'Nên bật khi chơi',
        spotlightPadding: 1
    },
    {
        placement: 'top',
        target: '.resetVideoBtn',
        title: 'Reset lại kết nối khi gặp lỗi',
        content: 'Bấm khi bị lỗi đường truyền',
        spotlightPadding: 1
    },
    {
        content: <p>Ngày đăng kí, giờ sử dụng còn lại</p>,
        placement: 'top',
        target: '.infoBtn',
        title: 'Xem thông tin của bạn ',
        spotlightPadding: 1
    },
    {
        content: (
            <p>
                Khi bị <b>giật/lag</b> hãy <b>nhắn</b> ngay với kĩ thuật để được
                hỗ trợ tinh chỉnh kịp thời
            </p>
        ),
        placement: 'top',
        target: '.supportNow',
        title: 'Cần hỗ trợ'
    }
];

export const OnboardingPaidUser = () => {
    const logged_in = useAppSelector((state) => state.user.id != 'unknown');
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (logged_in) setRun(true);
    }, [logged_in]);

    const handleJoyrideCallback = (data) => {
        const { status, index } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRun(false);
            appDispatch(show_paid_user_tutorial(false));
            localStorage.setItem(localStorageKey.shownPaidUserTutorial, 'true');
        }
        console.log(index);
        if (index == 2) {
            appDispatch(sidepane_paneopen());
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            scrollToFirstStep
            continuous
            showProgress
            disableOverlayClose
            steps={isMobile() ? mobileGuide : desktopGuide}
            run={run}
            styles={{
                options: {
                    zIndex: 10000,
                    overlayColor: 'rgba(0, 0, 0, 0.5)'
                },
                buttonNext: {
                    backgroundColor: '#007bff', // Custom background color for the Next button
                    borderRadius: '4px', // Rounded corners for the button
                    color: '#fff', // Text color
                    fontSize: '16px', // Custom font size
                    padding: '8px 16px', // Padding inside the button
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Add a shadow effect
                },
                buttonClose: {
                    display: 'none' // This will hide the close button
                }
            }}
        />
    );
};
