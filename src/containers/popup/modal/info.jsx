import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';

export function info({ data: { title, text } }) {
    const t = useAppSelector((state) => state.globals.translation);
    return (
        <div className="w-[330px] md:w-[440px] h-auto p-[14px] md:p-[24px] pb-6 md:pb-8">
            {/*<div className="notify-icon">
                <MdInfoOutline />
            </div>*/}
            {/*<p className="text-center text-[1.2rem] md:text-3xl mb-[16px]">
                {title ?? 'Please wait...'}
            </p>*/}
            {/*{text ? (
                <p className="mb-3 md:text-xl text-center"> {text} </p>
            ) : null}*/}

            <div className="bg-[#313338] h-[110%] py-5 rounded-xl">
                <img src="img/asset/maintain_notify.png" className="w-full" />
            </div>

            <div className="flex gap-3 justify-end mt-5">
                <a
                    href="https://www.facebook.com/thinkonmay"
                    target="_blank"
                    className="block pt-3 instbtn rounded-lg px-4 py-2 text-base font-medium"
                >
                    Đổi server!
                </a>
                <button
                    onClick={() => {
                        appDispatch(popup_close());
                    }}
                    className="btn btn-secondary bg-red-500 hover:bg-red-400"
                >
                    đóng
                </button>
            </div>
        </div>
    );
}
