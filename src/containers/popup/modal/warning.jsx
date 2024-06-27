import { MdInfoOutline } from 'react-icons/md';
import { appDispatch, popup_close } from '../../../backend/reducers';
import { externalLink } from '../../../backend/utils/constant';

export function warning({ data: { success, content } }) {
    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-5">
            <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-3xl"></MdInfoOutline>
                {/*<h3 className="text-xl">Dịch vụ sắp hết hạn</h3>*/}
                <h3 className="text-xl">Dịch vụ đã hết hạn</h3>
            </div>

            <div>
                {/*<p className="">Thời gian: 10h ngày 20/6/2024.</p>*/}
                <p className="mt-[8px] ">
                    {/*Bạn lưu ý để quá trình sử dụng không gặp gián đoạn, thân!*/}
                    Vui lòng gia hạn để tiếp tục sử dụng.
                </p>
            </div>
            <div className="flex gap-3 justify-end mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className=" text-base font-medium rounded-md"
                    onClick={() => {
                        appDispatch(popup_close());
                    }}
                >
                    Đóng
                </button>
                <a
                    style={{ padding: '6px 14px' }}
                    href={externalLink.FACEBOOK_LINK}
                    target="_blank"
                    className="cursor-pointer  text-base font-medium instbtn rounded-md"
                >
                    Gia hạn
                </a>
            </div>
        </div>
    );
}

const Content = ({ content }) => {
    return (
        <div className="mt-[8px]">
            <p>{content}</p>
        </div>
    );
};
