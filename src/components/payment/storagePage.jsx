import dayjs from 'dayjs';
import { createPaymentPocket } from '../../backend/actions';
import { useAppSelector } from '../../backend/reducers';
import { externalLink } from '../../backend/utils/constant';

export const StoragePage = () => {
    const { ended_at } = useAppSelector(
        (state) => state.user.subscription ?? {}
    );

    const calculateMoney = (planBasePrice) => planBasePrice;
    // {
    //     const planBasePricePerDay = planBasePrice / 30;
    //     //calculate by the end_at of subscription
    //     // Calculate the difference in days
    //     if (ended_at) {
    //         const startDate = dayjs();
    //         const endDate = dayjs(ended_at);
    //         const daysLeft = endDate.diff(startDate, 'day');

    //         result = Math.floor(planBasePricePerDay * daysLeft);
    //     }

    //     return result;
    // };

    const renderMoney = (money) => `${Math.floor(money / 1000)}k`;
    const handleBuyUpgrage = (plan_name, price, title) =>
        window.open(externalLink.MESSAGE_LINK, '_blank');
    // {
    //     let actuallyTitle = title ?? plan_name;
    //     createPaymentPocket({
    //         plan_name,
    //         plan_price: price,
    //         plan_title: actuallyTitle
    //     });
    // };
    return (
        <div className="storagePage pt-[1%] ">
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-center mb-4 lg:mb-8 ">
                    Bảng giá dung lượng
                </h2>
                <div className="wrapperTableStorage">
                    <div className="rowContent" style={{ borderTop: 'unset' }}>
                        <div className="columnContent">Dung lượng</div>
                        <div className="columnContent ">
                            <p className="">Đăng ký ngay</p>
                            <p className="subtitle">
                                {ended_at ? (
                                    <>
                                        tới{' '}
                                        {dayjs(ended_at).format('DD/MM/YYYY')}
                                    </>
                                ) : (
                                    '30 ngày'
                                )}
                            </p>
                        </div>
                        <div className="columnContent">
                            <p className="">Gia hạn</p>
                            <p className="subtitle">hằng tháng</p>
                        </div>
                        <div className="columnContent"></div>
                    </div>

                    <div className="rowContent">
                        <div className="columnContent">50GB</div>
                        <div className="columnContent">
                            {renderMoney(calculateMoney(60000))}
                        </div>
                        <div className="columnContent">40k</div>
                        <div className="columnContent">
                            <button
                                onClick={() => {
                                    handleBuyUpgrage(
                                        '50GB',
                                        calculateMoney(60000)
                                    );
                                }}
                                className="instbtn buyBtn"
                            >
                                Nâng cấp
                            </button>
                        </div>
                    </div>
                    <div className="rowContent">
                        <div className="columnContent">100GB</div>
                        <div className="columnContent">
                            {renderMoney(calculateMoney(110000))}
                        </div>
                        <div className="columnContent">80k</div>
                        <div className="columnContent">
                            <button
                                onClick={() => {
                                    handleBuyUpgrage(
                                        '100GB',
                                        calculateMoney(110000)
                                    );
                                }}
                                className="instbtn buyBtn"
                            >
                                Nâng cấp
                            </button>
                        </div>
                    </div>
                    <div className="rowContent">
                        <div className="columnContent">200GB</div>
                        <div className="columnContent">
                            {renderMoney(calculateMoney(190000))}
                        </div>
                        <div className="columnContent">150k</div>
                        <div className="columnContent">
                            <button
                                onClick={() => {
                                    handleBuyUpgrage(
                                        '200GB',
                                        calculateMoney(190000)
                                    );
                                }}
                                className="instbtn buyBtn"
                            >
                                Nâng cấp
                            </button>
                        </div>
                    </div>
                </div>

                <h2 className="text-center mb-4 lg:mb-8 mt-10 ">
                    Bảng giá RAM & CPU
                </h2>
                <div className="wrapperTableStorage">
                    <div className="rowContent" style={{ borderTop: 'unset' }}>
                        <div className="columnContent">Ram & cpu</div>
                        <div className="columnContent ">
                            <p className="">Đăng ký ngay</p>
                            <p className="subtitle">
                                {ended_at ? (
                                    <>
                                        tới{' '}
                                        {dayjs(ended_at).format('DD/MM/YYYY')}
                                    </>
                                ) : (
                                    '30 ngày'
                                )}
                            </p>
                        </div>
                        <div className="columnContent">
                            <p className="">Gia hạn</p>
                            <p className="subtitle">hẵng tháng</p>
                        </div>
                        <div className="columnContent"></div>
                    </div>
                    <div className="rowContent">
                        <div className="columnContent">{'20GB & 10cores'}</div>
                        <div className="columnContent">
                            {renderMoney(calculateMoney(60000))}
                        </div>
                        <div className="columnContent">40k</div>
                        <div className="columnContent">
                            <button
                                onClick={() => {
                                    handleBuyUpgrage(
                                        'ramcpu20',
                                        calculateMoney(60000),
                                        '20GB & 10cores'
                                    );
                                }}
                                className="instbtn buyBtn"
                            >
                                Nâng cấp
                            </button>
                        </div>
                    </div>
                    <div className="rowContent">
                        <div className="columnContent">{'Khác'}</div>
                        <div className="columnContent">Liên hệ</div>
                        <div className="columnContent">Liên hệ</div>
                        <div className="columnContent">
                            <button
                                onClick={() => {
                                    window.open(
                                        externalLink.MESSAGE_LINK,
                                        '_blank'
                                    );
                                }}
                                className="instbtn buyBtn"
                            >
                                Liên hệ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
