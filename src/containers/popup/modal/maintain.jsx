import { MdInfoOutline } from 'react-icons/md';
import { appDispatch, popup_close } from '../../../backend/reducers';

export function maintain({ data: { start, end } }) {
    return (
        <div className="w-[348px] h-auto flex flex-col p-[24px] rounded-lg">
            <div className="flex justify-center items-center gap-2 text-[#d92d21]">
                <MdInfoOutline className="text-3xl"></MdInfoOutline>
                {/*<h3 className="text-xl">Dịch vụ sắp hết hạn</h3>*/}
                <h3 className="text-xl">THÔNG TIN BẢO TRÌ</h3>
            </div>

            <div className="flex flex-col items-start gap-2 mt-4 text-[1.125rem]">
                <p>
                    Từ: <b>{start}</b>
                </p>
                <p>
                    Kết thúc dự kiến: <b>{end}</b>
                </p>

                <p className="text-[1rem]">
                    Bạn vui lòng không mở máy trong khoảng thời gian này để
                    tránh việc mất dữ liệu không đáng có!.
                </p>
                <p className="text-[0.85rem] text-right w-full">
                    Trân trọng, đội ngũ Thinkmay ^^.
                </p>
            </div>

            <button
                onClick={() => {
                    appDispatch(popup_close());
                }}
                className="instbtn self-end mt-4 h-8 text-[0.75rem]"
            >
                Yes sir!
            </button>
        </div>
    );
}
