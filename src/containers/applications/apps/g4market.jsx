import { useAppSelector } from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/guideline.scss';

export const G4Market = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'g4market')
    );

    return (
        <div
            className="guidelineApp floatTab dpShad"
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
                name="Guideline"
            />
            <div className="windowScreen wrapperGuideline">
                <LazyComponent show={!wnapp.hide}>
                    <iframe
                        src={'https://g4market.com/?utm_source=thinkmay&utm_medium=desktopscreen&utm_campaign=referral'}
                        id="isite"
                        frameborder="0"
                        className="w-full h-full"
                        title="site"
                    ></iframe>
                </LazyComponent>
            </div>
        </div>
    );
};
