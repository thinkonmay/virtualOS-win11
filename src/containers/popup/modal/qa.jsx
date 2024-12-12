import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';

import '../index.scss';
export function showQa({ data: { key } }) {
    const listQa = useAppSelector((state) => state.listQa.list);

    const handleClose = () => {
        appDispatch(popup_close());
    };

    return (
        <div className="showQa w-[320px] md:w-[480px] lg:w-[720px] h-auto p-[20px] lg:p-6 rounded-lg flex flex-col gap-y-3">
            <div className="max-h-[280px] md:h-auto win11Scroll overflow-auto">
                {listQa[key].map((qa, index) => (
                    <div key={index} className="mb-6">
                        <p className=" text-[16px] lg:text-[24px]  mb-3 font-semibold">
                            {qa.ques}
                        </p>
                        <p className="leading-[1rem] text-xs lg:leading-6 lg:text-base">
                            {qa.ans}
                        </p>
                    </div>
                ))}
            </div>

            <button onClick={handleClose} className="continueBtn">
                Xong
            </button>
        </div>
    );
}
