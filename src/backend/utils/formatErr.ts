import { APIError } from '../../../src-tauri/api';
import { allowed_language } from '../../containers/applications/apps/assets/Langswitch';
import { store } from '../reducers';
import { localStorageKey } from './constant';

export function formatError(error: APIError | Error | any): string {
    if (error.code != undefined) return includeErrCode(error.code);
    else if (error instanceof Error) return error.message;
    else return error.message;
}

const includeErrCode = (code = 0) => {
    const errMsg = store.getState().globals.error_messages;

    let languageLocal =
        localStorage.getItem(localStorageKey.language) ?? 'VN';
    if (!allowed_language.includes(languageLocal)) languageLocal = 'ENG';
    
    const errThrow = errMsg.find((e) => e.code == code);
    switch (languageLocal) {
        case 'ENG':
            return errThrow.en ?? "Unknown Error, Contact ADMIN for support!";
        case 'VN':
            return errThrow.vi ?? "Lỗi không xác định, liên hệ ADMIN!"
        case 'ID':
            return errThrow.id ?? "Unknown Error, Contact ADMIN for support!";
        default:
            return errThrow.en ?? "Unknown Error, Contact ADMIN for support!";    
    } 
};
