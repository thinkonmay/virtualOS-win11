import { useAppSelector } from '../../backend/reducers';
import { Image } from '../../components/shared/general';
import './back.scss';
import './getstarted.scss';

export const Background = () => {
    const src = useAppSelector((state) => state.wallpaper.src);
    return (
        <div
            className="background"
            style={{
                backgroundImage: `url(img/wallpaper/${src})`
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
