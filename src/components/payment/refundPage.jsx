import {
    appDispatch,
    refund_request,
    show_chat,
    useAppSelector
} from '../../backend/reducers';

export const RefundPage = () => {
    const subscription = useAppSelector((state) => state.user.subscription);
    const out_of_day =
        Date.now() - new Date(subscription?.ended_at).getTime() >
        5 * 24 * 3600 * 1000;
    const out_of_time = subscription?.total_usage > 2;
    const another_pending_req = useAppSelector(
        (state) => state.user.wallet.refundRequest?.[0]
    );

    const refund = async () => {
        await appDispatch(refund_request());
    };

    const applicable =
        subscription != undefined &&
        !out_of_day &&
        !out_of_time &&
        another_pending_req == undefined;

    return (
        // <RefundPolicy/>
        // <RequestRefund />
        <RefundStatus/>
    );
};

const RequestRefund = () => {
    return (
        <section class="py-24">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="grid lg:grid-cols-2 grid-cols-1">
                    <div class="lg:mb-0 mb-10">
                        <div class="group w-full h-full">
                            <div class="relative h-full">
                                <img
                                    src="logo.png"
                                    alt="ContactUs tailwind section"
                                    class="w-full h-full lg:rounded-l-2xl rounded-2xl bg-blend-multiply bg-blue-700 object-cover"
                                />
                                <h1 class="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11">
                                    Contact us
                                </h1>
                                <div class="absolute bottom-0 w-full lg:p-11 p-5">
                                    <div class="bg-white rounded-lg p-6     ">
                                        <a
                                            // href="javascript:;"
                                            class="flex items-center mb-10"
                                        >
                                            <svg
                                                width="30"
                                                height="30"
                                                viewBox="0 0 30 30"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M25 12.9169C25 17.716 21.1939 21.5832 18.2779 24.9828C16.8385 26.6609 16.1188 27.5 15 27.5C13.8812 27.5 13.1615 26.6609 11.7221 24.9828C8.80612 21.5832 5 17.716 5 12.9169C5 10.1542 6.05357 7.5046 7.92893 5.55105C9.8043 3.59749 12.3478 2.5 15 2.5C17.6522 2.5 20.1957 3.59749 22.0711 5.55105C23.9464 7.5046 25 10.1542 25 12.9169Z"
                                                    stroke="#4F46E5"
                                                    stroke-width="2"
                                                />
                                                <path
                                                    d="M17.5 11.6148C17.5 13.0531 16.3807 14.219 15 14.219C13.6193 14.219 12.5 13.0531 12.5 11.6148C12.5 10.1765 13.6193 9.01058 15 9.01058C16.3807 9.01058 17.5 10.1765 17.5 11.6148Z"
                                                    stroke="#4F46E5"
                                                    stroke-width="2"
                                                />
                                            </svg>
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                Your account met our refund
                                                policy
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                        <a
                                            href="javascript:;"
                                            class="flex items-center"
                                        >
                                            <h5 class="text-black text-base font-normal leading-6 ml-5">
                                                654 Sycamore Avenue,
                                                Meadowville, WA 76543
                                            </h5>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-900 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
                        <h2 class="text-blue-600 font-manrope text-4xl font-semibold leading-10 mb-11">
                            Send Us A Message
                        </h2>
                        <input
                            type="text"
                            class="w-full h-12 text-white placeholder-gray-400  shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full  border-gray-200 focus:outline-none pl-4 mb-10"
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            class="w-full h-48 text-white placeholder-gray-400 bg-transparent text-lg shadow-sm font-normal leading-7 rounded-full border-spacing-20 border-gray-900 focus:outline-none pl-4 mb-10"
                            placeholder="Message"
                        />
                        <button class="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 hover:bg-blue-800 bg-blue-600 shadow-sm">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const RefundStatus = () => {
    return (
        <section class="py-24 relative text-white">
            <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div class="w-full flex-col justify-start items-start lg:gap-14 gap-10 inline-flex">
                    <h2 class="w-full text-white-900 text-3xl font-bold font-manrope leading-normal">
                        Refund Status
                    </h2>
                    <div class="w-full flex-col justify-start items-start gap-9 flex">
                        <div class="w-full p-5 rounded-xl border border-gray-200 sm:justify-start justify-center items-center gap-5 flex sm:flex-row flex-col">
                            <div class="w-full flex-col justify-center sm:items-start items-center gap-5 inline-flex sm:pr-5 sm:pb-0 pb-5 sm:border-r sm:border-b-0 border-b border-gray-200">
                                <h6 class="text-white-900 text-base font-semibold leading-relaxed">
                                    Oder Date:
                                    <span class="text-gray-500 font-medium">
                                        May 26, 2024
                                    </span>
                                </h6>
                                <h6 class="text-white-900 text-base font-semibold leading-relaxed">
                                    Refund Method:
                                    <span class="text-gray-500 font-medium">
                                        Bank Transfer
                                    </span>
                                </h6>
                            </div>
                            <div class="w-full flex-col justify-center sm:items-start items-center gap-5 inline-flex">
                                <h6 class="text-white-900 text-base font-semibold leading-relaxed">
                                    Refund Request:
                                    <span class="text-gray-500 text-base font-medium leading-relaxed">
                                        {' '}
                                        June 10, 2024
                                    </span>
                                </h6>
                                <h6 class="text-white-900 text-base font-semibold leading-relaxed">
                                    Refund Amount:
                                    <span class="text-gray-500 text-base font-medium leading-relaxed">
                                        $2500
                                    </span>
                                </h6>
                            </div>
                        </div>
                        <div class="w-full justify-start items-start gap-2.5 inline-flex">
                            <ol class="w-full overflow-hidden flex flex-col gap-1.5">
                                <li class="w-full relative h-48 after:content-[''] after:w-0.5 after:h-40 after:bg-blue-600 after:inline-block after:mt-2 after:-bottom-0 after:absolute after:left-2.5">
                                    <a
                                        href="https://pagedone.io/"
                                        class="w-6 h-6 relative flex items-center justify-center font-medium gap-2.5"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                        >
                                            <path
                                                d="M8.92958 11.9106C8.92958 11.9106 8.93233 11.9093 8.93699 11.9086C8.93177 11.9106 8.92958 11.9106 8.92958 11.9106Z"
                                                fill="#4F46E5"
                                            />
                                            <path
                                                d="M8.95662 11.9086C8.96128 11.9093 8.96403 11.9106 8.96403 11.9106C8.96403 11.9106 8.96184 11.9106 8.95662 11.9086Z"
                                                fill="#4F46E5"
                                            />
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M8.94001 0.199707H11.0597C12.8945 0.19969 14.353 0.199676 15.4955 0.353289C16.6735 0.511662 17.6348 0.846394 18.394 1.6056C19.1532 2.3648 19.4879 3.32606 19.6463 4.50402C19.7999 5.64658 19.7999 7.10502 19.7999 8.93985V11.0596C19.7999 12.8944 19.7999 14.3528 19.6463 15.4954C19.4879 16.6734 19.1532 17.6346 18.394 18.3938C17.6348 19.153 16.6735 19.4878 15.4955 19.6461C14.353 19.7997 12.8945 19.7997 11.0597 19.7997H8.93999C7.10516 19.7997 5.64672 19.7997 4.50417 19.6461C3.3262 19.4878 2.36494 19.153 1.60574 18.3938C0.846539 17.6346 0.511807 16.6734 0.353434 15.4954C0.199821 14.3528 0.199835 12.8944 0.199852 11.0596V8.93986C0.199835 7.10503 0.199821 5.64658 0.353434 4.50402C0.511807 3.32606 0.846539 2.3648 1.60574 1.6056C2.36494 0.846394 3.3262 0.511662 4.50417 0.353289C5.64672 0.199676 7.10518 0.19969 8.94001 0.199707ZM15.236 7.96437C15.5484 7.65195 15.5484 7.14542 15.236 6.833C14.9236 6.52058 14.4171 6.52058 14.1046 6.833L9.79534 11.1423C9.44601 11.4916 9.23972 11.6955 9.07398 11.822C9.00748 11.8727 8.96734 11.8952 8.94681 11.9045C8.92628 11.8952 8.88613 11.8727 8.81964 11.822C8.65389 11.6955 8.44761 11.4916 8.09828 11.1423L6.56559 9.60962C6.25317 9.2972 5.74664 9.2972 5.43422 9.60962C5.1218 9.92204 5.1218 10.4286 5.43422 10.741L7.00002 12.3068C7.3047 12.6116 7.58742 12.8944 7.84911 13.094C8.13871 13.315 8.49446 13.508 8.94681 13.508C9.39916 13.508 9.7549 13.315 10.0445 13.094C10.3062 12.8944 10.5889 12.6116 10.8936 12.3068L15.236 7.96437Z"
                                                fill="#4F46E5"
                                            />
                                        </svg>
                                    </a>
                                    <div class="w-full block flex flex-col gap-2.5 pl-3 absolute top-0 left-6">
                                        <h4 class="text-lg text-white-900 font-semibold leading-relaxed">
                                            Your request has been successfully
                                            received.
                                        </h4>
                                        <ul>
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                Your request has been
                                                successfully received. Our team
                                                is now reviewing the details
                                                kindly place the product and
                                                accessories back in the original
                                                packaging. The courier will
                                                reach out to you to arrange the
                                                pickup from the provided
                                                address.
                                            </h6>
                                        </ul>
                                    </div>
                                </li>
                                <li class="w-full relative h-48 after:content-[''] after:w-0.5 after:h-40 after:bg-blue-200 after:inline-block after:mt-2 after:-bottom-0 after:absolute after:left-2.5">
                                    <a
                                        href="https://pagedone.io/"
                                        class="w-6 h-6 relative flex items-center justify-center font-medium gap-2.5"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M16.6704 9.39887L12.3611 13.7082C11.6945 14.3749 11.3611 14.7082 10.9469 14.7082C10.5327 14.7082 10.1994 14.3749 9.53269 13.7082L8 12.1755M11 21H13C16.7712 21 18.6569 21 19.8284 19.8284C21 18.6569 21 16.7712 21 13V11C21 7.22876 21 5.34315 19.8284 4.17157C18.6569 3 16.7712 3 13 3H11C7.22876 3 5.34315 3 4.17157 4.17157C3 5.34315 3 7.22876 3 11V13C3 16.7712 3 18.6569 4.17157 19.8284C5.34315 21 7.22876 21 11 21Z"
                                                stroke="#C7D2FE"
                                                stroke-width="1.6"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                    </a>
                                    <div class="w-full block flex flex-col gap-2.5 pl-3 absolute top-0 left-6">
                                        <h4 class="text-lg text-white-900 font-semibold leading-relaxed">
                                            Collect Product from Your Location
                                        </h4>
                                        <ul>
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                We will arrange for our courier
                                                to collect the product from your
                                                location. Please ensure it is
                                                properly packaged and ready for
                                                pickup. Estimate Date June 16,
                                                2024 at 2:00 PM to 5:00 PM
                                            </h6>
                                        </ul>
                                    </div>
                                </li>
                                <li class="w-full relative h-48 after:content-[''] after:w-0.5 after:h-40 after:bg-blue-200 after:inline-block after:mt-2 after:-bottom-0 after:absolute after:left-2.5">
                                    <a
                                        href="https://pagedone.io/"
                                        class="w-6 h-6 relative flex items-center justify-center font-medium gap-2.5"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M16.6704 9.39887L12.3611 13.7082C11.6945 14.3749 11.3611 14.7082 10.9469 14.7082C10.5327 14.7082 10.1994 14.3749 9.53269 13.7082L8 12.1755M11 21H13C16.7712 21 18.6569 21 19.8284 19.8284C21 18.6569 21 16.7712 21 13V11C21 7.22876 21 5.34315 19.8284 4.17157C18.6569 3 16.7712 3 13 3H11C7.22876 3 5.34315 3 4.17157 4.17157C3 5.34315 3 7.22876 3 11V13C3 16.7712 3 18.6569 4.17157 19.8284C5.34315 21 7.22876 21 11 21Z"
                                                stroke="#C7D2FE"
                                                stroke-width="1.6"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                    </a>
                                    <div class="w-full block flex flex-col gap-2.5 pl-3 absolute top-0 left-6">
                                        <h4 class="text-lg text-white-900 font-semibold leading-relaxed">
                                            Product Verification
                                        </h4>
                                        <ul>
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                Our team will conduct a thorough
                                                product verification to ensure
                                                it meets all quality standards.
                                                You will be notified once the
                                                process is complete.
                                            </h6>
                                        </ul>
                                    </div>
                                </li>
                                <li class="w-full relative h-24">
                                    <a
                                        href="https://pagedone.io/"
                                        class="w-6 h-6 relative flex items-center justify-center font-medium gap-2.5"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M16.6704 9.39887L12.3611 13.7082C11.6945 14.3749 11.3611 14.7082 10.9469 14.7082C10.5327 14.7082 10.1994 14.3749 9.53269 13.7082L8 12.1755M11 21H13C16.7712 21 18.6569 21 19.8284 19.8284C21 18.6569 21 16.7712 21 13V11C21 7.22876 21 5.34315 19.8284 4.17157C18.6569 3 16.7712 3 13 3H11C7.22876 3 5.34315 3 4.17157 4.17157C3 5.34315 3 7.22876 3 11V13C3 16.7712 3 18.6569 4.17157 19.8284C5.34315 21 7.22876 21 11 21Z"
                                                stroke="#C7D2FE"
                                                stroke-width="1.6"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                    </a>
                                    <div class="w-full block flex flex-col gap-2.5 pl-3 absolute top-0 left-6">
                                        <h4 class="text-lg text-white-900 font-semibold leading-relaxed">
                                            Credit the Amount Back
                                        </h4>
                                        <ul>
                                            <h6 class="text-gray-500 text-base font-normal leading-relaxed">
                                                We will credit the amount back
                                                to your account, depending on
                                                the chosen option, within 5-7
                                                business days after the process
                                                is complete. You will receive a
                                                confirmation once the
                                                transaction has been finalized.
                                            </h6>
                                        </ul>
                                    </div>
                                </li>
                            </ol>
                        </div>
                        <div class="w-full sm:p-5 p-3.5 rounded-xl border border-gray-200 justify-start items-center sm:gap-5 gap-3.5 inline-flex">
                            <img
                                class="rounded-lg object-cover"
                                src="logo_white.png"
                                width='50rem'
                                alt="APPLE iPhone 15 Black image"
                            />
                            <div class="w-full flex-col justify-center items-start gap-1.5 inline-flex">
                                <h4 class="text-white-900 text-xl font-semibold leading-8">
                                    APPLE iPhone 15 (128 GB) - Black
                                </h4>
                                <h6 class="text-white-900 text-base font-semibold leading-relaxed">
                                    Return Reason:
                                    <span class="text-gray-500 text-base font-medium leading-relaxed">
                                        Incorrect Product
                                    </span>
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div class="w-full justify-center items-center gap-5 flex sm:flex-row flex-col">
                        <button class="md:w-fit w-full px-5 py-2.5 bg-blue-50 hover:bg-blue-100 transition-all duration-700 ease-in-out rounded-xl justify-center items-center flex">
                            <span class="px-2 py-px text-blue-600 text-base font-semibold leading-relaxed">
                                Back to Shopping
                            </span>
                        </button>
                        <button class="md:w-fit w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-800 transition-all duration-700 ease-in-out shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] rounded-xl justify-center items-center flex">
                            <span class="px-2 py-px text-white text-base font-semibold leading-relaxed">
                                Cancel Refund
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};


const RefundPolicy = () => {
    return (
    <section class="py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-200 rounded-xl">
        <div
          class="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full"
        >
          <div class="w-full lg:w-1/2">
            <img
              src="logo.png"
              alt="FAQ tailwind section"
              class="w-full rounded-xl object-cover"
            />
          </div>
          <div class="w-full lg:w-1/2">
            <div class="lg:max-w-xl">
              <div class="mb-6 lg:mb-16">
                <h6
                  class="text-lg text-center font-medium text-indigo-600 mb-2 lg:text-left"
                >
                  faqs
                </h6>
                <h2
                  class="text-4xl text-center font-bold text-gray-900 leading-[3.25rem] mb-5 lg:text-left"
                >
                  Looking for answers?
                </h2>
              </div>
              <div class="accordion-group" data-accordion="default-accordion">
                <div 
                  class="accordion py-8 "
                  id="basic-heading-four-with-arrow-always-open"
                >
                  <button
                    class="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-gray-600 w-full transition duration-500 hover:text-indigo-600 accordion-active:font-medium accordion-active:text-indigo-600"
                    aria-controls="basic-collapse-four-with-arrow-always-open"
                  >
                    <h5>What is the payment process?</h5>
                    <svg
                      class="text-gray-900 transition duration-500 group-hover:text-indigo-600 accordion-active:text-indigo-600 accordion-active:rotate-180"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div
                    id="basic-collapse-four-with-arrow-always-open"
                    class="accordion-content w-full px-0 overflow-hidden pr-4"
                    aria-labelledby="basic-heading-four-with-arrow-always-open"
                  >
                    <p class="text-base text-gray-500 font-normal">
                      Our focus on providing robust and user-friendly content
                      management capabilities ensures that you can manage your
                      content with confidence, and achieve your content
                      marketing goals with ease.
                    </p>
                  </div>
                </div> 
                <div 
                  class="accordion py-8 "
                  id="basic-heading-four-with-arrow-always-open"
                >
                  <button
                    class="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-gray-600 w-full transition duration-500 hover:text-indigo-600 accordion-active:font-medium accordion-active:text-indigo-600"
                    aria-controls="basic-collapse-four-with-arrow-always-open"
                  >
                    <h5>What is the payment process?</h5>
                    <svg
                      class="text-gray-900 transition duration-500 group-hover:text-indigo-600 accordion-active:text-indigo-600 accordion-active:rotate-180"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div
                    id="basic-collapse-four-with-arrow-always-open"
                    class="accordion-content w-full px-0 overflow-hidden pr-4"
                    aria-labelledby="basic-heading-four-with-arrow-always-open"
                  >
                    <p class="text-base text-gray-500 font-normal">
                      Our focus on providing robust and user-friendly content
                      management capabilities ensures that you can manage your
                      content with confidence, and achieve your content
                      marketing goals with ease.
                    </p>
                  </div>
                </div> 
                <div 
                  class="accordion py-8 "
                  id="basic-heading-four-with-arrow-always-open"
                >
                  <button
                    class="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-gray-600 w-full transition duration-500 hover:text-indigo-600 accordion-active:font-medium accordion-active:text-indigo-600"
                    aria-controls="basic-collapse-four-with-arrow-always-open"
                  >
                    <h5>What is the payment process?</h5>
                    <svg
                      class="text-gray-900 transition duration-500 group-hover:text-indigo-600 accordion-active:text-indigo-600 accordion-active:rotate-180"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div
                    id="basic-collapse-four-with-arrow-always-open"
                    class="accordion-content w-full px-0 overflow-hidden pr-4"
                    aria-labelledby="basic-heading-four-with-arrow-always-open"
                  >
                    <p class="text-base text-gray-500 font-normal">
                      Our focus on providing robust and user-friendly content
                      management capabilities ensures that you can manage your
                      content with confidence, and achieve your content
                      marketing goals with ease.
                    </p>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
                                            
    )
}