import { useEffect } from "react";
import { UserEvents } from "../src-tauri/api/database.ts";
import { store } from "./backend/reducers/index.ts";
import { Contents } from "./backend/reducers/locales/index.ts";
import { externalLink } from "./backend/utils/constant.ts";

export function ErrorFallback({ error }) {
    useEffect(() =>
        UserEvents({
            type: 'panic',
            payload: {
                message: error.message,
                stack: error.stack
            }
        }), [])

    const t = store.getState().globals.translation;
    const action = async () => {
        await navigator.clipboard.writeText(error.stack);
        window.open(externalLink.MESSAGE_LINK,'_blank')
    }

    return (
        <div>
            <meta charSet="UTF-8" />
            <title>404 - Page</title>
            <link rel="stylesheet" href="./style.css" />
            <div id="page">
                <div id="container">
                    <h1>:(</h1>
                    <h2>
                        Nội dung lỗi đã được copy vào clipboard của bạn, Paste (Ctrl V) cho chúng mình để giải quyết lỗi
                        {t[Contents.TIME]}
                    </h2>
                    <div id="details">
                        <div id="qr">
                            <div id="image">
                                <img
                                    src="https://win11.blueedge.me/img/qr.png"
                                    alt="QR Code"
                                />
                            </div>
                        </div>
                        <div id="stopcode">
                            <button onClick={action}>
                                Gửi lỗi qua messenger
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* partial */}
        </div>
    );
}
