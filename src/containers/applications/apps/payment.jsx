import { useState } from 'react';
import {
    appDispatch,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/store.scss';

import { FUNDING } from '@paypal/react-paypal-js';
import {
    createPaymentLink,
    wrapperAsyncFunction
} from '../../../backend/actions';

const mb = '970422';

const model = 'BsXBiU7'; //'sS1SemI'

const FUNDING_SOURCES = [FUNDING.PAYPAL, FUNDING.CARD, FUNDING.PAYU];
const initialOptions = {
    'client-id':
        'AUGjxD_5EwowYxfVHGQSqtBsy0G7F05x850-iRLbbZZFTAZxYXn2ois63R1hZyA0ufbDch1I4lv9XUAZ',
    'enable-funding': '',
    vault: true
};

export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );
    const user = useAppSelector((state) => state.user);
    const [listSubs, setListSubs] = useState([
        {
            highlight: false,
            title: 'Gói giờ',
            price_in_vnd: '8',
            //total_time: '110',
            //under_price: 'Lần đầu, bạn cần mua ít nhất 20h.',

            name: 'hour_02',
            period: 'h',
            bonus: [
                'Chơi sẵn các game trong store games',
                'Không lưu dữ liệu sau khi tắt máy',
            ],
            hoursChoose: 5
        },
        {
            highlight: true,
            title: 'Tiết kiệm',
            price_in_vnd: '299',
            total_time: '150',
            under_price: 'Giới hạn 150h sử dụng trong tháng',
            name: 'month_01',
            period: 'tháng',
            bonus: [
                'RTX 3060TI',
                '16GB ram',
                '150GB dung lượng riêng, Cloud-save',
                'Không giới hạn thời gian mỗi session',
                'Có hàng chờ'
            ],
            storage: ['50GB: 70k/tháng', '100GB: 120k/tháng']
        },
        {
            highlight: false,
            title: 'Unlimited',
            price_in_vnd: '1699',
            period: 'tháng',
            total_time: 'Không giới hạn',
            under_price: 'Không giới hạn giờ sử dụng',
            name: 'unlimited_01',
            bonus: [
                'Sở hữu PC riêng',
                'Không hàng chờ',
                'Cấu hình giống gói tháng',
                '250GB dung lượng riêng, cloud-save',
                'Không giới hạn thời gian mỗi session'
            ]
        }
    ]);

    const [subChoose, setSubChoose] = useState(null);

    const [hoursChoose, setHoursChoose] = useState(5);

    const handleChooseSub = async (sub) => {
        if (hoursChoose < 5 && sub.name == 'hour_02') {
            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        success: false,
                        content: 'Cần mua ít nhất 5h'
                    }
                })
            );
            return;
        }
        if (isRejectHourSub(sub.name, user?.stat.plan_name)) {
            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        success: false,
                        content:
                            'Gói hiện tại đang đóng.Quý khách vui lòng quay lại sau!'
                    }
                })
            );
            return;
        }
        setSubChoose({
            ...sub,
            hoursChoose
        });

        const inputs = {
            buyerEmail: user.email,
            items: [
                {
                    name: sub.name,
                    price: +sub.price_in_vnd * 1000,
                    quantity: sub.name == 'hour_02' ? +hoursChoose : 1
                }
            ]
        };
        wrapperAsyncFunction(
            async () => window.open(await createPaymentLink(inputs), '_self'),
            {
                title: 'Creating Payment',
                tips: false,
                timeProcessing: 0.5
            }
        );
    };


    return (
        <div
            className="paymentApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Payment"
            />
            <div className="windowScreen wrapperPayment">
                <LazyComponent show={!wnapp.hide}>
                    <div className=" md:!justify-evenly px-0 paymentContent win11Scroll">
                        {listSubs.map((sub, index) => (
                            <SubscriptionCard subInfo={sub} onChooseSub={handleChooseSub} setHoursChoose={setHoursChoose} hoursChoose={hoursChoose}></SubscriptionCard>
                        ))}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};


const isRejectHourSub = (subName, planName) => {
    let check = false;
    check =
        subName == 'hour_02' &&
        planName !== 'hour_02';

    return check;
    //let check = false;
    //check = !user?.stat?.plan_name || subName == 'hour_02';
    //return check;
};
const SubscriptionCard = ({ subInfo: sub, onChooseSub, setHoursChoose, hoursChoose }) => {
    const user = useAppSelector((state) => state.user);
    const planName = useAppSelector((state) => state.user?.stat?.plan_name);


    return (

        <div className="sub relative">
            {sub.highlight ? (
                <div className="absolute rounded-[36px] bg-amber-600 absolute inset-0 z-[-1] w-[102%]  top-[-37px] bottom-[-6px] left-[-1%]">
                    <p className="text-[16px] leading-4 text-center py-2 mt-[4px] text-background">
                        Gói phổ biến nhất
                    </p>
                </div>
            ) : null}

            <div className="flex flex-col overflow-hidden border h-full rounded-[4px]">
                <div className="bg-surface-100 px-4 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <p className=" uppercase flex items-center gap-4 font-mono">
                                {sub.title}
                            </p>
                        </div>
                    </div>

                    <hr className="border-[#504646]" />
                    <div className=" text-foreground flex items-center text-lg min-h-[116px]">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-end gap-2">
                                <div>
                                    <div className="flex items-end">
                                        {
                                            <>
                                                <h3 className="mt-2 gradient-text-500 text-3xl pb-1 uppercase font-mono text-brand-600">
                                                    {sub.price_in_vnd
                                                        ? `${sub.price_in_vnd}k VND`
                                                        : `\$${sub.price}`}
                                                </h3>
                                                <p className="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">
                                                    /{' '}
                                                    {
                                                        sub.period
                                                    }{' '}
                                                </p>
                                            </>
                                        }
                                    </div>
                                    <p className="-mt-2">
                                        <span className="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                                            {
                                                sub.under_price
                                            }
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-[#504646]" />
                </div>
                <div className="border-default bg-surface-100 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col px-8 xl:px-4 2xl:px-8 py-6 ">
                    <p className="text-foreground-light text-[13px] mt-2 mb-2">
                        Chi tiết:
                    </p>

                    {sub.bonus.map((x, i) => (
                        <ul
                            key={i}
                            role="list"
                            className="text-[13px] text-foreground-lighter"
                        >
                            <li className="flex items-center py-[8px] first:mt-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="sbui-icon text-brand h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span className="text-foreground mb-0 ml-3 text-[0.8rem] ">
                                    {x}
                                </span>
                            </li>
                        </ul>
                    ))}

                    {sub.storage ? (
                        <p className="text-foreground-light text-[13px] mt-8 mb-2">
                            Dung lượng mua thêm:
                        </p>
                    ) : null}

                    <ul
                        role="list"
                        className="list-decimal text-[13px] text-foreground-lighter"
                    >
                        {sub.storage?.map((x, i) => (
                            <li
                                key={i}
                                className="flex items-center py-[8px] first:mt-0"
                            >
                                <span className="text-foreground mb-0 ml-3 text-[0.8rem] ">
                                    {x}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-2 mt-auto prose">
                        {sub.name == 'hour_02' &&
                            !isRejectHourSub(sub.name, planName) ? (
                            <div className="flex gap-3 items-center ">
                                <b>Số giờ mua</b>
                                <input
                                    value={hoursChoose}
                                    onChange={(e) =>
                                        setHoursChoose(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="p-2 rounded-sm"
                                    type="number"
                                    min={5}
                                    name=""
                                    id=""
                                />
                            </div>
                        ) : null}
                        <div className="space-y-2">
                            <p className="text-[13px] whitespace-pre-wrap">
                                {/* Free projects are paused after 1 week of inactivity. */}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                onChooseSub(sub)
                            }
                            type="button"
                            className={`border-none h-[48px] relative cursor-pointer 
                                                            space-x-2 text-center font-regular ease-out duration-200 rounded-md 
                                                            outline-none transition-all outline-0 focus-visible:outline-4 
                                                            focus-visible:outline-offset-1 border bg-brand-button 
                                                            hover:bg-brand-button/80 
                                                            text-white border-brand 
                                                            focus-visible:outline-brand-600 
                                                            shadow-sm w-full flex items-center 
                                                            justify-center text-sm 
                                                            leading-4 px-3 py-2
                                                            ${isRejectHourSub(
                                sub.name, planName
                            )
                                    ? 'bg-red-500'
                                    : 'bg-[#328cff]'
                                }  `}
                        >
                            <span className="truncate font-medium text-xl">
                                {isRejectHourSub(
                                    sub.name, planName
                                )
                                    ? 'Đang đóng!'
                                    : 'Mua Ngay'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}