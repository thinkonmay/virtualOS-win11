import { useAppSelector } from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/guideline.scss';

export const GuidelineApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'guideline')
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
                    <div className="flex items-center justify-center px-0 guidelineContent win11Scroll">
                        <iframe
                            className="w-[360px] h-[280px] md:w-[573px] md:h-[480px] lg:w-[720px] lg:h-[480px]"
                            src="https://www.youtube.com/embed/OeYx8N0xofI?si=XiTFkhuH8Pt37CDX"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
