import { Contents } from '../reducers/locales';

import { store } from '../reducers';
import { CAUSE } from '../../../src-tauri/api/createClient';

const map: Map<CAUSE, Contents> = new Map<CAUSE, Contents>();
map.set(CAUSE.UNKNOWN, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.OUT_OF_HARDWARE, Contents.RUN_OUT_OF_GPU_STOCK);
map.set(CAUSE.MAXIMUM_DEPLOYMENT_REACHED, Contents.ALREADY_DEPLOYED);
map.set(CAUSE.LOCKED_RESOURCE, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.VM_BOOTING_UP, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.REMOTE_TIMEOUT, Contents.REMOTE_TIMEOUT);
map.set(CAUSE.INVALID_REF, Contents.UNKNOWN_ERROR);
map.set(CAUSE.INVALID_AUTH_HEADER, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.API_CALL, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.PERMISSION_REQUIRED, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.NEED_WAIT, Contents.STORE_DESCRIPTIONR);
map.set(CAUSE.INVALID_REQUEST, Contents.STORE_DESCRIPTIONR);

export function formatError(error) {
    if (error?.message && includesErr(error?.message) != '') {
        return includesErr(error.message);
    } else if (includesErr(error) !== '') {
        return includesErr(error);
    }
    if (typeof error === 'object') {
        return error.message;
    }
    return error;
}

const listErr = [
    {
        msg: 'ran out of hardware',
        text: [Contents.RUN_OUT_OF_GPU_STOCK, Contents.SUGGEST]
    },
    {
        msg: 'ran out of gpu',
        text: [Contents.RUN_OUT_OF_GPU_STOCK, Contents.SUGGEST]
    },
    {
        msg: 'run out of gpu',
        text: [Contents.RUN_OUT_OF_GPU_STOCK, Contents.SUGGEST]
    },
    {
        msg: 'is locked',
        text: [Contents.IS_LOCKED]
    },
    {
        msg: 'worker not pinged',
        text: [Contents.NOT_PINGED]
    },
    {
        msg: 'cluster not exist or not active', //TODO
        text: ['Server is down!']
    },
    {
        msg: 'demo not available', //TODO
        text: [Contents.CLOSEDEMO]
    },
    {
        msg: 'remote timeout',
        text: [Contents.REMOTE_TIMEOUT]
    },
    {
        msg: 'timeout', //TODO
        text: [Contents.TIME_OUT]
    }
];
const includesErr = (err = '') => {
    let errFormat = '';
    const t = store.getState().globals.translation;

    for (let i = 0; i < listErr.length; i++) {
        if (JSON.stringify(err)?.includes(listErr[i].msg)) {
            listErr[i].text.forEach((txt) => {
                errFormat += t[txt] + ' ';
            });
            break;
        }
    }

    return errFormat;
};
