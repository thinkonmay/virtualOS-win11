import ReactModal from 'react-modal';
import {
    appDispatch,
    popup_close,
    useAppSelector
} from '../../backend/reducers';
import './index.scss';
import * as modalsv1 from './modal/v1';
import * as modalsv2 from './modal/v2';

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
        popup.type == 'complete' || popup.type == 'shareLink'
            ? appDispatch(popup_close())
            : null;
    };

    const v1popup =
        popup != undefined
            ? Object.keys(modalsv1).filter((x) => x == popup.type)
            : null;

    const Modalv1 = () => {
        return (
            <ReactModal
                isOpen={v1popup?.length > 0}
                contentLabel="Modal"
                className="modalContent"
                overlayClassName="modalOverlay"
                onRequestClose={closeModal}
                style={{ 'backdrop-filter': 'blur(3px) brightness(0.5)' }}
            >
                <div className="selectText d-flex min-h-full">
                    {v1popup?.map((key, idx) => {
                        const Modal = modalsv1[key];
                        return <Modal key={idx} data={popup.data} />;
                    })}
                </div>
            </ReactModal>
        );
    };
    const Modalv2 = () => {
        return popup != undefined
            ? Object.keys(modalsv2)
                  .filter((x) => x == popup.type)
                  .map((key, idx) => {
                      const Modal = modalsv2[key];
                      return <Modal key={idx} data={popup.data} />;
                  })
            : null;
    };

    return (
        <>
            {/* <Modalv1 /> */}
            <Modalv2 />
        </>
    );
};

export default Popup;
