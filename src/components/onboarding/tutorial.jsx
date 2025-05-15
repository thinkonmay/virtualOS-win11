import { forwardRef, useEffect, useRef, useState } from 'react';
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
    sidepane_panehide,
    sidepane_paneopen,
    useAppSelector
} from '../../backend/reducers';
import { Image } from '../shared/general';
import './assets/paidUser.scss';

const generalStart = [
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

const generalEnd = [
    {
        title: 'Thanh toán',
        content: 'Xem thông tin về các gói đăng kí tại Thinkmay',
        placement: 'right',
        target: '#payment'
    },
    {
        title: 'Tải game',
        content: 'Tải game tại đây',
        placement: 'right',
        target: '#store'
    },
    {
        title: 'Kết nối và chơi game',
        content: 'Kết nối và sử dụng Cloud PC',
        placement: 'right',
        target: '#connectPc'
    },
    {
        title: 'Nếu cần Thinkmay hỗ trợ, liên hệ chúng mình ngay nhé!',
        placement: 'top',
        spotlightPadding: 1,
        target: '#supportNow'
    },
    {
        title: 'Xem lại hướng dẫn 1 lần nữa',
        content: 'Nếu như bạn chưa rõ cách sử dụng sản phẩm',
        placement: 'right',
        target: '#guideline'
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
            'Bấm vào nửa màn hình bên trái để click chuột trái, phải là chuột phải',
        title: 'Làm quen với chuột ảo: CHUỘT TRÁI & PHẢI',
        showLRMouse: true,
        spotlightPadding: 1
    },
    {
        title: 'Ấn để mở bảng cài đặt',
        content: 'Chạm & giữ để nghiên cứu công dụng các nút này nha',

        placement: 'bottom',
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
        placement: 'bottom',
        target: '.virtKeyboardBtn',
        content: 'Lưu ý: Khi đang mở bàn phím ảo sẽ không sử dụng được chuột',
        title: 'Mở bàn phím ảo',
        spotlightPadding: 0,
        sidepane_paneopen: true
    },
    {
        placement: 'auto',
        target: '.virtGamepadBtn',
        content: 'Lưu ý: Khi đang mở tay cầm ảo sẽ không sử dụng được chuột',
        title: 'Mở bàn tay cầm ảo',
        spotlightPadding: 0,
        sidepane_paneopen: true
    }
];
const desktopGuide = [
    {
        title: 'Tinh chỉnh',
        content: 'Bấm vô đây để tinh chỉnh kết nối sao cho mượt mà nhất',

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
        spotlightPadding: 1,
        sidepane_paneopen: true
    },
    {
        title: 'Thông tin tài khoản',
        content: 'Xem thông tin về tài khoản của bạn, bao gồm thời gian chơi',

        placement: 'top',
        target: '.infoBtn',
        spotlightPadding: 1
    }
];

const ContinueButton = ({ primaryProps, isLastStep }) => {
    return (
        <button className="tooltipContinue bg-cyan-400" {...primaryProps}>
            {isLastStep ? (
                <>
                    Xong <MdCheck fontSize={'1.2rem'} />{' '}
                </>
            ) : (
                <>
                    Tiếp <MdKeyboardArrowRight fontSize={'1.2rem'} />
                </>
            )}
        </button>
    );
};
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
            <div className="tooltipFooter"></div>
            <div className="tooltipSpacer">
                {index > 0 && (
                    <button className="tooltipSkip" {...backProps}>
                        <MdKeyboardArrowLeft></MdKeyboardArrowLeft> Trước
                    </button>
                )}
                {continuous && (
                    <ContinueButton
                        primaryProps={primaryProps}
                        isLastStep={isLastStep}
                    />
                )}
            </div>
        </div>
    );
}

export const Tutorial = () => {
    const show = useAppSelector((state) => state.globals.tutorial);
    const [lrmouse, showLRMouse] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    const allSteps = [
        ...generalStart,
        ...(isMobile() ? mobileGuide : desktopGuide),
        ...generalEnd
    ];

    const handleJoyrideCallback = ({ status, index, type, action }) => {
        showLRMouse(allSteps[index]?.showLRMouse ?? false);

        if (allSteps[index]?.sidepane_paneopen)
            appDispatch(sidepane_paneopen());
        else appDispatch(sidepane_panehide());

        if (
            [STATUS.FINISHED, STATUS.SKIPPED].includes(status) ||
            action === ACTIONS.CLOSE
        ) {
            setStepIndex(0);
            appDispatch(show_tutorial('close'));
        } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type))
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    };

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                disableScrollParentFix={true}
                scrollToFirstStep={false}
                disableScrolling={false}
                continuous
                showProgress
                disableOverlayClose
                run={show}
                steps={allSteps}
                stepIndex={stepIndex}
                tooltipComponent={CustomTooltip}
                disableOverlay={isMobile() && stepIndex < 4 ? true : false}
            />
            {lrmouse ? <MouseMobileGuide /> : null}
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
