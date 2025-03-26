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
            <h2 className="title">Nạp tiền vào ví thinkmay</h2>
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
            <div className="mt-2 w-full">
                <button
                    onClick={() => appDispatch(show_chat())}
                    className="mr-3 rounded-md w-28 h-10 bg-gray-400 text-black text-l"
                >
                    Hỗ trợ
                </button>
                <button
                    onClick={handleDeposit}
                    className="rounded-md mt-3 w-28 h-10 bg-blue-600 text-white text-l font-bold"
                >
                    Chuyển khoản
                </button>
            </div>

            <div className="noticesBox">
                <p className="title">Ví thinkmay là gì?</p>
                <ul className="w-full">
                    <li>Bạn có thể sử dụng ví Thinkmay để thanh toán dịch vụ và nâng cấp cấu hình</li>
                    <li>Ví Thinkmay sẽ tự động trừ tiền khi bạn sử dụng hết số giờ và ngày chơi được quy định (xem trong mục <span className='font-bold text-l text-blue-400'>Đăng kí</span>)</li>
                    <li>Khi bạn sử dụng hết thời gian quy định của gói và ví không đủ tiền để tự động gia hạn, dữ liệu của bạn sẽ bị xóa sau <span className='font-bold text-l text-blue-400'>2 ngày</span></li>
                    <li>Như vậy tính năng này giúp bạn không bị gián đoạn khi gia hạn dịch vụ</li>
                    <li>Thinkmay hỗ trợ người dùng nạp tiền vào ví thông qua chuyển khoản ngân hàng</li>
                    <li>Bạn có thể cập nhật các chương trình khuyến mãi để được ưu đãi khi nạp vào ví</li>
                    <li>Tiền trong ví thinkmay không có giá trị quy đổi tương đương ra bất kì đồng tiền nào, cũng không phải là tiền mã hóa</li>
                    <li>Click vào <span className='font-bold text-l text-gray-400'>hỗ trợ</span> nếu bạn cần các hình thức thanh toán khác</li>
                </ul>
                <p className="title mt-3">Như vậy, nạp tiền vào ví thinkmay là một hình thức "nạp để gia hạn thuê bao", giống như tài khoản điện thoại</p>
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
