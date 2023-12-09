import ModalEditOrInsert from './modal/admin';
import Modal from './modal/index';
import Notify from './modal/notify';
import PaymentModal from './modal/payment';
import ReleaseAppModal from './modal/release';
import { UserFeedBack } from './modal/userFeedBack';
import ModalSelectVendor from './modal/vendor';
import ModalWorkerInfo from './modal/worker';

import { useAppSelector } from '../../backend/reducers';
import './index.scss';
const Popup = (props) => {
    const modalInfo = useAppSelector((state) => state.modal);
    //const modalInfo ={type: 'notify', data:''}
    return (
        <Modal type={modalInfo?.type} isOpen={modalInfo.type != 'disable'}>
            {modalInfo.type == 'insert_store' ? (
                <ModalEditOrInsert
                    modalType={'insert'}
                    appData={modalInfo.data}
                />
            ) : modalInfo.type == 'edit_store' ? (
                <ModalEditOrInsert
                    modalType={'edit'}
                    appData={modalInfo.data}
                />
            ) : modalInfo.type == 'select_vendor' ? (
                <ModalSelectVendor storeID={modalInfo.data.storeID} />
            ) : modalInfo.type == 'view_worker' ? (
                <ModalWorkerInfo data={modalInfo.data} />
            ) : modalInfo.type == 'user_feedback' ? (
                <UserFeedBack data={modalInfo.data} />
            ) : modalInfo.type == 'pm_modal' ? (
                <PaymentModal data={modalInfo.data} />
            ) : modalInfo.type == 'release_app' ? (
                <ReleaseAppModal data={modalInfo.data} />
            ) : modalInfo.type == 'notify' ? (
                <Notify data={modalInfo.data} />
            ) : null}
        </Modal>
    );
};

export default Popup;
