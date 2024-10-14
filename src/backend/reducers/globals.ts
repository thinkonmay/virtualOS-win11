import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LOCAL } from '../../../src-tauri/api';
import { PlanName } from '../utils/constant';
import { BuilderHelper } from './helper';
import { Contents, Languages, language } from './locales';
export type Translation = Map<Languages, Map<Contents, string>>;
const translation = language();

const gameDB: SubscriptionSelection[] = [
    {
        name: 'Window 10',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Windows_logo_-_2012.png',
        template: undefined
    },
    {
        name: 'Black Myth Wukong',
        logo: 'https://professorvn.net/wp-content/uploads/2024/09/logo.png',
        template: 'wukong'
    },
    {
        name: 'FC Online',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXVIF_Dk5lR8MrlpA8Pu8DuYW07dcF5sBpw&s',
        template: 'fc_online'
    }
];

export type TranslationResult = {
    [key in Contents]: string;
};
interface IGame {
    name: string;
    logo: string;
    publisher: string;
    created_at: string;
    metadata: {
        hide: boolean;
    };
}
interface Maintain {
    created_at: string;
    ended_at: string;
    isMaintaining?: boolean;
}
type SubscriptionSelection = {
    planName?: PlanName;
    template?: string;
    name: string;
    logo: string;
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
    apps: [],
    games: [] as IGame[],
    gameChooseSubscription: gameDB[0],
    gamesInSubscription: gameDB
};

export const globalAsync = {
    fetch_store: createAsyncThunk('fetch_store', async () => {
        return [] as IGame[];
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
        choose_game: (state, action: PayloadAction<SubscriptionSelection>) => {
            state.gameChooseSubscription = action.payload;
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
                    state.games = action.payload.filter(
                        (g) => g.metadata?.hide != true
                    );
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
