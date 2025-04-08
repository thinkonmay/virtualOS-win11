import { useEffect, useState } from 'react';
import { MdCheckCircleOutline, MdContentCopy } from 'react-icons/md';

export function shareLink({ data: { link } }) {
    const [isSuccess, setSuccess] = useState(false);

    useEffect(() => {
        let interval;

        if (isSuccess) {
            interval = setInterval(() => {
                setSuccess(false);
            }, [1500]);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isSuccess]);
    const handleCopy = () => {
        setSuccess(true);
        navigator.clipboard.writeText(link);
    };
    return (
        <div className="w-[330px] md:w-[400px] h-auto p-[14px] md:p-[24px] pb-6 md:pb-8">
            <div>
                <p className="text-left text-[1.2rem] md:text-2xl mb-[0px]">
                    {'Share link'}
                </p>
            </div>
            <p className="text-lg mb-8">Mời bạn bè chơi chung 👇</p>

            <div className=" flex justify-between gap-3 items-center rounded-lg p-2 bg-slate-200">
                <div className="text-gray-900 ">
                    <p className="line-clamp-1 text-sm">
                        {link ?? 'Chưa mở máy'}
                    </p>
                </div>
                <button
                    className=" bg-slate-300 p-2 rounded-md flex justify-center items-center hover:opacity-80"
                    onClick={handleCopy}
                >
                    {!isSuccess ? (
                        <MdContentCopy
                            fontSize={'1.3rem'}
                            className="text-gray-700"
                        />
                    ) : (
                        <MdCheckCircleOutline
                            fontSize={'1.3rem'}
                            className="text-gray-700"
                        />
                    )}
                </button>
            </div>

            {isSuccess ? (
                <p className="text-end text-sm mt-2">Copied to clipboard!</p>
            ) : null}

            <p className="mt-6">
                <b>Lưu ý:</b> Máy sẽ tắt sau 10' nếu chính chủ không hoạt
                động{' '}
            </p>
        </div>
    );
}
