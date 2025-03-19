import { preload } from '../../../../backend/actions/background';
import { useAppSelector } from '../../../../backend/reducers';

function DomainSwitch() {
    const domain = useAppSelector((state) => state.worker.currentAddress);

    const updateLanguage = (e) => {
        const domain = e.target.value;
        const listDomain = ['play.thinkmay.net', 'play.3.thinkmay.net'];
        const v2_domain = ['play.2.thinkmay.net', 'v4.thinkmay.net'];
        if (listDomain.includes(domain))
            window.open(`https://${domain}`, '_self');
        else if (v2_domain.includes(domain)) {
            localStorage.setItem('thinkmay_domain', domain);
            preload(false);
        }
    };

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={domain} onChange={updateLanguage}>
                <option value="play.thinkmay.net">play</option>
                <option value="play.2.thinkmay.net">play.2</option>
                <option value="play.3.thinkmay.net">play.3</option>
                <option value="v4.thinkmay.net">v4</option>
            </select>
        </div>
    );
}

export default DomainSwitch;
