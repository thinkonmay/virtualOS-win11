import { createSlice } from '@reduxjs/toolkit';
import { Contents } from './locales';

const initialState = {
    hide: true,
    list: {
        [Contents.QA_CLOUDPC]: [
            {
                ques: 'Cloud PC là gì?',
                ans: 'Dịch vụ Cloud PC của Thinkmay cung cấp khả năng truy cập máy tính cấu hình cao từ xa qua Internet, giúp người dùng sở hữu "máy tính trên mây" cấu hình cao mà không cần chi phí đầu tư phần cứng, cùng như dễ dàng nâng cấp tài nguyên theo nhu cầu. '
            },
            {
                ques: 'Ngoài chơi game, Thinkmay Cloud PC có thể được sử dụng để làm gì?',
                ans: 'Với bản chất là một máy tính cấu hình cao, Thinkmay Cloud PC có thể được sử dụng cho toàn bộ tác vụ của một máy tính bình thường, bao gồm chơi game, edit video, xử lý đồ họa, thậm trí đào tạo AI.'
            }
        ],
        [Contents.QA_INSTALLGAMES]: [
            {
                ques: 'Làm sao để bắt đầu chơi game trên Thinkmay?',
                ans: 'Bạn cần tải game về máy để bắt đầu chơi game. Việc tải game hoàn toàn giống như quá trình tải game ở máy tính cá nhân của bạn vậy.'
            },
            {
                ques: 'Có hỗ trợ game crack/ mod không?',
                ans: 'Thinkmay không cấm crack/ mod game, tuy nhiên tụi mình sẽ không nhận trách nhiệm trong việc gặp lỗi khi chơi game crack. Bạn hãy lựa chọn nguồn tải uy tín và an toàn nhé.'
            },
            {
                ques: 'Được tải bao nhiêu game?',
                ans: 'Bạn có thể cài game tuỳ thích trong phạm vi 150GB, có thể mua thêm dung lượng nếu muốn.'
            },
            {
                ques: '',
                ans: ''
            }
        ],
        [Contents.QA_CONNECTGEARS]: [
            {
                ques: 'Với tay cầm:',
                ans: 'Chỉ cần kết nối tay cầm tới thiết bị của bạn, Thinkmay sẽ tự động nhận'
            },
            {
                ques: 'Với chuột & bàn phím trên điện thoại',
                ans: 'Hiện Thinkmay mới chỉ hỗ trợ được bàn phím, chuột chưa dùng được'
            }
        ]
        //[Contents.QA_FIXLAG]: [
        //    {
        //        ques: '',
        //        ans: ''
        //    },
        //    {
        //        ques: '',
        //        ans: ''
        //    },

        //]
    },
    currentShow: 'cloudPc'
};

export const qaSlices = createSlice({
    name: 'listQa',
    initialState,
    reducers: {
        showQa: (state) => {
            state.hide = false;
            // state.pwctrl = false
        },
        hideQa: (state) => {
            state.hide = true;
            // state.pwctrl = false
        },
        toggleQa: (state) => {
            state.hide = !state.hide;
            // state.pwctrl = false
        }
    }
});
