import {
    appDispatch,
    popup_close,
    toggle_hide_vm,
    toggle_high_mtu,
    toggle_high_queue,
    toggle_hq,
    useAppSelector
} from '../../../backend/reducers';
import { Contents } from '../../../backend/reducers/locales';

export function customize() {
    const t = useAppSelector((state) => state.globals.translation);
    const { HideVM, HighQueue, HighMTU } = useAppSelector(
        (state) => state.worker
    );
    const hq = useAppSelector((state) => state.remote.hq);
    const actions = [
        {
            name: t[Contents.HIDE_VM],
            state: HideVM,
            action: () => appDispatch(toggle_hide_vm())
        },
        {
            name: t[Contents.HIGH_MTU],
            state: HighMTU,
            action: () => appDispatch(toggle_high_mtu())
        },
        {
            name: t[Contents.HIGH_QUEUE],
            state: HighQueue,
            action: () => appDispatch(toggle_high_queue())
        },
        {
            name: t[Contents.MAXIMUM_QUALITY],
            state: hq,
            action: () => appDispatch(toggle_hq())
        }
    ];

    const hwOptions = [
        {
            name: 'RAM',
            value: 0,
            action: () => {}
        },
        {
            name: 'CPU',
            value: 0,
            action: () => {}
        },
        {
            name: 'Volume',
            value: 0,
            action: () => {}
        }
    ];

    const games = [
        {
            name: 'Genshin Impact',
            action: () => {}
        }
    ];

    const renderOption = (option, index) => (
        <li
            key={index}
            className="w-full border-b border-gray-200 md:border-b-0 md:border-r dark:border-gray-600"
        >
            <div
                onClick={option.action}
                className={`flex items-center pl-3 m-3 rounded-xl  cursor-pointer ${
                    option.state ? 'bg-blue-950' : 'bg-gray-600'
                }`}
            >
                <label
                    for="account-moderator"
                    className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                >
                    {option.name}
                </label>
            </div>
        </li>
    );

    const renderGameSetting = (game, index) => (
        <li key={index}>
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
                {game.name}
            </label>
        </li>
    );

    const renderHWOption = (hw, index) => (
        <div key={index} className="w-full">
            <label
                for="min-age-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {hw.name}
            </label>

            <input
                type="number"
                id="min-age-input"
                value={hw.value}
                onChange={hw.action}
                min="8"
                max="24"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                placeholder=""
                required
            />
        </div>
    );

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
                        <div className="flex items-center justify-between col-span-2 space-x-3">
                            {hwOptions.map(renderHWOption)}
                        </div>
                    </div>
                    <div>
                        <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                            Advanced setting
                        </h6>
                        <ul className="flex flex-col items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:flex-row dark:bg-gray-700 dark:border-gray-600 dark:text-white list-none ">
                            {actions.map(renderOption)}
                        </ul>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Game setting
                        </label>
                        <ul className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 list-none ">
                            {games.map(renderGameSetting)}
                        </ul>
                    </div>
                </div>
                <div className="flex items-center p-6 space-x-4 rounded-b dark:border-gray-600">
                    <button
                        type="submit"
                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                    >
                        Apply
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
