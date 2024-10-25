import ReactModal from 'react-modal';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';

const preferred = ['extendService', 'redirectDomain', 'maintain'];
const preferred_title = ['Connect to PC'];
const Popup = () => {
    const popup = useAppSelector((state) => {
        for (const element of preferred) {
            const result = state.popup.data_stack.find(
                (x) => element == x.type
            );
            if (result != undefined) return result;
        }

        return (
            state.popup.data_stack.find(
                (x) =>
                    x.type == 'notify' && preferred_title.includes(x.data.title)
            ) ?? state.popup.data_stack.findLast(() => true)
        );
    });

    const closeModal = () => {
        popup.type == 'complete' || popup.type == 'maintain'
            ? appDispatch(popup_close())
            : null;
    };
    return (
        <>
            {popup != undefined ? (
                <ReactModal
                    isOpen={true}
                    contentLabel="Modal"
                    className="modalContent "
                    overlayClassName="modalOverlay"
                    onRequestClose={closeModal}
                    style={
                        popup.type == 'guidance'
                            ? { 'backdrop-filter': '' }
                            : { 'backdrop-filter': 'blur(3px) brightness(0.5)' }
                    }
                >
                    <div className="selectText d-flex overflow-auto min-h-full">
                        {Object.keys(modals)
                            .filter((x) => x == popup.type)
                            .map((key, idx) => {
                                const Modal = modals[key];
                                return <Modal key={idx} data={popup.data} />;
                            })}
                    </div>
                </ReactModal>
            ) : null}
        </>
    );
};

export default Popup;
