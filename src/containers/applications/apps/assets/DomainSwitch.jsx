import { preloadSilent } from '../../../../backend/actions/background';
import { useAppSelector } from '../../../../backend/reducers';

function DomainSwitch() {
    const domain = useAppSelector((state) => state.worker.currentAddress);
    const availableDomains = useAppSelector((state) => state.globals.domains);

    const updateLanguage = async (e) => {
        const domain = e.target.value;
        const listDomain = ['play.thinkmay.net', 'play.3.thinkmay.net'];
        const v2_domain = ['play.2.thinkmay.net', 'v4.thinkmay.net'];
        if (listDomain.includes(domain))
            window.open(`https://${domain}`, '_self');
        else if (v2_domain.includes(domain)) {
            localStorage.setItem('thinkmay_domain', domain);
            await preloadSilent();
        }
    };

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={domain} onChange={updateLanguage} className="w-28">
                {availableDomains.map((domain, index) => (
                    <option key={index} value={domain.domain}>
                        {domain.domain.replaceAll('.thinkmay.net', '')}{' '}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DomainSwitch;
