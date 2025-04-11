import { useAppSelector } from '../../backend/reducers';
import * as modalsv2 from './modal/v2';

const Popup = () => {
    const popup = useAppSelector((state) =>
        state.popup.data_stack.length > 0
            ? state.popup.data_stack[state.popup.data_stack.length - 1]
            : undefined
    );

    return popup != undefined
        ? Object.keys(modalsv2)
              .filter((x) => x == popup.type)
              .map((key, idx) => {
                  const Modal = modalsv2[key];
                  return <Modal key={idx} data={popup.data} />;
              })
        : null;
};

export default Popup;
