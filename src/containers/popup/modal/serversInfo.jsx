import { MdClose } from 'react-icons/md';

import { appDispatch, popup_close } from '../../../backend/reducers';
import '../index.scss';

export function serversInfo({ domains }) {
    return (
        <div className="serversInfo relative">
            <div className="ctnCloseBtn ">
                <button
                    className="btn"
                    onClick={() => {
                        appDispatch(popup_close());
                    }}
                >
                    <MdClose className="icon" />
                </button>
            </div>

            <h2 className="title">Bảng so sánh</h2>
            <div className="wrapperTable">
                <div className="rowContent" style={{ borderTop: 'unset' }}>
                    <div className="columnContent"></div>
                    {domains.map((x) => (
                        <div className="columnContent">{x.domain}</div>
                    ))}
                </div>

                <div className="rowContent">
                    <div className="columnContent">Độ trễ</div>
                    {domains.map((x) => (
                        <div className="columnContent">{x.latency}ms</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
