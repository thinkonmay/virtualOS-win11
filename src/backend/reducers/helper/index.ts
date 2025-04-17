import {
    ActionReducerMapBuilder,
    AsyncThunk,
    CaseReducer,
    PayloadAction,
    UnknownAction
} from '@reduxjs/toolkit';

import { appDispatch, popup_close, popup_open } from '..';
import toast from 'react-hot-toast';

const filterActions = [
    'change_template',
    'change_node',
    'unclaim_volume',
    'worker_refresh_ui'
];
const uiAction = (acctionType: string) => {
    return filterActions.some((act) => acctionType.includes(act));
};

const isPending = (action: UnknownAction) =>
    action.type.endsWith('/pending') && uiAction(action.type);

const isFulfilled = (action: UnknownAction) =>
    action.type.endsWith('/fulfilled') && uiAction(action.type);

const isRejected = (action: UnknownAction) =>
    action.type.endsWith('/rejected') && uiAction(action.type);

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
                setTimeout(
                    () =>
                        appDispatch(
                            popup_open({
                                type: 'notify',
                                data: { loading: true }
                            })
                        ),
                    100
                );
            }
        )
        .addMatcher(
            isRejectedAction(handlers.map((x) => x.fetch.typePrefix)),
            (state, action: any) => {
                setTimeout(() => appDispatch(popup_close()), 1000);
                toast(`${action.type} failed ${action?.error?.message}`, {
                    className: 'bg-red-200',
                    duration: 10000
                });
            }
        )
        .addMatcher(
            isFulfilledAction(handlers.map((x) => x.fetch.typePrefix)),
            (state, action) => {
                setTimeout(() => appDispatch(popup_close()), 1000);
                toast(`${action.type} success`, {
                    className: 'bg-blue-200',
                    duration: 3000
                });
            }
        );
}
