import {
    appDispatch,
    choose_game,
    popup_close,
    useAppSelector
} from '../../../backend/reducers';
import { Image } from '../../../components/shared/general';

export function gameChoose({ data: { planName } }) {
    const gamesInSubscription = useAppSelector(
        (state) => state.globals.gamesInSubscription
    );
    const handleChooseGame = (gameId) => {
        appDispatch(
            choose_game({
                planName: planName,
                template: gameId
            })
        );
        appDispatch(popup_close());
    };
    return (
        <div className="max-w-[780px] min-w-[320px] w-full h-auto p-[30px] rounded-lg self-center bg-[#222638]]">
            <h2 className="text-center">
                Chọn 1 game bạn muốn cài sẵn khi có máy
            </h2>

            <div className="flex flex-wrap mt-8">
                {gamesInSubscription.map((item) => (
                    <div
                        onClick={() => handleChooseGame(item.template)}
                        key={item.name}
                        className="ribcont ltShad prtclk rounded-lg bg-[#2d3146] flex-shrink-0 flex-1"
                    >
                        <Image className="img" ext absolute src={item.logo} />
                        <div className="name capitalize text-white  text-xs text-center font-semibold">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
