import { MdInfoOutline } from 'react-icons/md';
import { useAppSelector } from '../../../backend/reducers';

export function info({ data: { title, text } }) {
    const t = useAppSelector((state) => state.globals.translation);
    return (
        <div className="w-[330px] md:w-[440px] h-auto p-[14px] md:p-[24px] pb-6 md:pb-8">
            <div className="notify-icon">
                <MdInfoOutline />
            </div>
            <p className="text-center text-[1.2rem] md:text-3xl mb-[16px]">
                {title ?? 'Please wait...'}
            </p>
            {text ? (
                <p className="mb-3 md:text-xl text-center"> {text} </p>
            ) : null}
        </div>
    );
}
