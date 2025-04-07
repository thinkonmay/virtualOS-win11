import { Modal, ModalBody } from 'flowbite-react';

export function discount({ data: { from, to, percentage } }) {
    return (
        <div
            id="pro-version-popup"
            tabindex="-1"
            class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            style={{
                backdropFilter: 'blur(3px) brightness(0.5)'
            }}
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="md:p-8 p-4 shadow dark:bg-gray-800 rounded-lg bg-white">
                    <div className="mb-4 flex items-center md:mb-6">
                        <a
                            href="https://flowbite.com"
                            className="me-3 flex items-center"
                        >
                            <img
                                src="https://flowbite.com/docs/images/logo.svg"
                                className="me-2 sm:h-8"
                                alt="Flowbite Logo"
                            />
                            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                                Flowbite
                            </span>
                        </a>
                        <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            PRO
                        </span>
                    </div>
                    <p className="mb-4 border-b border-t border-gray-200 py-4 text-lg text-gray-500 dark:border-gray-700 dark:text-white md:mb-6 md:py-6 md:text-xl">
                        You know that a{' '}
                        <span className="font-bold text-gray-900 dark:text-white">
                            Flowbite PRO
                        </span>{' '}
                        customer saves more than{' '}
                        <span className="font-bold text-gray-900 dark:text-white">
                            $200
                        </span>{' '}
                        on average per year from transport costs?
                    </p>
                    <h3 className="mb-4 text-xl font-semibold leading-none text-gray-900 dark:text-white md:mb-6">
                        PRO plan benefits
                    </h3>
                    <ul role="list" className="mb-4 space-y-3 md:mb-6">
                        <li className="flex items-center space-x-1.5">
                            <svg
                                className="h-5 w-5 shrink-0 text-green-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                />
                            </svg>
                            <span className="leading-tight text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    Free delivery
                                </span>{' '}
                                delivery for all products
                            </span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                            <svg
                                className="h-5 w-5 shrink-0 text-green-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8.891 15.107 15.11 8.89m-5.183-.52h.01m3.089 7.254h.01M14.08 3.902a2.849 2.849 0 0 0 2.176.902 2.845 2.845 0 0 1 2.94 2.94 2.849 2.849 0 0 0 .901 2.176 2.847 2.847 0 0 1 0 4.16 2.848 2.848 0 0 0-.901 2.175 2.843 2.843 0 0 1-2.94 2.94 2.848 2.848 0 0 0-2.176.902 2.847 2.847 0 0 1-4.16 0 2.85 2.85 0 0 0-2.176-.902 2.845 2.845 0 0 1-2.94-2.94 2.848 2.848 0 0 0-.901-2.176 2.848 2.848 0 0 1 0-4.16 2.849 2.849 0 0 0 .901-2.176 2.845 2.845 0 0 1 2.941-2.94 2.849 2.849 0 0 0 2.176-.901 2.847 2.847 0 0 1 4.159 0Z"
                                />
                            </svg>
                            <span className="leading-tight text-gray-500 dark:text-gray-400">
                                Exlusive discount in Flowbite Store
                            </span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                            <svg
                                className="h-5 w-5 shrink-0 text-green-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"
                                />
                            </svg>
                            <span className="leading-tight text-gray-500 dark:text-gray-400">
                                Up to{' '}
                                <span className="font-medium text-gray-900 dark:text-white">
                                    30% extra discount
                                </span>{' '}
                                on premium brands
                            </span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                            <svg
                                className="h-5 w-5 shrink-0 text-green-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"
                                />
                            </svg>
                            <span className="leading-tight text-gray-500 dark:text-gray-400">
                                Up to{' '}
                                <span className="font-medium text-gray-900 dark:text-white">
                                    40% extra discounts
                                </span>{' '}
                                at thousands of local restaurants
                            </span>
                        </li>
                    </ul>
                    <div className="sn:flex items-center space-y-4 sm:space-x-4 sm:space-y-0">
                        <a
                            href="#"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white  hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                        >
                            Try it free for 3 months
                        </a>
                        <button
                            type="button"
                            id="closeModal"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
                        >
                            Not today
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
