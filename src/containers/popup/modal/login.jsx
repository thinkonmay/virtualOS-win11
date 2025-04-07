import { Modal, ModalBody } from 'flowbite-react';

export function login({ data: {} }) {
    return (
        <div
            id="auth-pop-up"
            tabindex="-1"
            class="flex justify-center items-center fixed bottom-0 top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
            style={{ backdropFilter: 'blur(3px) brightness(0.5)' }}
        >
            <div class="relative p-4 w-full max-w-lg h-full md:h-auto overflow-y-auto overflow-x-hidden top-12">
                <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-900 md:p-6 ">
                    <div class="flex items-center mb-2">
                        <a
                            href="#"
                            class="flex items-center text-xl font-semibold text-gray-900 dark:text-white"
                        >
                            <svg
                                class="mr-2 h-7"
                                viewBox="0 0 33 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M25.2696 13.126C25.1955 13.6364 24.8589 14.3299 24.4728 14.9328C23.9856 15.6936 23.2125 16.2264 22.3276 16.4114L18.43 17.2265C17.8035 17.3575 17.2355 17.6853 16.8089 18.1621L14.2533 21.0188C13.773 21.5556 13.4373 21.4276 13.4373 20.7075C13.4315 20.7342 12.1689 23.9903 15.5149 25.9202C16.8005 26.6618 18.6511 26.3953 19.9367 25.6538L26.7486 21.7247C29.2961 20.2553 31.0948 17.7695 31.6926 14.892C31.7163 14.7781 31.7345 14.6639 31.7542 14.5498L25.2696 13.126Z"
                                    fill="url(#paint0_linear_11430_22515)"
                                />
                                <path
                                    d="M23.5028 9.20133C24.7884 9.94288 25.3137 11.0469 25.3137 12.53C25.3137 12.7313 25.2979 12.9302 25.2694 13.1261L28.0141 14.3051L31.754 14.5499C32.2329 11.7784 31.2944 8.92561 29.612 6.65804C28.3459 4.9516 26.7167 3.47073 24.7581 2.34097C23.167 1.42325 21.5136 0.818599 19.8525 0.486816L17.9861 2.90382L17.3965 5.67918L23.5028 9.20133Z"
                                    fill="url(#paint1_linear_11430_22515)"
                                />
                                <path
                                    d="M1.5336 11.2352C1.5329 11.2373 1.53483 11.238 1.53556 11.2358C1.67958 10.8038 1.86018 10.3219 2.08564 9.80704C3.26334 7.11765 5.53286 5.32397 8.32492 4.40943C11.117 3.49491 14.1655 3.81547 16.7101 5.28323L17.3965 5.67913L19.8525 0.486761C12.041 -1.07341 4.05728 3.51588 1.54353 11.2051C1.54233 11.2087 1.53796 11.2216 1.5336 11.2352Z"
                                    fill="url(#paint2_linear_11430_22515)"
                                />
                                <path
                                    d="M19.6699 25.6538C18.3843 26.3953 16.8003 26.3953 15.5147 25.6538C15.3402 25.5531 15.1757 25.4399 15.0201 25.3174L12.7591 26.8719L10.8103 30.0209C12.9733 31.821 15.7821 32.3997 18.589 32.0779C20.7013 31.8357 22.7995 31.1665 24.7582 30.0368C26.3492 29.1191 27.7 27.9909 28.8182 26.7195L27.6563 23.8962L25.7762 22.1316L19.6699 25.6538Z"
                                    fill="url(#paint3_linear_11430_22515)"
                                />
                                <path
                                    d="M15.0201 25.3175C14.0296 24.5373 13.4371 23.3406 13.4371 22.0588V21.931V11.2558C13.4371 10.6521 13.615 10.5494 14.1384 10.8513C13.3323 10.3864 11.4703 8.79036 9.17118 10.1165C7.88557 10.858 6.8269 12.4949 6.8269 13.978V21.8362C6.8269 24.775 8.34906 27.8406 10.5445 29.7966C10.6313 29.874 10.7212 29.9469 10.8103 30.0211L15.0201 25.3175Z"
                                    fill="url(#paint4_linear_11430_22515)"
                                />
                                <path
                                    d="M28.6604 5.49565C28.6589 5.49395 28.6573 5.49532 28.6589 5.49703C28.9613 5.83763 29.2888 6.23485 29.6223 6.68734C31.3648 9.05099 32.0158 12.0447 31.4126 14.9176C30.8093 17.7906 29.0071 20.2679 26.4625 21.7357L25.7761 22.1316L28.8181 26.7195C34.0764 20.741 34.09 11.5388 28.6815 5.51929C28.6789 5.51641 28.67 5.50622 28.6604 5.49565Z"
                                    fill="url(#paint5_linear_11430_22515)"
                                />
                                <path
                                    d="M7.09355 13.978C7.09354 12.4949 7.88551 11.1244 9.17113 10.3829C9.34564 10.2822 9.52601 10.1965 9.71002 10.1231L9.49304 7.38962L7.96861 4.26221C5.32671 5.23364 3.1897 7.24125 2.06528 9.83067C1.2191 11.7793 0.75001 13.9294 0.75 16.1888C0.75 18.0243 1.05255 19.7571 1.59553 21.3603L4.62391 21.7666L7.09355 21.0223V13.978Z"
                                    fill="url(#paint6_linear_11430_22515)"
                                />
                                <path
                                    d="M9.71016 10.1231C10.8817 9.65623 12.2153 9.74199 13.3264 10.3829L13.4372 10.4468L22.3326 15.5777C22.9566 15.9376 22.8999 16.2918 22.1946 16.4392L22.7078 16.332C23.383 16.1908 23.9999 15.8457 24.4717 15.3428C25.2828 14.4782 25.5806 13.4351 25.5806 12.5299C25.5806 11.0468 24.7886 9.67634 23.503 8.93479L16.6911 5.00568C14.1436 3.53627 11.0895 3.22294 8.29622 4.14442C8.18572 4.18087 8.07756 4.2222 7.96875 4.26221L9.71016 10.1231Z"
                                    fill="url(#paint7_linear_11430_22515)"
                                />
                                <path
                                    d="M20.0721 31.8357C20.0744 31.8352 20.0739 31.8332 20.0717 31.8337C19.6252 31.925 19.1172 32.0097 18.5581 32.0721C15.638 32.3978 12.7174 31.4643 10.5286 29.5059C8.33986 27.5474 7.09347 24.7495 7.09348 21.814L7.09347 21.0222L1.59546 21.3602C4.1488 28.8989 12.1189 33.5118 20.0411 31.8421C20.0449 31.8413 20.0582 31.8387 20.0721 31.8357Z"
                                    fill="url(#paint8_linear_11430_22515)"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_11430_22515"
                                        x1="20.8102"
                                        y1="23.9532"
                                        x2="23.9577"
                                        y2="12.9901"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#1724C9" />
                                        <stop offset="1" stop-color="#1C64F2" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint1_linear_11430_22515"
                                        x1="28.0593"
                                        y1="10.5837"
                                        x2="19.7797"
                                        y2="2.33321"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#1C64F2" />
                                        <stop offset="1" stop-color="#0092FF" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint2_linear_11430_22515"
                                        x1="16.9145"
                                        y1="5.2045"
                                        x2="4.42432"
                                        y2="5.99375"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#0092FF" />
                                        <stop offset="1" stop-color="#45B2FF" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint3_linear_11430_22515"
                                        x1="16.0698"
                                        y1="28.846"
                                        x2="27.2866"
                                        y2="25.8192"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#1C64F2" />
                                        <stop offset="1" stop-color="#0092FF" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint4_linear_11430_22515"
                                        x1="8.01881"
                                        y1="15.8661"
                                        x2="15.9825"
                                        y2="24.1181"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#1724C9" />
                                        <stop offset="1" stop-color="#1C64F2" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint5_linear_11430_22515"
                                        x1="26.2004"
                                        y1="21.8189"
                                        x2="31.7569"
                                        y2="10.6178"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#0092FF" />
                                        <stop offset="1" stop-color="#45B2FF" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint6_linear_11430_22515"
                                        x1="6.11387"
                                        y1="9.31427"
                                        x2="3.14054"
                                        y2="20.4898"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#1C64F2" />
                                        <stop offset="1" stop-color="#0092FF" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint7_linear_11430_22515"
                                        x1="21.2932"
                                        y1="8.78271"
                                        x2="10.4278"
                                        y2="11.488"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#1724C9" />
                                        <stop offset="1" stop-color="#1C64F2" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint8_linear_11430_22515"
                                        x1="7.15667"
                                        y1="21.5399"
                                        x2="14.0824"
                                        y2="31.9579"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#0092FF" />
                                        <stop offset="1" stop-color="#45B2FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            Thinkmay
                        </a>
                    </div>
                    <form action="#">
                        <div class="flex items-center mb-2 space-x-4 ">
                            <a
                                href="#"
                                class="w-full inline-flex items-center justify-center text-white bg-[#333] hover:bg-[#1a1919] dark:focus:ring-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 border-blue-200 border-4"
                            >
                                <svg
                                    class="mr-2 -ml-1 w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 496 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                                    />
                                </svg>
                                Github
                            </a>
                            <a
                                href="#"
                                class="w-full inline-flex items-center justify-center text-white bg-[#4284F4] hover:bg-[#3372df] dark:focus:ring-[#0f53c9] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                <svg
                                    class="p-1 mr-2 -ml-1 w-5 h-5 bg-white rounded-full"
                                    viewBox="0 0 256 262"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid"
                                >
                                    <path
                                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                        fill="#EB4335"
                                    />
                                </svg>
                                Google
                            </a>
                        </div>
                        <div class="mb-2">
                            <label
                                for="email"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="name@flowbite.com"
                                required=""
                            />
                        </div>
                        <div class="mb-2">
                            <label
                                for="password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required=""
                            />
                        </div>
                        {/* <div class="mb-6">
                            <label
                                for="repeat-password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Repeat Password
                            </label>
                            <input
                                type="repeat-password"
                                name="repeat-password"
                                id="repeat-password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required=""
                            />
                        </div> */}
                        <div class="flex items-start mb-2">
                            <div class="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    required=""
                                />
                            </div>
                            <div class="ml-3 text-sm">
                                <label
                                    for="terms"
                                    class="text-gray-500 dark:text-gray-400"
                                >
                                    I agree to all the{' '}
                                    <a
                                        class="font-medium underline text-primary-600 hover:text-primary-700 hover:no-underline"
                                        href="#"
                                    >
                                        Terms
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        class="font-medium underline hover:no-underline text-primary-600 hover:text-primary-700"
                                        href="#"
                                    >
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            class="w-full text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                        >
                            Create an account
                        </button>
                        <p class="text-sm font-light text-center text-gray-500 dark:text-gray-400 mb-6">
                            Already have an account?{' '}
                            <a
                                href="#"
                                class="font-medium underline text-primary-600 hover:no-underline dark:text-primary-500 hover:text-primary-700"
                            >
                                Log In
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
