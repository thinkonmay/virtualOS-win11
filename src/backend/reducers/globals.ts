import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, store } from '.';
import { GLOBAL, UserEvents } from '../../../src-tauri/api';
import { BuilderHelper } from './helper';
import { Contents, Languages, language } from './locales';
export type Translation = Map<Languages, Map<Contents, string>>;
const translation = language();

export type TranslationResult = {
    [key in Contents]: string;
};

type IGame = {
    name: string;
    code_name: string;
    publishers: any;
    short_description: any;
    path_full: any;
    tag: {
        samenode: boolean;
        hasaccount: boolean;
    };
};

interface Maintain {
    created_at: string;
    ended_at: string;
}

type Domain = {
    domain: string;
    free: number;
};

const initialState = {
    lays: [
        [
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: '50%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '66%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '34%',
                    height: '100%',
                    top: 0,
                    left: '66%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '33%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '34%',
                    height: '100%',
                    top: 0,
                    left: '33%'
                },
                br: 1
            },
            {
                dim: {
                    width: '33%',
                    height: '100%',
                    top: 0,
                    left: '67%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%'
                },
                br: 3
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%'
                },
                br: 5
            }
        ],
        [
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: 0
                },
                br: 2
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%'
                },
                br: 3
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: 0
                },
                br: 7
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%'
                },
                br: 5
            }
        ],
        [
            {
                dim: {
                    width: '25%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: '25%'
                },
                br: 1
            },
            {
                dim: {
                    width: '25%',
                    height: '100%',
                    top: 0,
                    left: '75%'
                },
                br: 15
            }
        ]
    ],

    service_available: false,
    tutorial: false,
    translation: {} as TranslationResult,
    maintenance: {} as Maintain,
    games: [] as IGame[],
    domains: [] as Domain[],
    opening: null as IGame | null,
    chat: false as boolean
};

type Data = {
    games: IGame[];
    domains: Domain[];
};

export const globalAsync = {
    fetch_domain: createAsyncThunk(
        'fetch_domain',
        async (): Promise<Domain[]> => {
            const { data: domains_v3, error: err } = await GLOBAL().rpc(
                'get_domains_availability_v3'
            );
            if (err) throw err;
            else return domains_v3;
        }
    ),
    update_game_tag: createAsyncThunk(
        'update_game_tag',
        async (): Promise<string[]> => {
            const { data: tree, currentAddress } = store.getState().worker;
            const volumes = tree[currentAddress]?.Volumes;
            if (volumes == undefined || volumes.length == 0) return [];

            const node = volumes.find((x) => x.pool == 'user_data')?.node;
            if (node == undefined) return [];

            const samenodes = volumes
                .filter((x) => x.node == node && x.pool == 'app_data')
                .map((x) => x.name);

            return samenodes;
        }
    ),
    fetch_store: createAsyncThunk('fetch_store', async (): Promise<IGame[]> => {
        const { data, error } = await GLOBAL()
            .from('stores')
            .select(
                'code_name,name,metadata->publishers,metadata->short_description,metadata->screenshots->0->>path_full,management->>kickey'
            )
            .not('metadata->screenshots->0->>path_full', 'is', null);
        if (error) throw new Error(error.message);

        return data.map((x) => ({
            ...x,
            tag: {
                samenode: false,
                hasaccount: x.kickey == 'true'
            }
        }));
    })
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        update_language: (state, action: PayloadAction<Languages>) => {
            translation.forEach((val, key) => {
                if (key != action.payload) return;

                val.forEach((val, key) => {
                    state.translation[key] = val;
                });
            });
        },
        open_game: (state, payload: PayloadAction<IGame>) => {
            state.opening = payload.payload;
        },
        show_chat: (state, payload: PayloadAction<boolean | undefined>) => {
            if ((window as any).LiveChatWidget != undefined)
                (window as any).LiveChatWidget.call('maximize');
        },
        show_tutorial: (
            state,
            action: PayloadAction<'open' | 'close' | undefined>
        ) => {
            if (action.payload) state.tutorial = action.payload == 'open';
            else state.tutorial = !state.tutorial;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(
            builder,
            {
                fetch: globalAsync.fetch_store,
                hander: (state, action: PayloadAction<IGame[]>) => {
                    state.games = action.payload;
                }
            },
            {
                fetch: globalAsync.update_game_tag,
                hander: (state, action: PayloadAction<string[]>) => {
                    state.games = state.games.map((x) => ({
                        ...x,
                        tag: {
                            ...x.tag,
                            samenode: action.payload.includes(
                                `${x.code_name}.template`
                            )
                        }
                    }));
                }
            },
            {
                fetch: globalAsync.fetch_domain,
                hander: (state, action: PayloadAction<Domain[]>) => {
                    state.domains = action.payload;
                }
            }
        );
    }
});
