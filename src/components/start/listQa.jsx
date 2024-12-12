import {
    appDispatch,
    hideQa,
    popup_open,
    show_tutorial,
    useAppSelector
} from '../../backend/reducers';
import './listQa.scss';

export const ListQAs = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const listQa = useAppSelector((state) => state.listQa.list);
    const hide = useAppSelector((state) => state.listQa.hide);
    const handleOpenDeteil = (key) => {
        appDispatch(
            popup_open({
                type: 'showQa',
                data: {
                    key
                }
            })
        );
    };
    return (
        <div style={{ '--prefix': 'QA' }} data-hide={hide} className="listQAs">
            <div
                className="question"
                onClick={() => {
                    appDispatch(show_tutorial('PaidTutorial'));
                    appDispatch(hideQa());
                }}
            >
                Hướng dẫn tổng quan
            </div>
            {Object.keys(listQa).map((key) => (
                <div
                    className="question"
                    key={key}
                    onClick={() => {
                        handleOpenDeteil(key);
                    }}
                >
                    {t[key]}
                </div>
            ))}
        </div>
    );
};
