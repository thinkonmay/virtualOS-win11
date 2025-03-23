import { menuDispatch } from '../../backend/actions';
import { useAppSelector } from '../../backend/reducers';
import { Icon } from '../shared/general';
import './menu.scss';

export const ActMenu = () => {
    const menu = useAppSelector((state) => state.menus);
    const menudata = useAppSelector((state) => state.menus.data);

    const { abpos, isLeft } = useAppSelector((state) => {
        var acount = state.menus.data.data?.length;
        var tmpos = {
                top: state.menus.top,
                left: state.menus.left
            },
            tmpleft = false;

        var wnwidth = window.innerWidth,
            wnheight = window.innerHeight;

        var ewidth = 312,
            eheight = acount * 28;

        tmpleft = wnwidth - tmpos.left > 504;
        if (wnwidth - tmpos.left < ewidth) {
            tmpos.left = wnwidth - ewidth;
        }

        if (wnheight - tmpos.top < eheight) {
            tmpos.bottom = wnheight - tmpos.top;
            tmpos.top = null;
        }

        return {
            abpos: tmpos,
            isLeft: tmpleft
        };
    });

    const menuclickDispatch = (event) => {
        event.stopPropagation();
        menuDispatch(event);
    };

    const menuobj = (data, parentId) => {
        var mnode = [];

        data.map((opt, i) => {
            if (opt.type == 'hr') {
                mnode.push(<div key={i} className="menuhr"></div>);
            } else {
                mnode.push(
                    <div
                        key={i}
                        className="menuopt"
                        data-dsb={opt.dsb}
                        onClick={menuclickDispatch}
                        data-action={opt.action}
                        data-payload={opt.payload}
                        data-pid={parentId}
                    >
                        {menudata.ispace != false ? (
                            <div className="spcont">
                                {opt.icon && opt.type == 'svg' ? (
                                    <Icon icon={opt.icon} width={16} />
                                ) : null}
                                {opt.icon && opt.type == null ? (
                                    <Icon src={opt.icon} width={16} />
                                ) : null}
                            </div>
                        ) : null}
                        <div className="nopt">{opt.name}</div>
                        {opt.opts ? (
                            <div
                                className="minimenu"
                                style={{
                                    minWidth: menudata.secwid
                                }}
                            >
                                {menuobj(opt.opts)}
                            </div>
                        ) : null}
                    </div>
                );
            }
        });

        return mnode;
    };

    return (
        <div
            className="actmenu"
            id="actmenu"
            style={{
                ...abpos,
                '--prefix': 'MENU',
                width: menudata.width
            }}
            data-hide={menu.hide}
            data-left={isLeft}
        >
            {menuobj(menudata.data, menu?.dataset?.id)}
        </div>
    );
};

export default ActMenu;
