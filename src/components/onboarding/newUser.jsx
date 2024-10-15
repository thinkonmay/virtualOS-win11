import { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAppSelector } from '../../backend/reducers';

export const NewTutorial = () => {
    const test = [
        {
            content: (
                <div>
                    <h2>Thinkmay CloudPC</h2>
                    <p className="mt-2">
                        Chào mừng bạn đến với tiệm nét Thinkmay
                    </p>
                </div>
            ),
            locale: { next: 'Next' },
            placement: 'center',
            target: 'body'
        },
        {
            content: 'Đăng kí, chọn game và thanh toán dịch vụ tại đây',
            floaterProps: {
                disableAnimation: true
            },
            spotlightPadding: 20,
            locale: {
                next: 'Next' // Continue with "Next",
            },
            target: '.payment',
            title: 'Thanh toán'
        },
        {
            content: 'Với gói tháng, dữ liệu cá nhân của bạn sẽ được lưu lại',
            placement: 'bottom',
            locale: {
                next: 'Next' // Continue with "Next"
            },
            spotlightPadding: 20,
            styles: {
                options: {
                    width: 300
                }
            },
            target: '.connectPc',
            title: 'Gói tháng'
        },
        {
            content:
                'Với gói theo giờ, bạn vô đây để chơi các game đã được cài sẵn',
            placement: 'bottom',
            spotlightPadding: 20,

            locale: {
                next: 'Next' // Continue with "Next"
            },

            styles: {
                options: {
                    width: 300
                }
            },
            target: '.store',
            title: 'Gói giờ'
        },
        {
            content: (
                <div>Hướng dẫn tối ưu trải nghiệm âm thanh và hình ảnh.</div>
            ),
            placement: 'top',
            spotlightPadding: 20,

            target: '.guideline',
            title: 'Video hướng dẫn'
        },
        {
            content: <h2>Nhắn tin với chúng mình để được hỗ trợ</h2>,
            placement: 'top',
            target: '.supportNow'
        }
    ];

    const logged_in = useAppSelector((state) => state.user.id != 'unknown');
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (logged_in) setRun(true);
    }, [logged_in]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) setRun(false);
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            scrollToFirstStep
            continuous
            showProgress
            disableOverlayClose
            steps={test}
            run={run}
            styles={{
                options: {
                    zIndex: 10000,
                    overlayColor: 'rgba(0, 0, 0, 0.8)'
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
