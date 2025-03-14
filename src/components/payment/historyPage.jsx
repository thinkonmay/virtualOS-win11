import dayjs from 'dayjs';
import { useState } from 'react';
import { useAppSelector } from '../../backend/reducers';
import { numberFormat } from '../../backend/utils/format';
const listHistoryNav = [
    {
        name: 'Tất cả',
        id: 'all'
    },
    {
        name: 'Nạp tiền',
        id: 'deposit'
    },
    {
        name: 'Thuê CloudPC',
        id: 'buy'
    },
    {
        name: 'Nâng cấp',
        id: 'upgrade'
    }
];

export const TransactionHistoryPage = () => {
    const historyDeposit = useAppSelector(
        (state) => state.user.wallet.historyDeposit
    );
    const historyPayment = useAppSelector(
        (state) => state.user.wallet.historyPayment
    );
    const [currentNav, setNav] = useState('all'); //all-deposit-upgrade-buy
    const [currentData, setCurrentData] = useState(
        [...historyPayment, ...historyDeposit].sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        )
    );

    const handleChangeNav = (nav) => {
        setNav(nav);

        switch (nav) {
            case 'all':
                setCurrentData([...historyPayment, ...historyDeposit]);
                break;
            case 'deposit':
                setCurrentData([...historyDeposit]);
                break;

            case 'buy':
                setCurrentData([...historyPayment]);
                break;
            case 'upgrade':
                setCurrentData([]);
                break;

            default:
                break;
        }
    };
    const renderNameDeteils = (name) => {
        let nameFormat = 'Nạp tiền';
        switch (name) {
            case 'month1':
                nameFormat = 'Mua gói tháng';
                break;

            case 'month2':
                nameFormat = 'Mua gói cao cấp';
                break;

            case 'week1':
                nameFormat = 'Mua gói 2 tuần';
                break;
            case 'week2':
                nameFormat = 'Mua gói 1 tuần';
                break;
            case 'ramcpu20':
                nameFormat = 'Nâng lên 20GB RAM & 10cores cpu';
                break;
            case '50GB':
                nameFormat = 'Nâng lên 50GB';
                break;
            case '100GB':
                nameFormat = 'Nâng lên 100GB';
                break;
            case '200GB':
                nameFormat = 'Nâng lên 200GB';
                break;

            default:
                break;
        }

        return nameFormat;
    };

    return (
        <div className="historyPage">
            <h2 className="title">Lịch sử giao dịch</h2>

            <ul className="historyNav">
                {listHistoryNav.map((nav) => (
                    <li
                        onClick={() => handleChangeNav(nav.id)}
                        className={`nav ${
                            currentNav == nav.id ? 'navActive' : ''
                        }`}
                    >
                        {nav.name}
                    </li>
                ))}
            </ul>

            <div className="wrapperTableHistory">
                <div className="rowContent" style={{ borderTop: 'unset' }}>
                    <div className="columnContent ">Số tiền</div>
                    <div className="columnContent">Chi tiết</div>
                    <div className="columnContent">Thời gian</div>
                </div>

                {currentData.length > 0 ? (
                    currentData.map((item) => (
                        <div className="rowContent" key={item.id}>
                            <div className="columnContent">
                                {numberFormat(+item.amount)} đ
                            </div>
                            <div className="columnContent">
                                {renderNameDeteils(item.plan_name)}
                            </div>
                            <div className="columnContent">
                                {dayjs(item.created_at).format(
                                    'HH:mm DD/MM/YYYY'
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rowContent">
                        <p></p>
                        <p className="my-auto font-bold">
                            Hiện chưa có dự liệu
                        </p>
                        <p></p>
                    </div>
                )}
            </div>
        </div>
    );
};
