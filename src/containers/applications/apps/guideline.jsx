import { useAppSelector } from '../../../backend/reducers';
import { externalLink } from '../../../backend/utils/constant';
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
                    <iframe
                        className="w-full h-full"
                        src={externalLink.GUIDELINE_LINK}
                        title="Hướng dẫn sử dụng Thinkmay"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                </LazyComponent>
            </div>
        </div>
    );
};
