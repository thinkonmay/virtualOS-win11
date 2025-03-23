export const isDevEnv = () => {
    return (
        window.location.hostname == 'localhost' ||
        window.location.hostname == 'tauri.localhost'
    );
};

export function isIos() {
    return (
        [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
}
