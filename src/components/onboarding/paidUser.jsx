import { forwardRef, useEffect, useState } from 'react';
import {
    MdCheck,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight
} from 'react-icons/md';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { isMobile } from '../../../src-tauri/core';
import {
    appDispatch,
    show_tutorial,
    sidepane_paneopen,
    useAppSelector
} from '../../backend/reducers';
import { localStorageKey } from '../../backend/utils/constant';
import { Image } from '../shared/general';
import './assets/paidUser.scss';

const general = [
    {
        content: (
            <>
                Hãy cùng chúng mình đi 1 tour hướng dẫn cách sử dụng Thinkmay để
                có trải nghiệm chơi game tuyệt vời nhé ^^
                <br />
            </>
        ),
        title: 'Chào mừng người bạn mới đến Thinkmay!',

        locale: { next: "Let's go" },
        placement: 'center',
        target: 'body'
    }
];

const mobileGuide = [
    {
        title: 'THAM KHẢO: Thêm website về màn hình chính',
        content: (
            <div>
                Để bật toàn màn hình trên IOS & thuận tiện sử dụng hơn
                <div className="flex gap-4 justify-center mt-2">
                    <Image
                        className="w-[140px] rounded-md overflow-hidden"
                        src="asset/add_homescreen_b1"
                    />

                    <Image
                        className="w-[140px] rounded-md overflow-hidden"
                        src="asset/add_homescreen_b2"
                    />
                </div>
            </div>
        ),

        placement: 'center',
        target: 'body'
    },
    {
        placement: 'center',
        target: 'body',
        content: 'Vuốt màn hình để hiện & di chuột',
        title: 'Làm quen với chuột ảo: DI CHUỘT',
        spotlightPadding: 1
    },
    {
        placement: 'center',
        target: 'body',
        content:
            'Bấm vào nửa MH bên trái để click chuột trái, phải là chuột phải',
        title: 'Làm quen với chuột ảo: CHUỘT TRÁI & PHẢI',
        spotlightPadding: 1
    },
    {
        title: 'Ấn để mở bảng cài đặt',
        content: 'Chạm & giữ để nghiên cứu công dụng các nút này nha',

        placement: 'left-end',
        locale: {
            next: 'Next' // Continue with "Next"
        },
        spotlightPadding: 1,
        styles: {
            options: {
                width: 300
            }
        },
        target: '#settingBtn',
        sidepane_paneopen: true
    },
    {
        placement: 'left',
        target: '.virtKeyboardBtn',
        content: 'Lưu ý: Khi đang mở bàn phím ảo sẽ không sử dụng được chuột',
        title: 'Mở bàn phím ảo',
        spotlightPadding: 0,
        sidepane_paneopen: true
    },
    {
        placement: 'left',
        target: '.virtGamepadBtn',
        content: 'Lưu ý: Khi đang mở tay cầm ảo sẽ không sử dụng được chuột',
        title: 'Mở bàn tay cầm ảo',
        spotlightPadding: 0,
        sidepane_paneopen: true
    },
    {
        title: '  Nếu cần Thinkmay hỗ trợ, liên hệ chúng mình ngay nhé!',

        placement: 'left',
        spotlightPadding: 1,

        target: '#supportNow'
    }
];
const desktopGuide = [
    {
        title: 'LƯU Ý: Bạn đang mở chế độ web dành cho máy tính',
        content: (
            <div>
                Vui lòng chuyển qua chế độ web dành cho <b>điện thoại</b> nếu
                thiết bị của bạn là Điện thoại hoặc máy tính bảng
                <div className="flex justify-center mt-2">
                    <Image
                        className="w-[160px] rounded-md overflow-hidden"
                        src="asset/request_mobile_web"
                    />
                </div>
            </div>
        ),

        placement: 'center',
        target: 'body'
    },
    {
        title: 'Tinh chỉnh',
        content:
            'Bấm vô đây để tinh chỉnh kết nối sao cho mượt mà nhất, liên hệ Fanpage nếu bạn chưa biết cách chỉnh nhé!',

        placement: 'top',
        locale: {
            next: 'Next' // Continue with "Next"
        },
        spotlightPadding: 10,
        styles: {
            options: {
                width: 300
            }
        },
        target: '#settingBtn',
        sidepane_paneopen: true
    },
    {
        placement: 'left',
        target: '.fixKeyboardBtn',
        title: 'Đưa chuột vào icon “?” để nghiên cứu công dụng các nút này nha',
        spotlightPadding: 1
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
        title: '  Nếu cần Thinkmay hỗ trợ, liên hệ chúng mình ngay nhé!',

        placement: 'top',
        spotlightPadding: 1,

        target: '#supportNow'
    }
];

const BeaconComponent = forwardRef((props, ref) => {
    return <div ref={ref} className="tooltipBeacon" {...props}></div>;
});

function CustomTooltip(props) {
    const {
        backProps,
        closeProps,
        continuous,
        index,
        primaryProps,
        skipProps,
        step,
        tooltipProps,
        size,
        isLastStep,
        ...rest
    } = props;

    return (
        <div className="tooltipBody" {...tooltipProps}>
            <button className="tooltipClose" {...closeProps}>
                &times;
            </button>
            <p className="tooltipStep">
                {index > 0 ? (
                    <>
                        Bước {index}/{size - 1}
                    </>
                ) : (
                    'Halu'
                )}
            </p>
            {step.title && <h4 className="tooltipTitle">{step.title}</h4>}
            <div className="tooltipContent">{step.content}</div>
            <div className="tooltipFooter">
                {/*<button className="tooltipSkip" {...skipProps}>
                    {skipProps.title}
                </button>*/}
            </div>
            <div className="tooltipSpacer">
                {index > 0 && (
                    <button className="tooltipSkip" {...backProps}>
                        <MdKeyboardArrowLeft></MdKeyboardArrowLeft> Trước
                    </button>
                )}
                {continuous && (
                    <button className="tooltipContinue" {...primaryProps}>
                        {isLastStep ? (
                            <>
                                Xong <MdCheck fontSize={'1.2rem'} />{' '}
                            </>
                        ) : (
                            <>
                                Tiếp{' '}
                                <MdKeyboardArrowRight fontSize={'1.2rem'} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

//export function App() {
//    return (
//        <div>
//            <Joyride
//                tooltipComponent={CustomTooltip}
//                beaconComponent={BeaconComponent}

//            // ...
//            />
//        </div>
//    );
//}
export const PaidTutorial = () => {
    const logged_in = useAppSelector((state) => state.user.id != 'unknown');
    const [run, setRun] = useState(false);

    const [stepIndex, setStepIndex] = useState(0);

    const stop = () => {
        setRun(false);
        appDispatch(show_tutorial('close'));
        localStorage.setItem(localStorageKey.shownPaidUserTutorial, 'true');
    };

    const allSteps = [...general, ...(isMobile() ? mobileGuide : desktopGuide)];

    useEffect(() => {
        if (logged_in) setRun(true);
    }, [logged_in]);

    const handleJoyrideCallback = ({ status, index, type, action }) => {
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) stop();
        else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
        }

        if (allSteps[index].sidepane_paneopen) {
            appDispatch(sidepane_paneopen());
        }
    };

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                //beaconComponent={BeaconComponent}

                scrollToFirstStep
                continuous
                showProgress
                disableOverlayClose
                steps={allSteps}
                run={run}
                tooltipComponent={CustomTooltip}
                disableOverlay={isMobile() && stepIndex < 4 ? true : false}
            />

            {stepIndex == 3 && isMobile() ? <MouseMobileGuide /> : null}
        </>
    );
};

const MouseMobileGuide = () => {
    return (
        <div className="guideUsingMouse">
            <div className="mouseLeft">Bấm chuột trái</div>
            <div className="mouseRight">Bấm chuột phải</div>
        </div>
    );
};
