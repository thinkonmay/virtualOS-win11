import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { appDispatch, create_payment_link } from '../../backend/reducers';

const DepositPage = () => {
    const [depositNumber, setDepositNumber] = useState('');
    const [option, setOption] = useState('customize'); //Customize - current pay
    const [isErr, setErr] = useState('');

    const handleDeposit = () => {
        if (isErr) return;

        appDispatch(
            create_payment_link({
                amount: removeCommasAndCurrency(depositNumber)
            })
        );

        /// show thanh t oán.
    };

    function removeCommasAndCurrency(str) {
        // Extract just the numeric part with commas
        const numericPart = str.match(/[\d,]+/)[0];

        // Remove commas
        return numericPart.replace(/,/g, '');
    }

    const handleChangeDepositNumber = (e) => {
        setDepositNumber(e.target.value);

        if (!e.target.value) return;
        if (removeCommasAndCurrency(e.target.value) < 50000) {
            setErr(' Số tiền nạp phải >= 50k Vnđ');
        } else if (removeCommasAndCurrency(e.target.value) > 1000000000) {
            setErr('Wow, bạn giàu quá! Vui lòng nhập số tiền thực tế hơn');
        } else {
            setErr('');
        }
    };

    return (
        <div className="depositPage">
            <h2 className="title">Chuyển khoản ngân hàng</h2>

            <p className="subtitle mt-3">
                *Tiền sẽ chuyển vào ví sau 2-5 phút, mong bạn thông cảm
            </p>

            <div className="depositBox">
                <p className="subtitle">Số tiền muốn nạp</p>

                <div className="wrapperDeposit">
                    <NumericFormat
                        className="depositInput"
                        placeholder="Nhập số tiền (VNĐ)"
                        onChange={handleChangeDepositNumber}
                        value={depositNumber}
                        //allowLeadingZeros
                        suffix={' VNĐ'}
                        thousandSeparator=","
                    />

                    <button
                        onClick={handleDeposit}
                        className="instbtn depositBtn"
                    >
                        Nạp tiền
                    </button>
                </div>
            </div>
            {isErr ? (
                <p className="text-red-500 text-base mt-2 font-bold">{isErr}</p>
            ) : null}
            <div className="optionsBox">
                <div
                    className={`option ${
                        option == 'customize' ? 'selected' : ''
                    }`}
                >
                    Tuỳ chọn
                </div>
                {/*<div className={`option ${option == 'any' ? 'selected' : ''}`}>Gia hạn gói hiện tại</div>*/}
            </div>

            <div className="noticesBox">
                <p className="title">Lưu ý:</p>
                <ul className="">
                    <li>Số tiền nạp tối thiểu là 50,000 VNĐ</li>
                    <li>Tiền đã nạp không thể rút ra thành tiền mặt</li>
                    <li>
                        Nếu bạn gặp lỗi trong quá trình nạp, xin vui lòng liên
                        hệ Fanpage để được hỗ trợ
                    </li>
                </ul>
            </div>

            <CardDepositBox />
            <OthersDepositBox />
        </div>
    );
};

const CardDepositBox = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="cardDepositBox ">
            <div
                onClick={() => {
                    setOpen((old) => !old);
                }}
                className="toggleContentBtn"
            >
                {open ? (
                    <MdKeyboardArrowDown fontSize={'1.5rem'} />
                ) : (
                    <MdKeyboardArrowRight fontSize={'1.5rem'} />
                )}
                <span>Thanh toán bằng card</span>
            </div>

            {open ? (
                <div className="bg-slate-600 w-[480px] h-[240px] rounded-lg  mt-4"></div>
            ) : null}
        </div>
    );
};
const OthersDepositBox = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="othersDepositBox">
            <div
                onClick={() => {
                    setOpen((old) => !old);
                }}
                className="toggleContentBtn"
            >
                {open ? (
                    <MdKeyboardArrowDown fontSize={'1.5rem'} />
                ) : (
                    <MdKeyboardArrowRight fontSize={'1.5rem'} />
                )}
                <span>Các hình thức thanh toán khác: Paypal, vv</span>
            </div>

            {open ? (
                <p className="text-lg">
                    Vui lòng liên hệ Fanpage để được hỗ trợ thanh toán thủ công.
                </p>
            ) : null}
        </div>
    );
};

export default DepositPage;
