import { MdClose } from 'react-icons/md';

import { appDispatch, popup_close } from '../../../backend/reducers';
import '../index.scss';

export function serversInfo() {
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
                    <div className="columnContent">Play.</div>
                    <div className="columnContent">Play.2</div>
                    <div className="columnContent">Play.3</div>
                </div>

                <div className="rowContent">
                    <div className="columnContent">Vị trí</div>
                    <div className="columnContent">Miền Nam</div>
                    <div className="columnContent">Miền Nam</div>
                    <div className="columnContent">Miền Bắc</div>
                </div>
                <div className="rowContent">
                    <div className="columnContent">Nhà Mạng</div>
                    <div className="columnContent">FPT</div>
                    <div className="columnContent">FPT</div>
                    <div className="columnContent">VNPT</div>
                </div>
                <div className="rowContent">
                    <div className="columnContent">Khuyến nghị</div>
                    <div className="columnContent">Phù hợp mọi nhu cầu</div>
                    <div className="columnContent">
                        Chơi GTA 5 & thiết bị là Iphone, IPad
                    </div>
                    <div className="columnContent">
                        Chơi AAA games & thiết bị là Iphone, IPad
                    </div>
                </div>
            </div>
        </div>
    );
}
