import { appDispatch, popup_close } from '../../../backend/reducers';

export function customize() {
    return (
        <div
            id="auth-pop-up"
            tabIndex="-1"
            className="flex justify-center items-center fixed bottom-0 top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
            style={{ backdropFilter: 'blur(3px) brightness(0.5)' }}
        >
            <div
                className="fixed w-full h-full max-w-2xl md:h-auto p-12 rounded-2xl"
                style={{ background: 'var(--fakeMica' }}
            >
                <div className="px-4 space-y-4 md:px-6 mt-12">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    for="min-age"
                                    className="block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Min Age
                                </label>
                                <input
                                    id="min-age"
                                    type="range"
                                    min="1"
                                    max="100"
                                    value="18"
                                    step="1"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label
                                    for="max-age"
                                    className="block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Max Age
                                </label>
                                <input
                                    id="max-age"
                                    type="range"
                                    min="1"
                                    max="100"
                                    value="45"
                                    step="1"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between col-span-2 space-x-3">
                                <div className="w-full">
                                    <label
                                        for="min-age-input"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        From
                                    </label>

                                    <input
                                        type="number"
                                        id="min-age-input"
                                        value="18"
                                        min="1"
                                        max="100"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                                        placeholder=""
                                        required
                                    />
                                </div>

                                <div className="w-full">
                                    <label
                                        for="max-age-input"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        To
                                    </label>

                                    <input
                                        type="number"
                                        id="max-age-input"
                                        value="45"
                                        min="1"
                                        max="100"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    for="min-experience"
                                    className="block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Min Experience
                                </label>
                                <input
                                    id="min-experience"
                                    type="range"
                                    min="0"
                                    max="30"
                                    value="5"
                                    step="1"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>

                            <div>
                                <label
                                    for="max-experience"
                                    className="block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Max Experience
                                </label>
                                <input
                                    id="max-experience"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="45"
                                    step="1"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                            </div>

                            <div className="flex items-center justify-between col-span-2 space-x-3">
                                <div className="w-full">
                                    <label
                                        for="min-experience-input"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        From
                                    </label>

                                    <input
                                        type="number"
                                        id="min-experience-input"
                                        value="18"
                                        min="1"
                                        max="100"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder=""
                                        required
                                    />
                                </div>

                                <div className="w-full">
                                    <label
                                        for="max-experience-input"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        To
                                    </label>

                                    <input
                                        type="number"
                                        id="max-experience-input"
                                        value="45"
                                        min="1"
                                        max="100"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                            Account type
                        </h6>

                        <ul className="flex flex-col items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:flex-row dark:bg-gray-700 dark:border-gray-600 dark:text-white list-none ">
                            <li className="w-full border-b border-gray-200 md:border-b-0 md:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        id="account-all"
                                        type="radio"
                                        value=""
                                        name="list-radio"
                                        checked
                                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        for="account-all"
                                        className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        All
                                    </label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 md:border-b-0 md:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        id="account-administrator"
                                        type="radio"
                                        value=""
                                        name="list-radio"
                                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        for="account-administrator"
                                        className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Administrator
                                    </label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 md:border-b-0 md:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input
                                        id="account-moderator"
                                        type="radio"
                                        value=""
                                        name="list-radio"
                                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        for="account-moderator"
                                        className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Moderator
                                    </label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center pl-3">
                                    <input
                                        id="account-viewer"
                                        type="radio"
                                        value=""
                                        name="list-radio"
                                        className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        for="account-viewer"
                                        className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Viewer
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Job title
                        </label>
                        <ul className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 list-none ">
                            <li>
                                <input
                                    type="checkbox"
                                    id="frontend-developer"
                                    name="job_title"
                                    value=""
                                    className="hidden peer"
                                />
                                <label
                                    for="frontend-developer"
                                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
                                >
                                    Frontend developer
                                </label>
                            </li>
                            <li>
                                <input
                                    type="checkbox"
                                    id="ui-ux-designer"
                                    name="job_title"
                                    value=""
                                    className="hidden peer"
                                />
                                <label
                                    for="ui-ux-designer"
                                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
                                >
                                    UI/UX Designer
                                </label>
                            </li>
                            <li>
                                <input
                                    type="checkbox"
                                    id="react-developer"
                                    name="job_title"
                                    value=""
                                    className="hidden peer"
                                    checked
                                />
                                <label
                                    for="react-developer"
                                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
                                >
                                    React Developer
                                </label>
                            </li>

                            <li>
                                <input
                                    type="checkbox"
                                    id="php-developer"
                                    name="job_title"
                                    value=""
                                    className="hidden peer"
                                />
                                <label
                                    for="php-developer"
                                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
                                >
                                    PHP Developer
                                </label>
                            </li>
                            <li>
                                <input
                                    type="checkbox"
                                    id="engineer"
                                    name="job_title"
                                    value=""
                                    className="hidden peer"
                                    checked
                                />
                                <label
                                    for="engineer"
                                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
                                >
                                    Engineer
                                </label>
                            </li>
                            <li>
                                <input
                                    type="checkbox"
                                    id="marketing"
                                    name="job_title"
                                    value=""
                                    className="hidden peer"
                                />
                                <label
                                    for="marketing"
                                    className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border-2 rounded-lg cursor-pointer text-primary-600 border-primary-600 dark:hover:text-white dark:border-primary-500 dark:peer-checked:border-primary-500 peer-checked:border-primary-600 peer-checked:bg-primary-600 hover:text-white peer-checked:text-white hover:bg-primary-500 dark:text-primary-500 dark:bg-gray-800 dark:hover:bg-primary-600 dark:hover:border-primary-600 dark:peer-checked:bg-primary-500"
                                >
                                    Marketing
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center p-6 space-x-4 rounded-b dark:border-gray-600">
                    <button
                        type="submit"
                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                    >
                        Show 32 Results
                    </button>
                    <button
                        type="reset"
                        className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Reset
                    </button>
                    <button
                        type="reset"
                        className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={() => appDispatch(popup_close(true))}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
