import {
    ActionReducerMapBuilder,
    AsyncThunk,
    CaseReducer,
    PayloadAction,
    UnknownAction
} from '@reduxjs/toolkit';

import { appDispatch, popup_close, popup_open } from '..';
import { formatError } from '../../utils/formatErr';
const filterActions = [
    'update_local_worker',
    'fetch_local_worker',
    'fetch_user',
    'fetch_subscription_metadata',
    'fetch_subscription',
    'fetch_store',
    'get_plans',
    'get_resources',
    'save_reference',
    'fetch_domain'
];

const isFilterAction = (acctionType: string) => {
    return filterActions.some((act) => acctionType.includes(act));
};

const isPending = (action: UnknownAction) =>
    action.type.endsWith('/pending') &&
    !action.type.includes('setting') &&
    !action.type.includes('ping') &&
    !isFilterAction(action.type);

const isFulfilled = (action: UnknownAction) =>
    action.type.endsWith('/fulfilled') &&
    !action.type.includes('setting') &&
    !action.type.includes('ping') &&
    !isFilterAction(action.type);

const isRejected = (action: UnknownAction) =>
    action.type.endsWith('/rejected') &&
    !action.type.includes('setting') &&
    !action.type.includes('ping') &&
    !isFilterAction(action.type);

export const isPendingAction =
    (prefixs: string[]) =>
    (action: UnknownAction): action is UnknownAction => {
        // Note: this cast to UnknownAction could also be `any` or whatever fits your case best
        return (
            prefixs.find((prefix) => action.type.includes(prefix)) !=
                undefined && isPending(action)
        );
    };

export const isRejectedAction =
    (prefixs: string[]) =>
    (action: UnknownAction): action is UnknownAction => {
        // Note: this cast to UnknownAction could also be `any` or whatever fits your case best - like if you had standardized errors and used `rejectWithValue`
        return (
            prefixs.find((prefix) => action.type.includes(prefix)) !=
                undefined && isRejected(action)
        );
    };

export const isFulfilledAction =
    (prefixs: string[]) =>
    (action: UnknownAction): action is UnknownAction => {
        return (
            prefixs.find((prefix) => action.type.includes(prefix)) !=
                undefined && isFulfilled(action)
        );
    };

export async function BuilderHelper<T, U, V>(
    builder: ActionReducerMapBuilder<T>,
    ...handlers: {
        fetch: AsyncThunk<U, V, any>;
        hander: CaseReducer<
            T,
            PayloadAction<
                U,
                string,
                { arg: V; requestId: string; requestStatus: 'fulfilled' },
                never
            >
        >;
    }[]
) {
    let after = builder;

    handlers.forEach(
        (x) => (after = after.addCase(x.fetch.fulfilled, x.hander))
    );

    after
        // use scoped matchers to handle generic loading / error setting behavior for async thunks this slice cares about
        .addMatcher(
            isPendingAction(handlers.map((x) => x.fetch.typePrefix)),
            (state, action) => {
                const notify = async () =>
                    appDispatch(
                        popup_open({
                            type: 'notify',
                            data: { loading: true }
                        })
                    );

                setTimeout(notify, 100);
            }
        )
        .addMatcher(
            isRejectedAction(handlers.map((x) => x.fetch.typePrefix)),
            (state, action) => {
                const notify = async () => {
                    appDispatch(
                        popup_open({
                            type: 'complete',
                            data: {
                                success: false,
                                content: formatError(action.error)
                            }
                        })
                    );

                    await new Promise((r) => setTimeout(r, 10000));
                    appDispatch(popup_close());
                    appDispatch(popup_close());
                };

                setTimeout(notify, 100);
            }
        )
        .addMatcher(
            isFulfilledAction(handlers.map((x) => x.fetch.typePrefix)),
            (state, action) => {
                const notify = async () => {
                    appDispatch(
                        popup_open({
                            type: 'complete',
                            data: {
                                success: true,
                                content: 'Request completed!'
                            }
                        })
                    );

                    await new Promise((r) => setTimeout(r, 2000));
                    appDispatch(popup_close());
                    appDispatch(popup_close());
                };

                setTimeout(notify, 100);
            }
        );
}

export async function Confirms(): Promise<void> {
    throw 'not confirmed';
}
