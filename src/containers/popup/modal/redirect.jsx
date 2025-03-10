import { MdInfoOutline } from 'react-icons/md';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';

export function redirectDomain({ data: { domain } }) {
    const from = useAppSelector((state) => state.worker.currentAddress);

    const updateDomain = () => {
        localStorage.setItem('thinkmay_domain', domain);
        window.location.reload();
    };

    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-5">
            <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-3xl"></MdInfoOutline>
                <h3 className="text-xl">Chuyển hướng</h3>
            </div>

            <div className="justify-center">
                <p className="mt-[8px] justify-center">
                    Bạn đã đăng kí tại {domain}
                    <br />
                    Bạn đang ở {from}
                </p>
            </div>
            <div className="flex gap-3 justify-center mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className=" text-base font-medium rounded-md"
                    onClick={() => appDispatch(popup_close(true))}
                >
                    Tiếp tục
                </button>
                <a
                    style={{ padding: '6px 14px' }}
                    onClick={() => updateDomain()}
                    target="_self"
                    className="cursor-pointer  text-base font-medium instbtn rounded-md"
                >
                    Chuyển server
                </a>
            </div>
        </div>
    );
}
