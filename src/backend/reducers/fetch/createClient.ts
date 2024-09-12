import PocketBase from 'pocketbase';
import { createClient } from '@supabase/supabase-js';

export enum CAUSE {
    UNKNOWN,
    OUT_OF_HARDWARE,
    MAXIMUM_DEPLOYMENT_REACHED,
    INVALID_AUTH_HEADER,
    API_CALL,
    LOCKED_RESOURCE,
    VM_BOOTING_UP,
    PERMISSION_REQUIRED,
    NEED_WAIT,
    INVALID_REQUEST,
    REMOTE_TIMEOUT,

    INVALID_REF
}

export function getDomainURL(): string {
    return window.location.host.includes('localhost') ||
        window.location.host.includes('tauri.localhost')
        ? 'https://play.thinkmay.net'
        : window.location.origin;
}
export function getDomain(): string {
    return window.location.host.includes('localhost') ||
        window.location.host.includes('tauri.localhost')
        ? 'play.thinkmay.net'
        : window.location.host;
}

const supabaseUrl = getDomainURL();
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzIzMTM2NDAwLAogICJleHAiOiAxODgwOTAyODAwCn0.SdW2AcXzhRFNBt9HmJw6sKa7lWDmVjbXdRF1mIjrDao';

export const pb = new PocketBase(getDomainURL());
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function SupabaseFuncInvoke<T>(
    funcName: string,
    body?: any,
    headers?: any
): Promise<Error | T> {
    try {
        const response = await fetch(
            `${supabaseUrl}/functions/v1/${funcName}`,
            {
                body: JSON.stringify(body ?? {}),
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${supabaseKey}`
                }
            }
        );
        if (response.ok === false) return new Error(await response.text());

        const data = (await response.json()) as T;
        return data;
    } catch (error: any) {
        return new Error(error.message);
    }
}
