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
import './assets/payment.scss';
import './assets/store.scss';

const listSubs = [
    {
        active: false,
        highlight: false,
        title: 'Gói tuần',
        price_in_vnd: 99000,
        total_time: 25,
        total_days: 7,
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
        price_in_vnd: 299000,
        total_time: 120,
        total_days: 30,
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
        price_in_vnd: 1699000,
        total_time: 9999,
        total_days: 30,
        name: 'month2',
        period: 'tháng',
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
    const [page, setPage] = useState('sub'); //sub - refund - storage

    const handleChangePage = (input) => {
        setPage(input);
    };
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
                    <div className="navPayment">
                        <div
                            className={
                                page == 'storage' ? 'item subActive' : 'item'
                            }
                            onClick={() => handleChangePage('storage')}
                        >
                            Giá dung lượng
                        </div>
                        <div
                            className={
                                page == 'sub' ? 'item subActive' : 'item'
                            }
                            onClick={() => handleChangePage('sub')}
                        >
                            Bảng giá
                        </div>
                        <div
                            className={
                                page == 'refund' ? 'item subActive' : 'item'
                            }
                            onClick={() => handleChangePage('refund')}
                        >
                            Hoàn tiền
                        </div>
                    </div>
                    <div className=" md:!justify-evenly px-0 paymentContent win11Scroll">
                        {page == 'sub' ? (
                            <SubscriptionPage />
                        ) : page == 'refund' ? (
                            <RefundPage />
                        ) : (
                            <StoragePage />
                        )}
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
                                                    {sub.price_in_vnd / 1000}k
                                                    VND
                                                </h3>
                                                <p className="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">
                                                    / {sub.period}{' '}
                                                </p>
                                            </>
                                        }
                                    </div>
                                    <p className="-mt-2">
                                        <span className="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                                            Giới hạn {sub.total_time}h sử dụng
                                            trong {sub.total_days} ngày
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
                                                            ${
                                                                !sub.active
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

const SubscriptionPage = () => {
    const plans = useAppSelector((state) => state.user.plans);

    listSubs.forEach((e) => {
        const plan = plans.find((x) => x.name == e.name);
        if (plan == null || undefined) return;
        e.active = plan.allow_payment;
        e.price_in_vnd = plan.amount;
        e.total_time = plan.limit_hour;
        e.total_days = plan.total_days;
    });
    return (
        <>
            {listSubs.map((sub, index) => (
                <SubscriptionCard key={index} subInfo={sub}></SubscriptionCard>
            ))}
        </>
    );
};

const RefundPage = () => {
    return (
        <div className="refundPage">
            <div className="title">
                <h2 className="title">Chính sách hoàn 80% tiền</h2>
                <p className="md:max-w-[80% md:text-xs lg:max-w-[60%] lg:text-base">
                    Do tính chất đặc thù của dịch vụ CloudPC là có độ trễ về
                    đường truyền và mong muốn mọi người có trải nghiệm tốt nhất
                    khi sử dụng, Thinkmay khuyến khích bạn liên hệ qua Fanpage
                    để được hỗ trợ xử lý hoặc hoàn tiền nếu sau khi sử dụng, bạn
                    cảm thấy không hài lòng vì bất kỳ lý do nào.
                </p>
            </div>

            <div className="pl-2 lg:pl-20">
                <h3>Điều kiện áp dụng</h3>

                <div className="flex gap-16 mb-5">
                    <div>
                        <h4>Với gói tháng:</h4>
                        <ul>
                            <li>Thời gian: 5 ngày kể từ khi được cấp máy.</li>
                            <li>Số giờ sử dụng: không quá 12h.</li>
                        </ul>
                    </div>

                    <div>
                        <h4>Với gói tuần:</h4>
                        <ul>
                            <li>Thời gian: 2 ngày kể từ khi được cấp máy.</li>
                            <li>Số giờ sử dụng: không quá 3h.</li>
                        </ul>
                    </div>
                </div>

                <h3 className="mt-8">Quy trình yêu cầu hoàn tiền:</h3>
                <ul className="list-decimal">
                    <li> Liên hệ qua Fanpage chính thức của Thinkmay.</li>
                    <li>
                        {' '}
                        Cung cấp thông tin tài khoản, lý do yêu cầu hoàn tiền
                    </li>
                    <li> Yêu cầu sẽ được xử lý trong vòng 1 ngày làm việc.</li>
                </ul>

                <h3 className="mt-8">Lưu ý:</h3>
                <ul className="list-decimal">
                    <li>
                        Chính sách không áp dụng cho các trường hợp vi phạm điều
                        khoản sử dụng dịch vụ hoặc cố ý gây lỗi.
                    </li>
                    <li>
                        Hãy trải nghiệm dịch vụ miễn phí trước khi đưa ra quyết
                        định mua!
                    </li>
                </ul>
            </div>
        </div>
    );
};

const StoragePage = () => {
    return (
        <div className="storagePage h-full pt-[5%] overflow-x-auto">
            <h2 className="text-center mb-8 ">Bảng giá dung lượng</h2>
            <div className="wrapperTableStorage">
                <div className="rowContent" style={{ borderTop: 'unset' }}>
                    <div className="columnContent">Dung lượng</div>
                    <div className="columnContent">Mua lần đầu</div>
                    <div className="columnContent">Gia hạn</div>
                </div>

                <div className="rowContent">
                    <div className="columnContent">50GB</div>
                    <div className="columnContent">60k/tháng</div>
                    <div className="columnContent">40k/tháng</div>
                </div>
                <div className="rowContent">
                    <div className="columnContent">100GB</div>
                    <div className="columnContent">110k/tháng</div>
                    <div className="columnContent">80k/tháng</div>
                </div>
                <div className="rowContent">
                    <div className="columnContent">200GB</div>
                    <div className="columnContent">190k/tháng</div>
                    <div className="columnContent">150k/tháng</div>
                </div>
            </div>
        </div>
    );
};
