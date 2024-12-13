import { useState } from 'react';
import {
    MdArrowDropDown,
    MdArrowForwardIos,
    MdArrowRight
} from 'react-icons/md';
import { UserEvents } from '../../../../src-tauri/api';
import { login } from '../../../backend/actions';
import {
    appDispatch,
    get_payment,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { externalLink } from '../../../backend/utils/constant';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/store.scss';

const listSubs = [
    {
        active: false,
        highlight: false,
        title: 'Gói tuần',
        price_in_vnd: '99',
        under_price: 'Giới hạn 25h sử dụng trong 7 ngày',
        name: 'week1',
        period: 'tuần',
        bonus: [
            'RTX 3060TI',
            '16GB ram',
            '150GB dung lượng riêng, Cloud-save',
            'Không giới hạn thời gian mỗi session',
            'Có hàng chờ'
        ]
    },
    {
        active: false,
        highlight: true,
        title: 'Gói tháng',
        price_in_vnd: '299',
        total_time: '120',
        under_price: 'Giới hạn 120h sử dụng trong tháng',
        name: 'month1',
        period: 'tháng',
        bonus: [
            'RTX 3060TI',
            '16GB ram',
            '150GB dung lượng riêng, Cloud-save',
            'Không giới hạn thời gian mỗi session',
            'Có hàng chờ'
        ],
        storage: ['50GB: 60k/tháng', '100GB: 110k/tháng']
    },
    {
        active: true,
        highlight: false,
        title: 'Gói cao cấp',
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

    return (
        <div
            className="paymentApp wnstore floatTab dpShad"
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
                            ></SubscriptionCard>
                        ))}
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};

const SubscriptionCard = ({ subInfo: sub }) => {
    const status = useAppSelector((state) => state.user.subscription.status);
    const domains = useAppSelector((state) => state.globals.domains);
    const not_logged_in = useAppSelector((state) => state.user.id == 'unknown');
    const max = useAppSelector(
        (state) =>
            state.globals.domains?.findIndex(
                (y) =>
                    y.free ==
                    Math.max(...state.globals.domains.map((x) => x.free))
            ) ?? -1
    );

    const [domain, setDomain] = useState(domains?.[max]?.domain ?? 'unknown');
    const onChooseSub = (plan_name) =>
        not_logged_in
            ? login('google', false)
            : status != 'PAID'
                ? appDispatch(
                    get_payment({
                        plan_name,
                        domain
                    })
                )
                : appDispatch(
                    get_payment({
                        plan_name
                    })
                );

    const [isShowDetail, setShowDetail] = useState(sub.highlight);
    const clickDetail = () => {
        setShowDetail((old) => !old);
        UserEvents({
            type: 'payment/detail',
            payload: isShowDetail
        });
    };

    return (
        <div className="sub ltShad relative">
            {sub.highlight ? (
                <div className="banner">
                    <p className="text-[16px] font-bold leading-4 text-center py-2 text-background">
                        Phổ biến
                    </p>
                </div>
            ) : null}

            <div className="flex flex-col flex-1 overflow-hidden border h-full rounded-[4px]">
                <div className="bg-surface-100 px-4 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <p className=" uppercase flex items-center gap-4 font-mono">
                                {sub.title}
                            </p>
                        </div>
                    </div>

                    <hr />
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
                    <hr />
                </div>
                <div className="border-default bg-surface-100 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col px-4 2xl:px-8 py-6 ">
                    <div
                        onClick={clickDetail}
                        className="flex cursor-pointer items-center text-foreground-light text-[13px] mt-2 mb-2 hover:underline"
                    >
                        {isShowDetail ? (
                            <MdArrowDropDown style={{ fontSize: '1.6rem' }} />
                        ) : (
                            <MdArrowRight style={{ fontSize: '1.6rem' }} />
                        )}
                        Chi tiết:
                    </div>

                    {isShowDetail &&
                        sub.bonus.map((x, i) => (
                            <ul
                                key={i}
                                role="list"
                                className="text-[13px] px-4 text-foreground-lighter"
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

                    <div className="flex flex-col gap-2 mt-auto prose">
                        <div className="space-y-2">
                            <p className="text-[13px] whitespace-pre-wrap"></p>
                        </div>
                        {sub.active && status == 'NO_ACTION' ? (
                            <>
                                <div className="flex flex-col">
                                    <span className="mt-2 w-full mx-auto shadow-sm">
                                        Chọn server:
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 mb-4">
                                    {domains?.map(({ domain, free }, index) =>
                                        free > 0 ? (
                                            <label
                                                key={index}
                                                className="text-blue-500 flex gap-2 items-center"
                                                htmlFor="server1"
                                            >
                                                <input
                                                    defaultChecked={
                                                        index == max
                                                    }
                                                    onChange={(e) =>
                                                        e.target.checked
                                                            ? setDomain(domain)
                                                            : null
                                                    }
                                                    data={domain}
                                                    type="radio"
                                                    name="server"
                                                    id="server1"
                                                />
                                                <span
                                                    name="play"
                                                    className="text-blue-500"
                                                >
                                                    {domain}
                                                </span>
                                                <div className="flex gap-2 items-center text-xs">
                                                    {free} chỗ trống
                                                    {index == max ? (
                                                        <GreenLight />
                                                    ) : null}
                                                </div>
                                            </label>
                                        ) : null
                                    )}
                                </div>

                                <div
                                    className="flex items-center gap-1 hover:underline cursor-pointer font-semibold"
                                    onClick={() => {
                                        appDispatch(
                                            popup_open({
                                                type: 'serversInfo'
                                            })
                                        );
                                    }}
                                >
                                    Hướng dẫn chọn server <MdArrowForwardIos />
                                </div>
                            </>
                        ) : null}
                        <button
                            onClick={() => {
                                if (status == 'NO_ACTION' && !sub.active) {
                                    if (sub.name == 'week1') return;
                                    return window.open(
                                        externalLink.MESSAGE_LINK,
                                        '_blank'
                                    );
                                }
                                onChooseSub(sub.name);
                            }}
                            type="button"
                            className={`border-none h-[48px] relative cursor-pointer 
                                                            space-x-2 text-center font-regular ease-out duration-200 rounded-[8px] 
                                                            outline-none transition-all outline-0 focus-visible:outline-4 
                                                            focus-visible:outline-offset-1 border bg-brand-button 
                                                            hover:bg-brand-button/80 
                                                            text-white border-brand 
                                                            focus-visible:outline-brand-600 
                                                            shadow-sm w-full flex items-center 
                                                            justify-center text-[1.125rem] 
                                                            leading-4 px-3 py-2
                                                            mt-6
                                                            ${!sub.active
                                    ? 'bg-red-500'
                                    : 'bg-[#0067c0]'
                                }  `}
                        >
                            {status == 'NO_ACTION' && !sub.active
                                ? sub.name == 'week1'
                                    ? 'Đang đóng'
                                    : 'Đặt trước'
                                : status != 'NO_ACTION'
                                    ? 'Gia hạn'
                                    : 'Mua Ngay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GreenLight = () => {
    return (
        <div className="relative h-4 w-4">
            {/* Outer glow effect */}
            <div className="absolute -inset-1 rounded-full bg-green-500/30 blur-sm animate-pulse"></div>
            {/* Inner bright dot */}
            <div className="relative h-4 w-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50">
                {/* Highlight effect */}
                {/*<div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-green-200/60"></div>*/}
            </div>
        </div>
    );
};
