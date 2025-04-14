import { useState } from 'react';
import {
    loginAction,
    loginWithEmail,
    signUpWithEmail
} from '../../../backend/actions';
import {
    appDispatch,
    popup_close,
    popup_open,
    useAppSelector
} from '../../../backend/reducers';
import { preload } from '../../../backend/actions/background';
import DomainSwitch from '../../applications/apps/assets/DomainSwitch';

export function login({ loading }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState(null);

    const id = useAppSelector((state) => state.user.id);
    if (!(id == 'unknown' || id == undefined || id == null)) return null;

    const oauth2 = (provider) => {
        loading(true);
        loginAction(provider, () => loading(false));
    };

    const onLogin = async () => {
        appDispatch(
            popup_open({
                type: 'notify',
                data: {
                    loading: true
                }
            })
        );

        try {
            !isSignup
                ? await loginWithEmail(username, password)
                : await signUpWithEmail(username, password, passwordConfirm);

            loading(true);
            await preload();
            loading(false);
        } catch (e) {
            setError(e.message);
            setTimeout(() => setError(null), 2000);
        }
        appDispatch(popup_close());
    };

    return (
        <div
            id="auth-pop-up"
            tabIndex="-1"
            className="flex justify-center items-center fixed bottom-0 top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
            style={{ backdropFilter: 'blur(3px) brightness(0.5)' }}
        >
            <div className="relative p-4 w-full max-w-lg h-full md:h-auto overflow-y-auto overflow-x-hidden">
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-900 md:p-6 ">
                    <div className="flex items-center mb-2">
                        <a
                            className="flex items-center text-xl font-semibold text-gray-900 dark:text-white mr-2"
                        >
                            <img
                                src="logo_white.png"
                                className="h-12 mr-4 hidden dark:block"
                            ></img>
                            <img
                                src="logo.png"
                                className="h-12 mr-4 dark:hidden"
                            ></img>
                            Đăng nhập Thinkmay
                        </a>
                        <DomainSwitch/>
                    </div>
                    <div className="flex items-center mb-2 space-x-4 ">
                        <a
                            onClick={() => oauth2('google')}
                            className="w-full inline-flex items-center justify-center text-white bg-[#4284F4] hover:bg-[#3372df] dark:focus:ring-[#0f53c9] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                        >
                            <svg
                                className="p-1 mr-2 -ml-1 w-5 h-5 bg-white rounded-full"
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
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="name@thinkmay.net"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {isSignup ? (
                        <>
                            <div className="mb-6">
                                <label
                                    htmlFor="password-confirm"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Repeat Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    required=""
                                    value={passwordConfirm}
                                    onChange={(e) =>
                                        setPasswordConfirm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-start mb-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        required=""
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="text-gray-500 dark:text-gray-400"
                                    >
                                        I agree to all the{' '}
                                        <a
                                            className="font-medium underline text-primary-600 hover:text-primary-700 hover:no-underline"
                                            href="#"
                                        >
                                            Terms
                                        </a>
                                        and
                                        <a
                                            className="font-medium underline hover:no-underline text-primary-600 hover:text-primary-700"
                                            href="#"
                                        >
                                            Privacy Policy
                                        </a>
                                        .
                                    </label>
                                </div>
                            </div>
                        </>
                    ) : null}
                    <button
                        onClick={onLogin}
                        className="w-full text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                    >
                        Login
                    </button>
                    {error ? (
                        <p className="text-sm text-center text-red-600">
                            {error}
                        </p>
                    ) : null}
                    {isSignup ? (
                        <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                            Tôi đã có tài khoản
                            <a
                                onClick={() => setIsSignup(false)}
                                className="font-medium underline text-primary-600 hover:no-underline dark:text-primary-500 hover:text-primary-700"
                            >
                                Đăng nhập
                            </a>
                        </p>
                    ) : (
                        <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                            Tôi chưa có tài khoản
                            <a
                                onClick={() => setIsSignup(true)}
                                className="font-medium underline text-primary-600 hover:no-underline dark:text-primary-500 hover:text-primary-700"
                            >
                                Đăng kí
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
