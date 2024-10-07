import { useState } from 'react';
import {
    appDispatch,
    get_payment,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import {
    Image,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';
import './assets/store.scss';

const listSubs = [
    {
        highlight: false,
        title: 'Gói giờ',
        price_in_vnd: '8',
        name: 'hour2',
        period: 'h',
        bonus: [
            'Chơi sẵn các game trong store games',
            'Không lưu dữ liệu sau khi tắt máy'
        ],
        hoursChoose: 5
    },
    {
        highlight: true,
        title: 'Tiết kiệm',
        price_in_vnd: '299',
        total_time: '150',
        under_price: 'Giới hạn 150h sử dụng trong tháng',
        name: 'month1',
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
        name: 'month2',
        bonus: [
            'Sở hữu PC riêng',
            'Không hàng chờ',
            'Cấu hình giống gói tháng',
            '250GB dung lượng riêng, cloud-save',
            'Không giới hạn thời gian mỗi session'
        ]
    }
];
export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );

    const handleChooseSub = async (plan, template) =>
        appDispatch(get_payment({ template, plan }));

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
                            <SubscriptionCard
                                key={index}
                                subInfo={sub}
                                onChooseSub={handleChooseSub}
                            ></SubscriptionCard>
                        ))}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const SubscriptionCard = ({ subInfo: sub, onChooseSub }) => {
    const gameChooseSubscription = useAppSelector(
        (state) => state.globals.gameChooseSubscription
    );
    const gameChoose = useAppSelector((state) =>
        state.globals.gamesInSubscription.find(
            (item) => item.volumeId == gameChooseSubscription?.volumeId
        )
    );
    const openChooseGames = (subName) =>
        appDispatch(
            popup_open({ type: 'gameChoose', data: { planName: subName } })
        );

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
                                                    / {sub.period}{' '}
                                                </p>
                                            </>
                                        }
                                    </div>
                                    <p className="-mt-2">
                                        <span className="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                                            {sub.under_price}
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
                    {sub.name.includes('month') ? (
                        <button
                            className="mt-4 w-80 mx-auto bg-red-500 btn btn-secondary"
                            onClick={() => openChooseGames(sub.name)}
                        >
                            Chọn game cài sẵn
                        </button>
                    ) : null}

                    {gameChoose?.volumeId &&
                    sub.name == gameChooseSubscription.planName ? (
                        <div
                            key={gameChoose.name}
                            className="flex flex-col py-4 w-[80px] mx-auto mt-5 h-[100px] rounded-lg bg-[#2d3146]"
                        >
                            <Image
                                w={40}
                                h={40}
                                ext
                                absolute
                                src={gameChoose.logo}
                            />
                            <div className="name mt-auto capitalize text-white  text-xs text-center font-semibold">
                                {gameChoose.name}
                            </div>
                        </div>
                    ) : null}
                    <div className="flex flex-col gap-2 mt-auto prose">
                        <div className="space-y-2">
                            <p className="text-[13px] whitespace-pre-wrap"></p>
                        </div>

                        <button
                            onClick={() =>
                                onChooseSub(sub.name, gameChoose.volumeId)
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
                                                            ${
                                                                sub.name.includes(
                                                                    'hour'
                                                                )
                                                                    ? 'bg-red-500'
                                                                    : 'bg-[#328cff]'
                                                            }  `}
                        >
                            <span className="truncate font-medium text-xl">
                                {sub.name.includes('hour')
                                    ? 'Đang đóng!'
                                    : 'Mua Ngay'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
