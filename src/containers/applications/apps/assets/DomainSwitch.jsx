import { useAppSelector } from '../../../../backend/reducers';

function DomainSwitch() {
    const domain = useAppSelector((state) => state.worker.currentAddress);

    const updateLanguage = (e) => {
        localStorage.setItem('thinkmay_domain', e.target.value);
        window.location.reload();
    };

    return (
        <div className="langSwitcher langSwitcherTile">
            <select value={domain} onChange={updateLanguage}>
                <option value="play.thinkmay.net">play</option>
                <option value="play.2.thinkmay.net">play.2</option>
                <option value="play.3.thinkmay.net">play.3</option>
            </select>
        </div>
    );
}

export default DomainSwitch;
