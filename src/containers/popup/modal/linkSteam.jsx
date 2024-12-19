import { useRef } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { POCKETBASE } from '../../../../src-tauri/api';
import { useAppSelector } from '../../../backend/reducers';

export function linkSteam({}) {
    const id = useAppSelector((state) => state.user.id);
    const username = useRef(null);
    const password = useRef(null);
    const handleCopy = async () => {
        const result =
            await POCKETBASE.collection('thirdparty_account').getFullList();
        if (result.length == 0) {
            POCKETBASE.collection('thirdparty_account').create({
                user: id,
                metadata: {
                    username: username.current.value,
                    password: password.current.value
                }
            });
        } else {
            POCKETBASE.collection('thirdparty_account').update(result[0].id, {
                metadata: {
                    username: username.current.value,
                    password: password.current.value
                }
            });
        }
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
                    <input ref={username} className="line-clamp-1 text-sm" />
                </div>
            </div>
            <div className=" flex justify-between gap-3 items-center rounded-lg p-2 bg-slate-200">
                <div className="text-gray-900 ">
                    <input ref={password} className="line-clamp-1 text-sm" />
                </div>
                <button
                    className=" bg-slate-300 p-2 rounded-md flex justify-center items-center hover:opacity-80"
                    onClick={handleCopy}
                >
                    <MdContentCopy
                        fontSize={'1.3rem'}
                        className="text-gray-700"
                    />
                </button>
            </div>
        </div>
    );
}
