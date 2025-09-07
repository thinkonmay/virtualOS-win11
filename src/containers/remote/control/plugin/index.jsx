import { virtMouseWheel } from '#/singleton';
import { clickShortCut } from '@/backend/actions';
import {
    appDispatch,
    open_gaming_keyboard,
    toggle_gamepad,
    toggle_keyboard
} from '@/backend/reducers';
import { Icon } from '@/components/shared/general';
import { LuClipboardCopy, LuClipboardPaste } from 'react-icons/lu';
import {
    MdGamepad,
    MdOutlineKeyboard,
    MdOutlineSportsEsports
} from 'react-icons/md';

export const Plugin = () => {
    return (
        <>
            <div
                onClick={() => appDispatch(open_gaming_keyboard())}
                className="z-10 absolute bottom-16 right-4 flex items-center justify-center rounded-sm bg-[#212121c4] w-[32px] h-[24px] text-[#ffffffe6]"
            >
                <MdGamepad fontSize={'1.4rem'} />
            </div>
            <div
                onClick={() => appDispatch(toggle_keyboard())}
                className="z-10 absolute bottom-5 right-4 flex items-center justify-center rounded-sm bg-[#212121c4] w-[32px] h-[24px] text-[#ffffffe6]"
            >
                <MdOutlineKeyboard fontSize={'1.4rem'} />
            </div>
            <div
                onClick={() => appDispatch(toggle_gamepad())}
                className="z-10 absolute bottom-5 left-4 flex items-center justify-center rounded-sm bg-[#212121c4] w-[32px] h-[24px] text-[#ffffffe6]"
            >
                <MdOutlineSportsEsports fontSize={'1.4rem'} />
            </div>

            <div className="z-10 absolute bottom-[40%]  left-4 flex flex-col gap-4">
                <button
                    className="py-2 px-1 rounded-md bg-[#212121c4]"
                    onClick={() => clickShortCut(['control', 'v'])}
                >
                    <LuClipboardPaste width={32} color="#fff" />
                </button>

                <button
                    className="py-2 px-1 rounded-md bg-[#212121c4]"
                    onClick={() => clickShortCut(['control', 'c'])}
                >
                    <LuClipboardCopy width={32} color="#fff" />
                </button>
            </div>

            <div className="z-10 absolute bottom-[40%]  right-4 flex flex-col gap-4">
                <button
                    className="py-2 rounded-md bg-[#212121c4]"
                    onClick={() => virtMouseWheel(-150)}
                >
                    <Icon src="mouseUp" width={32} />
                </button>

                <button
                    className="py-2 rounded-md bg-[#212121c4]"
                    onClick={() => virtMouseWheel(150)}
                >
                    <Icon src="mouseDown" width={32} />
                </button>
            </div>

            <div className="z-10 absolute top-16 left-4 flex flex-col gap-4">
                <button
                    className="py-2 px-1 rounded-md bg-[#212121c4] text-white"
                    onClick={() => clickShortCut(['lwin', 'd'])}
                >
                    home
                </button>
            </div>
            <div className="z-10 absolute top-16 right-4 flex flex-col gap-4">
                <button
                    className="py-2 px-1 rounded-md bg-[#212121c4] text-white"
                    onClick={() => clickShortCut(['Enter'])}
                >
                    enter
                </button>
            </div>
        </>
    );
};
