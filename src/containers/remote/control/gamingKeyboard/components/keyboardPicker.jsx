import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import {
    add_key_gamingKeyboard,
    appDispatch,
    useAppSelector
} from '../../../../../backend/reducers';
import './index.scss';

export const KeyboardPicker = () => {
    const [oldPos, setOldPos] = useState(0.05);
    const isOpen = useAppSelector(
        (state) =>
            state.sidepane.mobileControl.gamingKeyBoard.editState == 'addingKey'
    );

    const handleKeyPress = (button) => {
        setOldPos((old) => {
            const newPos = old + 0.05;
            return newPos;
        });

        appDispatch(
            add_key_gamingKeyboard({
                name: button.toUpperCase(),
                value: button,
                position: {
                    x: oldPos + 0.05,
                    y: 0.15
                }
            })
        );
    };

    const handleKeyReleased = (button) => { };
    return (
        <div
            id="keyboard"
            className={`keyboardPicker ${isOpen ? 'slide-in' : 'slide-out'} `}
        >
            <Keyboard
                onKeyPress={handleKeyPress}
                onKeyReleased={handleKeyReleased}
                disableButtonHold={true}
                display={{
                    Control: 'Ctrl',
                    Backspace: 'Back',
                    Close: '&#x2715;',
                    Up: '&#x2191;',
                    Left: '&#x2190;',
                    Down: '&#x2193;',
                    Right: '&#x2192;',
                    Capslock: 'Caps',
                    Escape: 'Esc'
                }}
                layout={{
                    default: [
                        'Escape F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12',
                        '` 1 2 3 4 5 6 7 8 9 0 - = Backspace',
                        'Tab Q W E R T Y U I O P { } | ',
                        'Capslock A S D F G H J K L : " Enter',
                        'Shift Z X C V B N M < > / Up ',
                        'Control Alt Space        Left Down Right'
                    ]
                }}
            />
        </div>
    );
};
