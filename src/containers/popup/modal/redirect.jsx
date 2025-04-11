import { MdInfoOutline } from 'react-icons/md';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';
import { preload } from '../../../backend/actions/background';

export function redirectDomain({ data: { domain } }) {
    const t = useAppSelector((state) => state.globals.translation);
    const from = useAppSelector((state) => state.worker.currentAddress);

    const updateDomain = async () => {
        localStorage.setItem('thinkmay_domain', domain);
        await preload();
        appDispatch(popup_close());
    };

    return (
        <div
            id="promo-popup"
            tabIndex="-1"
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
            style={{
                backdropFilter: 'blur(3px) brightness(0.5)'
            }}
        >
            <div className="relative p-4 w-full max-w-xs max-h-full text-white">
                <div className="relative rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
                    <div className="flex justify-center items-center gap-2 ">
                        <MdInfoOutline className="text-3xl"></MdInfoOutline>
                        <h3 className="text-xl">{t[Contents.SWITCH_DOMAIN]}</h3>
                    </div>

                    <div className="justify-center">
                        <p className="mt-[8px] justify-center">
                            {t[Contents.YOU_REGISTERED_AT]} {domain}
                            <br />
                            {t[Contents.YOU_ARE_IN]} {from}
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center mt-3 mb-2">
                        <button
                            style={{ padding: '6px 14px' }}
                            className=" text-base font-medium rounded-md"
                            onClick={() => appDispatch(popup_close())}
                        >
                            {t[Contents.CONTINUE]}
                        </button>
                        <a
                            style={{ padding: '6px 14px' }}
                            onClick={() => updateDomain()}
                            target="_self"
                            className="cursor-pointer  text-base font-medium instbtn rounded-md"
                        >
                            {t[Contents.SWITCH_DOMAIN]}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
