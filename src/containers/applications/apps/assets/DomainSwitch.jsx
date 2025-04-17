import { preloadSilent } from '../../../../backend/actions/background';
import { useAppSelector } from '../../../../backend/reducers';

function DomainSwitch() {
    const domain = useAppSelector((state) => state.worker.currentAddress);
    const availableDomains = useAppSelector((state) => state.globals.domains);

    const updateLanguage = async (e) => {
        const domain = e.target.value;
        if (domain != null) localStorage.setItem('thinkmay_domain', domain);
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
