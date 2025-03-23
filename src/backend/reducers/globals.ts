import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { store } from '.';
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
    metadata: {
        name: string;
        type: string;
        genres: {
            id: string;
            description: string;
        }[];
        movies: {
            id: number;
            webm: {
                max: string;
            };
            mp4: {
                max: string;
            };
            name: string;
            thumbnail: string;
        }[];
        website: string;
        background: string;
        categories: {
            id: number;
            description: string;
        }[];
        developers: string[];
        drm_notice: string;
        publishers: string[];
        screenshots: {
            id: number;
            path_full: string;
            path_thumbnail: string;
        }[];
        header_image: string;
        release_date: {
            date: string;
        };
        capsule_image: string;
        about_the_game: string;
        background_raw: string;
        capsule_imagev5: string;
        short_description: string;
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
    fetch_store: createAsyncThunk('fetch_store', async (): Promise<IGame[]> => {
        const { data: tree, currentAddress } = store.getState().worker;
        const node = tree[currentAddress]?.Volumes?.find(
            (x) => x.pool == 'user_data'
        ).node;
        const samenodes = tree[currentAddress]?.Volumes?.filter(
            (x) => x.node == node
        )?.map((x) => x.name.replaceAll('.template', ''));
        const { data, error } = await GLOBAL()
            .from('stores')
            .select('code_name,name,metadata')
            .in('code_name', samenodes ?? []);
        if (error) throw new Error(error.message);

        return data;
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
        show_chat: (state) => {
            state.chat = !state.chat;
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
                fetch: globalAsync.fetch_domain,
                hander: (state, action: PayloadAction<Domain[]>) => {
                    state.domains = action.payload;
                }
            }
        );
    }
});
