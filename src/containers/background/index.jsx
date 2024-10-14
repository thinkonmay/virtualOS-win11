import { useState } from 'react';
import { login } from '../../backend/actions';
import {
    appDispatch,
    useAppSelector,
    wall_unlock
} from '../../backend/reducers';
import { externalLink } from '../../backend/utils/constant';
import Battery from '../../components/shared/Battery';
import { Icon, Image } from '../../components/shared/general';
import './back.scss';
import './getstarted.scss';

export const Background = () => {
    const wall = useAppSelector((state) => state.wallpaper);
    return (
        <div
            className="background"
            style={{
                backgroundImage: `url(img/wallpaper/${wall.src})`
            }}
        ></div>
    );
};

export const BootScreen = ({ loadingText }) => {
    const t = useAppSelector((state) => state.globals.translation);
    return (
        <div className="bootscreen">
            <div>
                <Image src="asset/bootlogo" w={180} />
                <div className="text-l font-semibold text-gray-100">
                    {t[loadingText]}
                </div>
                <div className="mt-4" id="loader">
                    <svg
                        className="progressRing"
                        height={48}
                        width={48}
                        viewBox="0 0 16 16"
                    >
                        <circle cx="8px" cy="8px" r="7px"></circle>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export const LockScreen = () => {
    const [lock, setLock] = useState(false);
    const [unlocked, setUnLock] = useState(false);

    const user = useAppSelector((state) => state.user);
    const dispatch = appDispatch;
    const action = () => {
        setLock(true);
    };

    const proceed = async (provider) => {
        if (user.id != 'unknown') {
            setUnLock(true);
            dispatch(wall_unlock());

            return;
        }

        await login(provider);
    };

    return (
        <div
            className={'lockscreen slowfadein'}
            data-unlock={unlocked}
            style={{ backgroundImage: `url(img/wallpaper/lock.png)` }}
            onClick={action}
            data-blur={lock}
        >
            <div className="splashScreen mt-40" data-faded={lock}>
                <div className="text-6xl font-semibold text-gray-100">
                    {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })}
                </div>
                <div className="text-lg font-medium text-gray-200">
                    {new Date().toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <div
                className="fadeinScreen"
                data-faded={!lock}
                data-unlock={unlocked}
            >
                <div className="w-[120px] lg:w-[200px] h-[120px] lg:h-[200px] ctn-logo rounded-full p-4">
                    <Image
                        className="rounded-2xl overflow-hidden"
                        src="img/asset/prof.png"
                        w={'inherit'}
                        ext
                    />
                </div>
                <div className="mt-2 text-2xl font-medium text-gray-200">
                    {user?.email ?? ''}
                </div>
                {/*<
                >
                    {user.id != 'unknown' ? ' Enter' : 'Continue with Google'}
                </>*/}

                <div className="ctn_btn_login mt-8">
                    {user?.id != 'unknown' ? (
                        <div
                            className="flex items-center mt-6 signInBtn"
                            onClick={proceed}
                        >
                            Enter
                        </div>
                    ) : (
                        <div className="flex flex-col items-start">
                            <div
                                className="instbtn px-[24px] py-[12px] rounded-full flex gap-2 items-center"
                                onClick={() => proceed('google')}
                            >
                                <span className="text-lg text-white font-medium">
                                    Tiếp tục với
                                </span>
                                <div className="flex gap-[8px]">
                                    <button className="base gg_button">
                                        <Icon src="google" width={40} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bottomInfo">
                <div className="bottomInfoRight">
                    <p>Community:</p>
                    <div className="flex gap-2 mt-2">
                        <a target="_blank" href={externalLink.DISCORD_LINK}>
                            <Icon src="discord" width={40} />
                        </a>
                        <a target="_blank" href={externalLink.FACEBOOK_LINK}>
                            <Icon src="facebook" width={40} />
                        </a>
                    </div>
                </div>
                {!lock ? (
                    <p className="italic mt-[80px]">Click to start</p>
                ) : (
                    <div className="mr-[2%]">
                        <span className="text-sm text-white font-medium">
                            Hoặc tìm hiểu thêm{' '}
                            <a
                                href="https://thinkmay.net/"
                                className="underline"
                            >
                                tại đây
                            </a>
                        </span>
                    </div>
                )}
                <div className="bottomInfoLeft flex">
                    <Icon className="mx-2" src="wifi" ui width={16} invert />
                    <Battery invert />
                </div>
            </div>
        </div>
    );
};
