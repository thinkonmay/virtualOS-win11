import { useLayoutEffect, useState } from 'react';
import { appDispatch, update_language } from '../../../../backend/reducers';
import { localStorageKey } from '../../../../backend/utils/constant';

export const allowed_language = ['ENG', 'VN', 'ID'];
function LangSwitch() {
    const [languageValue, setLanguageValue] = useState('');

    useLayoutEffect(() => {
        let languageLocal =
            localStorage.getItem(localStorageKey.language) ?? 'VN';
        if (!allowed_language.includes(languageLocal)) languageLocal = 'ENG';

        setLanguageValue(languageLocal);
        appDispatch(update_language(languageLocal));
    }, []);

    const updateLanguage = (e) => {
        const language = e.target.value;
        if (!allowed_language.includes(language)) return;

        localStorage.setItem('language', language);
        setLanguageValue(language);
        appDispatch(update_language(language));
    };
    return (
        <div className="langSwitcher langSwitcherTile">
            <select
                value={languageValue}
                onChange={updateLanguage}
                className="w-28"
            >
                <option value="ENG">English</option>
                <option value="VN">Vietnamese</option>
                <option value="ID">Indonesian</option>
            </select>
        </div>
    );
}

export default LangSwitch;
