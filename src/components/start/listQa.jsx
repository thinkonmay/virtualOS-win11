import {
    appDispatch,
    popup_open,
    useAppSelector
} from '../../backend/reducers';
import './listQa.scss';

export const ListQAs = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const listQa = useAppSelector((state) => state.listQa.list);
    const hide = useAppSelector((state) => state.listQa.hide);
    const align = useAppSelector((state) => state.taskbar.align);
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
        <div
            style={{ '--prefix': 'QA' }}
            data-hide={hide}
            data-align={align}
            className="listQAs"
        >
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
