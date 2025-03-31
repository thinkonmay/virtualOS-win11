import { MdInfoOutline } from 'react-icons/md';
import {
    app_full,
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';

export function discount({ data: { from, to, percentage } }) {
    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-5">
            <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-3xl"></MdInfoOutline>
                <h3 className="text-xl">
                    Thinkmay khuyến mãi {Math.round(percentage * 100)}%
                </h3>
            </div>

            <div className="justify-center">
                <p className="mt-[8px] justify-center">
                    từ ngày {from} đến ngày {to}
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
                    onClick={() => {
                        appDispatch(app_full({ id: 'payment', page: 'sub' }));
                        appDispatch(popup_close(true));
                    }}
                    target="_self"
                    className="cursor-pointer  text-base font-medium instbtn rounded-md"
                >
                    Nạp thêm
                </a>
            </div>
        </div>
    );
}
