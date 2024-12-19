import ReactModal from 'react-modal';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';

const preferred = ['extendService', 'redirectDomain', 'maintain'];
const preferred_title = 'Connect to PC';
const Popup = () => {
    const popup = useAppSelector(
        (state) =>
            state.popup.data_stack.find(
                (x) => x.type == 'complete' && !x.data.success
            ) ??
            (state.popup.data_stack.length > 0
                ? state.popup.data_stack[state.popup.data_stack.length - 1]
                : undefined)
    );

    const closeModal = () => {
        popup.type == 'complete' ||
        popup.type == 'showQa' ||
        popup.type == 'maintain' ||
        popup.type == 'linkSteam' ||
        popup.type == 'shareLink'
            ? appDispatch(popup_close())
            : null;
    };
    return (
        <>
            <ReactModal
                isOpen={popup != undefined}
                contentLabel="Modal"
                className="modalContent "
                overlayClassName="modalOverlay"
                onRequestClose={closeModal}
                style={
                    popup?.type == 'guidance'
                        ? { 'backdrop-filter': '' }
                        : { 'backdrop-filter': 'blur(3px) brightness(0.5)' }
                }
            >
                <div className="selectText d-flex min-h-full">
                    {popup != undefined
                        ? Object.keys(modals)
                              .filter((x) => x == popup.type)
                              .map((key, idx) => {
                                  const Modal = modals[key];
                                  return <Modal key={idx} data={popup.data} />;
                              })
                        : null}
                </div>
            </ReactModal>
        </>
    );
};

export default Popup;
