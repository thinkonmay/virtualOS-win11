import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useShift } from '../../../../../src-tauri/core';
import { keyboard } from '../../../../../src-tauri/singleton';
import { appDispatch, toggle_keyboard } from '../../../../backend/reducers';
import './index.scss';

export const VirtKeyboard = () => {
    const [layoutName, setLayoutName] = useState('default');

    const handleKeyPress = async (button) => {
        await keyboard(
            ...(useShift(button)
                ? [
                      { val: 'Shift', action: 'down' },
                      { val: button, action: 'down' },
                      { val: button, action: 'up' },
                      { val: 'Shift', action: 'up' }
                  ]
                : [
                      { val: button, action: 'down' },
                      { val: button, action: 'up' }
                  ])
        );

        if ('vibrate' in navigator) navigator.vibrate([40, 30, 0]);
        if (button === 'Enter' || button == 'Close')
            appDispatch(toggle_keyboard());
        if (button === 'Shift')
            setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    };

    const handleKeyReleased = (button) => {};
    return (
        <div id="keyboard" className={'virtKeyBoard slide-in'}>
            <Keyboard
                layoutName={layoutName}
                onKeyPress={handleKeyPress}
                onKeyReleased={handleKeyReleased}
                disableButtonHold={true}
                display={{
                    Backspace: '⌫',
                    Close: '🅇',
                    Control: 'Ctrl',
                    Enter: '⏎'
                }}
                layout={{
                    default: [
                        'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12',
                        'Close ` 1 2 3 4 5 6 7 8 9 0 - = Backspace',
                        'q w e r t y u i o p [ ] \\',
                        "a s d f g h j k l ; ' Enter",
                        'Shift z x c v b n m , . /',
                        'Alt Space Control'
                    ],
                    shift: [
                        'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12',
                        'Close ~ ! @ # $ % ^ & * ( ) _ + Backspace',
                        'Q W E R T Y U I O P { } |',
                        'A S D F G H J K L : " Enter',
                        'Shift Z X C V B N M < > ?',
                        'Alt Space Control'
                    ]
                }}
            />
        </div>
    );
};
