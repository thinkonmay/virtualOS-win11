type PopupData =
    | {
          type: 'complete';
          data: {
              success: boolean;
              content: string | Contents;
          };
      }
    | {
          type: 'guidance';
          data: {
              content: string;
          };
      }
    | {
          type: 'notify';
          data: {
              title?: string;
              loading: boolean;
              tips?: boolean;
              text?: any;
              timeProcessing?: number;
          };
      }
    | {
          type: 'extendService';
          data: {
              to: string;
          };
      }
    | {
          type: 'maintain';
          data: {
              start: string;
              end: string;
          };
      }
    | {
          type: 'redirectDomain';
          data: {
              domain: string;
              from: string;
          };
      }
    | {
          type: 'shareLink';
          data: {
              link: string;
          };
      };

type Data = {
    data_stack: PopupData[];
};

const initialState: Data = {
    data_stack: []
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Contents } from './locales';
export const modalSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        popup_open: (state, action: PayloadAction<PopupData>) => {
            state.data_stack = [...state.data_stack, action.payload];
        },
        popup_close: (state) => {
            const preferred = ['extendService', 'redirectDomain', 'maintain'];
            //const preferred_title = 'Connect to PC';

            state.data_stack = [];
            //const rm = state.data_stack.findIndex(
            //    (x) =>
            //        !preferred.includes(x.type)
            //    //&&
            //    //!(x.type == 'notify' && x.data.title == preferred_title)
            //);

            //state.data_stack = state.data_stack.filter(
            //    (val, index) => index != (rm != -1 ? rm : 0)
            //);
        }
    }
});
