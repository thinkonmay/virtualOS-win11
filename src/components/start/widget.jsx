import { useRef } from 'react';
import { MdOutlineSend } from 'react-icons/md';
import {
    appDispatch,
    push_message,
    useAppSelector
} from '../../backend/reducers';
import { Icon, LazyComponent } from '../shared/general';
import './widget.scss';

export const WidPane = () => {
    const widget = useAppSelector((state) => state.sidepane);
    const value = useRef();
    const finish = () => {
        if (value.current.value.length == 0) return;

        appDispatch(
            push_message({
                recipient: 'thinkmay',
                type: 'private',
                content: value.current.value
            })
        );
        value.current.value = null;
    };

    return (
        <>
            <div
                data-hide={widget.banhide}
                style={{ '--prefix': 'BAND' }}
                className="widPaneCont"
            >
                <LazyComponent show={!widget.banhide}>
                    <div className="WidPane ">
                        <div className="title">
                            Chat with <Icon width={48} src="thinkmay"></Icon>
                        </div>
                        <div className="widgetCont win11Scroll">
                            <div className="newsCont">
                                <div className="allNewsCont">
                                    {widget.message.map((article, i) => {
                                        return (
                                            <a
                                                className={`articleCont `}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={i}
                                                style={{
                                                    backgroundColor:
                                                        article.recipient ==
                                                        'thinkmay'
                                                            ? '#a8e0e3'
                                                            : 'white'
                                                }}
                                            >
                                                <div className="tpNews">
                                                    <div className="tpSource">
                                                        {article.recipient +
                                                            '  ' +
                                                            new Date(
                                                                article.timestamp
                                                            ).toLocaleDateString() +
                                                            '  ' +
                                                            new Date(
                                                                article.timestamp
                                                            ).toLocaleTimeString()}
                                                    </div>
                                                    <div className="tpTitle">
                                                        {article.content}
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="relative flex gap-3 sendMessage ">
                            <input
                                className="inputMsg"
                                ref={value}
                                onKeyDown={(e) =>
                                    e.key == 'Enter' ? finish() : null
                                }
                                placeholder="Send us a message"
                                type="text"
                            />
                            <MdOutlineSend
                                color="rgb(1, 103, 192)"
                                fontSize={'2rem'}
                                onClick={finish}
                            ></MdOutlineSend>
                            {/*<Icon
                                className="z-1 handcr ml-2 "
                                src="mail"
                                width={30}
                                margin="0 10px"
                            />*/}
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </>
    );
};
