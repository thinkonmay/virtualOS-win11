import { RootState, store } from '../reducers';
import { Contents } from '../reducers/locales';

export const formatWaitingLog = (log = '') => {
    const t = (store.getState() as RootState).globals.translation;
    let logFormat = log;

    if (log.includes('position')) {
        logFormat = t[Contents.CA_POS_QUEUED_NOTIFY];
    } else {
        logFormat = `${t[Contents.CA_POS_QUEUED_OPENING]}: ${log}. ${
            t[Contents.CA_POS_PLEASE]
        }`;
    }

    return logFormat;
};
