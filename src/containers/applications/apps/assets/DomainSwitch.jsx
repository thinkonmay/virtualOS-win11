import { preloadSilent } from '@/backend/actions/background';
import {
    appDispatch,
    cache_setting,
    remote_domain,
    useAppSelector
} from '@/backend/reducers';

export function DomainSwitch() {
    const domain = useAppSelector((state) => state.worker.currentAddress);
    const availableDomains = useAppSelector((state) => state.globals.domains);

    const updateDomain = async (e) => {
        const domain = e.target.value;
        localStorage.setItem('thinkmay_domain', domain);
        await preloadSilent();
    };

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={domain} onChange={updateDomain} className="w-28">
                {availableDomains.map((domain, index) => (
                    <option key={index} value={domain.domain}>
                        {domain.domain.replaceAll('.thinkmay.net', '')}{' '}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function Routing() {
    const domain = useAppSelector((state) => state.remote.domain);
    const availableDomains = useAppSelector((state) => state.globals.domains);

    const updateRouting = async (e) => {
        const domain = e.target.value;
        appDispatch(remote_domain(domain));
        await appDispatch(cache_setting());
    };

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={domain} onChange={updateRouting} className="w-28">
                {availableDomains.map((domain, index) => (
                    <option key={index} value={domain.domain}>
                        {domain.domain.replaceAll('.thinkmay.net', '')}{' '}
                    </option>
                ))}
            </select>
        </div>
    );
}
