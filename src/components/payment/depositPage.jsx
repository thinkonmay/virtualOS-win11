import { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { create_payment_qr } from '../../backend/actions';
import { appDispatch, show_chat } from '../../backend/reducers';

const DepositPage = ({ value }) => {
    const [depositNumber, setDepositNumber] = useState(value ?? '100,000');
    const [isErr, setErr] = useState('');

    const handleDeposit = () => {
        if (isErr) return;
        create_payment_qr({
            amount: removeCommasAndCurrency(depositNumber)
        });
    };

    const isNumber = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0);
    const removeCommasAndCurrency = (str) =>
        isNumber(str) ? str : str.match(/[\d,]+/)[0].replace(/,/g, '');
    const handleChangeDepositNumber = (e) => {
        if (!e.target.value) return;
        else if (removeCommasAndCurrency(e.target.value) < 99000)
            setErr('Số tiền nạp phải >= 99k');
        else if (removeCommasAndCurrency(e.target.value) > 10000000)
            setErr('Wow, bạn giàu quá! Vui lòng nhập số tiền thực tế hơn');
        else {
            setDepositNumber(e.target.value);
            setErr(undefined);
        }
    };

    return (
        <div className="depositPage">
            <h2 className="title">Chuyển khoản ngân hàng</h2>
            <div className="depositBox">
                <p className="subtitle">Số tiền muốn nạp</p>
                <div className="wrapperDeposit ">
                    <NumericFormat
                        className="depositInput"
                        placeholder="Nhập số tiền (đ)"
                        onChange={handleChangeDepositNumber}
                        value={depositNumber}
                        suffix={' VNĐ'}
                        thousandSeparator=","
                    />
                </div>
            </div>
            {isErr ? (
                <p className="text-red-500 text-base mt-2 font-bold">{isErr}</p>
            ) : null}
            <div className="mt-5 w-full">
                <button
                    onClick={() => appDispatch(show_chat())}
                    className="mr-3 rounded-md w-28 h-10 bg-gray-400 text-black text-l"
                >
                    Báo lỗi
                </button>
                <button
                    onClick={handleDeposit}
                    className="rounded-md w-28 h-10 bg-blue-600 text-white text-l font-bold"
                >
                    Nạp tiền
                </button>
            </div>

            <div className="noticesBox">
                <p className="title">Lưu ý:</p>
                <ul className="">
                    <li>Số tiền nạp tối thiểu là 99,000 đ</li>
                    <li>Tiền đã nạp không thể rút ra thành tiền mặt</li>
                </ul>
            </div>
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
                <span>Các hình thức thanh toán khác: Thẻ cào, Paypal</span>
            </div>

            {open ? (
                <p className="text-lg mt-3 ml-2">
                    Vui lòng liên hệ Fanpage để được hỗ trợ thanh toán thủ công.
                </p>
            ) : null}
        </div>
    );
};

export default DepositPage;
