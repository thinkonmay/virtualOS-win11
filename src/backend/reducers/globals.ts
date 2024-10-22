import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { store } from '.';
import { LOCAL } from '../../../src-tauri/api';
import { PlanName } from '../utils/constant';
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
    apps: [],
    games: [] as IGame[]
};

export const globalAsync = {
    fetch_store: createAsyncThunk('fetch_store', async () => {
        const sub = store.getState().user.subscription;

        const { data, error } = await LOCAL().rpc('get_store_availability');
        if (error) throw new Error(error.message);
        if (sub.status == 'PAID' || sub.status == 'IMPORTED')
            return (data as IGame[]).filter((x) => x.node == sub.node);
        else {
            const res: IGame[] = [];
            (data as IGame[]).forEach((x) =>
                res.push(
                    ...(res.find((y) => y.code_name == x.code_name) ? [] : [x])
                )
            );
            return res;
        }
    }),
    fetch_under_maintenance: createAsyncThunk(
        'fetch_under_maintenance',
        async () => {
            const {
                data: [_data],
                error
            } = await LOCAL()
                .from('constant')
                .select('value')
                .eq('name', 'mantainance');
            if (error) throw new Error(error.message);
            else if (_data == undefined) return {};

            const { value: info } = _data;
            return info != undefined &&
                new Date() > new Date(info.created_at) &&
                new Date() < new Date(info.ended_at)
                ? {
                      ...info,
                      isMaintaining: true
                  }
                : {};
        }
    )
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
        update_store_data: (state, payload: any) => {
            state.games = payload;
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
                fetch: globalAsync.fetch_under_maintenance,
                hander: (state, action: PayloadAction<Maintain>) => {
                    state.maintenance = action.payload;
                }
            }
        );
    }
});
