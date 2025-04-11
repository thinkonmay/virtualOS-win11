import { useAppSelector } from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import './listQa.scss';

const list = {
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
};

export const ListQAs = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const hide = useAppSelector((state) => state.startmenu.qahide);
    const align = useAppSelector((state) => state.taskbar.align);

    return (
        <div
            style={{ '--prefix': 'QA' }}
            data-hide={hide}
            data-align={align}
            className="listQAs"
        >
            {Object.keys(list).map((key, index) => (
                <div key={index} className="mb-4">
                    <div className="font-bold text-xl">{t[key]}</div>
                    {list[key].map((x, index) => (
                        <div key={index}>
                            <div className="font-medium text-l">{x.ques}</div>
                            <div className="font-light text-sm">{x.ans}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
