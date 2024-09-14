import { useEffect, useState } from 'react';
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
import { UserEvents } from '../../../backend/reducers/fetch/analytics';
import { Contents } from '../../../backend/reducers/locales';
import { Image } from '../../../components/shared/general';

const mb = '970422';
const account_id = '1502200344444';
const account_owner = 'DO VAN DAT';
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
    const stat = useAppSelector((state) => state.user.stat);
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
            name: 'month_01',
            period: 'tháng',
            bonus: [
                'Sở hữu PC riêng, dữ liệu cá nhân',
                'Có lưu dữ liệu sau khi tắt máy',
                'RTX 3060TI',
                '16GB ram',
                '150GB dung lượng',
                'Không giới hạn thời gian mỗi session'
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
                'Không hàng chờ',
                'Cấu hình giống gói tháng',
                '250GB dung lượng',
                'Không giới hạn thời gian mỗi session'
            ]
        }
    ]);

    const [isAvailableHourSub, setAvailableHourSub] = useState(false);
    const [iframe, setIframe] = useState('');
    const [paypage, setPaypage] = useState(null);
    const [subChoose, setSubChoose] = useState(null);
    const payment = async (price_in_vnd) => {
        setPaypage(price_in_vnd);
    };

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
        if (isRejectHourSub(sub.name)) {
            if (sub.name != 'hour_02') {
                appDispatch(
                    popup_open({
                        type: 'complete',
                        data: {
                            success: false,
                            content:
                                'Gói hiện tại đang đóng do không đủ hạ tầng để phục vụ! Thời gian dự kiến: 11/11 - 25/11'
                        }
                    })
                );
                return;
            }

            appDispatch(
                popup_open({
                    type: 'complete',
                    data: {
                        success: false,
                        content:
                            'Gói giờ đang đóng do không đủ hạ tầng để phục vụ! Thời gian dự kiến: 11/11 - 7/12'
                    }
                })
            );
            return;
        }
        //payment(
        //    sub.price_in_vnd
        //);
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
            async () => {
                const link = await createPaymentLink(inputs);
                window.open(link, '_self');
                //setIframe(link)
                //setPaypage(1)
            },
            {
                title: 'Creating Payment',
                //text: 'Please wait a few seconds',
                tips: false,
                timeProcessing: 0.5
            }
        );
    };

    const isOldUser = () => {
        let check = false;
        check =
            user?.stat?.plan_name == 'hour_02' &&
            user?.stat?.plan_name == 'month_01' &&
            user?.stat?.plan_name == 'unlimited_01';
        return check;
    };

    const isRejectHourSub = (subName) => {
        //let check = false;
        //check =
        //    subName == 'hour_02' &&
        //    !isAvailableHourSub &&
        //    user?.stat?.plan_name !== 'hour_02';

        //return check;
        let check = false;
        check = !user?.stat?.plan_name || subName == 'hour_02';
        return check;
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
                    {paypage != null ? (
                        <Payment
                            price={paypage}
                            onClose={() => setPaypage(null)}
                            subInfo={subChoose}
                            iframe={iframe}
                        />
                    ) : (
                        <div className=" md:!justify-evenly px-0 paymentContent win11Scroll">
                            {listSubs.map((sub, index) => (
                                <div key={index} className="sub relative">
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
                                                !isRejectHourSub(sub.name) ? (
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
                                                        handleChooseSub(sub)
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
                                                                isRejectHourSub(
                                                                    sub.name
                                                                )
                                                                    ? 'bg-red-500'
                                                                    : 'bg-[#328cff]'
                                                            }  `}
                                                >
                                                    <span className="truncate font-medium text-xl">
                                                        {isRejectHourSub(
                                                            sub.name
                                                        )
                                                            ? 'Đang đóng!'
                                                            : 'Mua Ngay'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </LazyComponent>
            </div>
        </div>
    );
};

const Payment = ({ onClose, price, subInfo, iframe = '' }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const { id } = useAppSelector((state) => state.user);
    const { email } = useAppSelector((state) => state.user);

    const [pageNo, setPageNo] = useState(0);
    const nextPage = () => {
        setPageNo((old) => {
            const current = pages.at(old);
            return pages.length - 1 != old ? old + 1 : old;
        });
    };
    const prevPage = () => {
        if (pageNo == 0) {
            onClose();
            return;
        }
        setPageNo((old) => {
            const n = old != 0 ? old - 1 : old;
            const current = pages.at(n);
            return n;
        });
    };

    const finishSurvey = async () => {
        UserEvents({ type: `finish_payment` });
        onClose();
    };

    const [qrurl, setQR] = useState(null);
    useEffect(() => {
        const url = new URL(
            `https://img.vietqr.io/image/${mb}-${account_id}-${model}.png`
        );
        let amount = price * 1000;
        url.searchParams.append('accountName', account_owner);
        url.searchParams.append(
            'addInfo',
            `
                PAY ${email.replace('@gmail.com', '')}
            `
        );

        if (subInfo.name == 'hour_02') {
            amount = price * subInfo.hoursChoose * 1000;
        }
        url.searchParams.append('amount', amount);

        setQR(url.toString());

        const handle = (e) =>
            e.key == 'Enter'
                ? nextPage()
                : e.key == 'ArrowLeft'
                  ? prevPage()
                  : e.key == 'ArrowRight'
                    ? nextPage()
                    : null;
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('keydown', handle);
        };
    }, []);

    const Finish = () => (
        <>
            <div className="yes_button base" onClick={finishSurvey}>
                Continue
            </div>
        </>
    );

    const Navigate = () => (
        <>
            <div className="no_button base" onClick={prevPage}>
                Back
            </div>
            <div className="yes_button base" onClick={nextPage}>
                Next
            </div>
        </>
    );

    const QR = () => (
        <div className="left">
            {/*<Image absolute src="qr_code.png" />*/}
            <Image ext absolute src={qrurl} />
        </div>
    );
    const Logo = () => (
        <div className="left">
            <div className="logoPayment" id="left_img" />
        </div>
    );

    const pages = [
        {
            survey: false,
            content: (
                <>
                    <QR />
                    <div className="right">
                        <div className="header mb-10">
                            {t[Contents.PAYMENT_FOLLOW_UP_TITLE1]}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                Tên Ngân Hàng: <b>MB Bank</b>
                            </div>
                            <div>
                                Tên Chủ Tk: <b>DO VAN DAT</b>
                            </div>

                            <div>
                                Số TK: <b>1502200344444</b>
                            </div>
                            <div>
                                Số tiền:{' '}
                                <b>
                                    {subInfo.name == 'hour_02'
                                        ? price * subInfo.hoursChoose * 1000
                                        : price * 1000}{' '}
                                    VNĐ
                                </b>
                            </div>
                            <div>
                                Nội dung:{' '}
                                <b>PAY {email.replace('@gmail.com', '')}</b>{' '}
                            </div>
                        </div>

                        <p className="mt-4">
                            <b className="text-lg">LƯU Ý</b>: Vui lòng liên hệ
                            fanpage nếu quá 15' chưa được kích hoạt.
                        </p>
                    </div>
                    <Navigate />
                </>
            )
        }
    ];

    //pages.unshift({
    //    survey: false,
    //    content: (
    //        <>
    //            <Logo />
    //            <div className="right">
    //                <div className="header mb-8">
    //                    {t[Contents.PAYMENT_FOLLOW_UP_TITLE]}
    //                </div>
    //                <div>
    //                    {t[Contents.PAYMENT_FOLLOW_UP_CONTENT]}
    //                    <br />
    //                </div>
    //            </div>
    //            <Navigate />
    //        </>
    //    )
    //});

    pages.push({
        survey: false,
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">
                        {t[Contents.PAYMENT_FOLLOW_UP_DONE]}
                    </div>
                    <Finish />
                </div>
            </>
        )
    });

    return (
        <div className="getstarted floatTab dpShad">
            <div className="windowScreen flex flex-col" data-dock="true">
                <div className="restWindow flex-grow flex flex-col p-[24px]">
                    <div className="w-full h-full">
                        {/*<div className="inner_fill_setup">*/}
                        {/*{pages.at(pageNo)?.content}*/}
                        <iframe
                            title="QR webstie"
                            className="w-full h-full"
                            src={iframe}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};
