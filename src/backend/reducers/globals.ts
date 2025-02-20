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
    node: string;
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

const example_game: IGame = {
    name: 'windows',
    code_name: '150',
    node: 'follobuntu',
    metadata: {
        name: 'Windows',
        type: 'windows',
        genres: [],
        screenshots: [],
        movies: [],
        website: '',
        background: '',
        categories: [],
        developers: [],
        drm_notice: 'false',
        publishers: [],
        header_image: '',
        release_date: {
            date: new Date().toUTCString()
        },
        capsule_image: '',
        about_the_game: '',
        background_raw: '',
        capsule_imagev5: '',
        short_description: ''
    }
};
interface Maintain {
    created_at: string;
    ended_at: string;
}

type Domain = {
    domain: string;
    free: number;
};

type TutorialType = 'NewTutorial' | 'PaidTutorial' | 'close';
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
    tutorial: 'close' as TutorialType,
    translation: {} as TranslationResult,
    maintenance: {} as Maintain,
    games: [] as IGame[],
    domains: [] as Domain[],
    opening: null as IGame | null
};

export const globalAsync = {
    fetch_domain: createAsyncThunk(
        'fetch_domain',
        async (): Promise<{ domain: string; free: string }[]> => {
            const { data: domains, error } = await GLOBAL().rpc(
                'get_domains_availability'
            );
            if (error) throw error;

            return (
                await Promise.all(
                    domains.map(
                        async (dom: { domain: string; free: string }) => {
                            let signal: AbortSignal = undefined;
                            try {
                                const controller = new AbortController();
                                setTimeout(controller.abort, 2000);
                                signal = controller.signal;
                            } catch {}

                            try {
                                const { ok } = await fetch(
                                    `https://${dom.domain}`,
                                    { signal }
                                );
                                if (!ok) throw new Error('not ok');
                            } catch (err) {
                                UserEvents({
                                    type: 'domain/test_fail',
                                    payload: { ...dom, error: err }
                                });
                                return null;
                            }
                            return dom;
                        }
                    )
                )
            ).filter((dom) => dom != null);
        }
    ),
    fetch_store: createAsyncThunk('fetch_store', async () => {
        const sub = store.getState().user.subscription;
        const { data, error } = await GLOBAL()
            .from('stores')
            .select('code_name,name,metadata,type');
        if (error) throw new Error(error.message);
        return [];
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
        show_tutorial: (state, action: PayloadAction<TutorialType>) => {
            state.tutorial = action.payload;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(
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
