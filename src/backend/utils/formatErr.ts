import { APIError } from '../../../src-tauri/api';
import { store } from '../reducers';

export function formatError(error: APIError | Error | any): string {
    if (error.code != undefined) return includeErrCode(error.code);
    else if (error instanceof Error) return error.message;
    else return error.message;
}

const includeErrCode = (code = 0) => {
    const errMsg = store.getState().globals.error_messages;

    // TODO: get current language selected.
    return errMsg.find((e) => e.code == code).vi;
};
