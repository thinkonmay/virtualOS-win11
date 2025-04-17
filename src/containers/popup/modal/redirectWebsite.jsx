import { MdInfoOutline } from 'react-icons/md';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';

export function redirectWebsite() {
    const t = useAppSelector((state) => state.globals.translation);
    const from = useAppSelector((state) => state.worker.currentAddress);

    const updateDomain = () =>
        window.open(
            `https://thinkmay.net/play/index.html?server=${from}`,
            '_self'
        );

    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-5">
            <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-3xl"></MdInfoOutline>
                <h3 className="text-xl">Chuyển website</h3>
            </div>

            <div className="justify-center">
                <p className="mt-[8px] justify-center">
                    Từ ngày 17/4/2025, thinkmay sẽ chuyển toàn bộ website về thinkmay.net, 
                    <br />
                    trang web này vẫn có thể sử dụng bình thường cho đến 30/4/2025
                    <br />
                    tuy nhiên bạn sẽ sử dụng một phiên bản cũ hơn
                </p>
            </div>
            <div className="flex gap-3 justify-center mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className=" text-base font-medium rounded-md"
                    onClick={() => appDispatch(popup_close(true))}
                >
                    Chấp nhận và tiếp tục
                </button>
                <a
                    style={{ padding: '6px 14px' }}
                    onClick={updateDomain}
                    target="_self"
                    className="cursor-pointer  text-base font-medium instbtn rounded-md"
                >
                    Chuyển trang ngay
                </a>
            </div>
        </div>
    );
}
