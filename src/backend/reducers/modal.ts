export type ExtendMsg =
    | {
          type: 'date_limit';
      }
    | {
          type: 'time_limit';
      }
    | {
          type: 'near_time_limit';
          available_time: number;
      }
    | {
          type: 'near_date_limit';
          available_time: number;
      };

type PopupData =
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
          data: ExtendMsg;
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
          };
      }
    | {
          type: 'share';
          data: {
              ref?: string;
              discount_code?: string;
          };
      }
    | {
          type: 'discount';
          data: {
              code: string;
              from: string;
              to: string;
              percentage: number;
          };
      }
    | {
          type: 'paymentQR';
          data: {
              id: number;
              code: string;
              url: string;
              accountName: string;
              amount: number;
              description: string;
              discount_percent: number;
          };
      }
    | {
          type: 'info';
          data: {
              title: string;
              text: any;
          };
      }
    | {
          type: 'serversInfo';
          data: {
              domains: any[];
          };
      }
    | {
          type: 'pocketNotEnoughMoney';
          data: {
              plan_name: string;
              plan_price: number;
          };
      }
    | {
          type: 'pocketChangePlan';
          data: {
              plan_name: string;
              plan_price: number;
              plan_title: string;
              oldPlanId: string;
              isRenew?: boolean;
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
            state.data_stack = [];
        }
    }
});
