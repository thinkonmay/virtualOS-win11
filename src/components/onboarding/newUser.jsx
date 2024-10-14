import { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAppSelector } from '../../backend/reducers';

export const NewTutorial = () => {
    const test = [
        {
            content: (
                <div>
                    <h2>Welcome to Thinkmay CloudPC!</h2>
                    <p className="mt-2">
                        Thoả sức chơi game PC cấu hình cao ngay trên chiếc điện
                        thoai, laptop của bạn
                    </p>
                </div>
            ),
            locale: { next: 'Next' },
            placement: 'center',
            target: 'body'
        },
        {
            content:
                'Để sử dụng CloudPC, bạn cần chọn gói dịch vụ và hoàn tất thanh toán.',
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
            content: 'Với gói tháng, bạn vô đây để truy cập tới PC của mình',
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
                <div>Bạn có thể vô đây để xem chi tiết hướng dẫn sử dụng</div>
            ),
            placement: 'top',
            spotlightPadding: 20,

            target: '.guideline',
            title: 'Video hướng dẫn'
        },
        {
            content: <h2>Bạn vô đây để được support khi gặp sự cố</h2>,
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
