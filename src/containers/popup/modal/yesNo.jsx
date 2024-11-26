import { MdInfoOutline } from 'react-icons/md';
import {
    appDispatch,
    change_template,
    popup_close
} from '../../../backend/reducers';

export function yesNo({ data: { title, content, template } }) {
    const handleContinue = () => {
        appDispatch(popup_close());
        appDispatch(
            change_template({
                template
            })
        );
    };
    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-3">
            <div className="flex flex-col justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-4xl text-orange-600"></MdInfoOutline>
                <h3>{title}</h3>
            </div>

            <div>
                <p className="mt-[8px]">{content}</p>
            </div>
            <div className="flex gap-3 justify-end mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className="text-base font-medium rounded-md"
                    onClick={() => {
                        appDispatch(popup_close());
                    }}
                >
                    Đóng
                </button>
                <button
                    style={{ padding: '6px 14px' }}
                    onClick={handleContinue}
                    className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}
