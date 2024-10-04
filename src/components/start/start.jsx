import { useAppSelector } from '../../backend/reducers';
import UserInfo from '../shared/userInfo';

export const StartMenu = () => {
    const { align } = useAppSelector((state) => state.taskbar);
    const start = useAppSelector((state) => state.startmenu);

    return (
        <div
            className="startMenu dpShad"
            data-hide={start.hide}
            data-align={align}
            style={{ '--prefix': 'START' }}
        >
            <UserInfo></UserInfo>
        </div>
    );
};
