import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import useSound from 'use-sound';
import { useShift } from '../../../../../src-tauri/core';
import { keyboard } from '../../../../../src-tauri/singleton';
import {
    appDispatch,
    toggle_keyboard,
    useAppSelector
} from '../../../../backend/reducers';
import './index.scss';
import ringSound from '/audio/keyboard.mp3';

export const VirtKeyboard = () => {
    const [layoutName, setLayoutName] = useState('default');
    const [play] = useSound(ringSound, { volume: 0.3, playbackRate: 2 });

    const keyboardShow = useAppSelector(
        (state) => !state.sidepane.mobileControl.keyboardHide
    );
    const [writing, setWriting] = useState([]);
    const handleKeyPress = async (button) => {
        if (button == '') {
            appDispatch(toggle_keyboard());
            setWriting([]);
            return;
        }
        if (button === 'Close') {
            appDispatch(toggle_keyboard());
            setWriting([]);

            return;
        }
        keyboard(
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

        play();
        if (button === 'Shift')
            setLayoutName(layoutName === 'default' ? 'shift' : 'default');

        if (!blacklist.includes(button) && button !== 'Space') {
            setWriting((prev) => {
                const oldPrev = [...prev];
                oldPrev.push(button);
                return oldPrev;
            });
        }
        if (button == 'Backspace') {
            setWriting((prev) => {
                const oldPrev = [...prev];
                oldPrev.pop();
                return oldPrev;
            });
        } else if (button == 'Space') {
            setWriting((prev) => {
                const oldPrev = [...prev];
                oldPrev.push(<>&nbsp;</>);
                return oldPrev;
            });
        }
    };

    const handleKeyReleased = (button) => {};
    return (
        <div id="keyboard" className={'virtKeyBoard slide-in'}>
            <audio src={ringSound}></audio>

            {writing.length > 0 ? (
                <div className="history">
                    <p className="content ">
                        {writing.map((t) => (
                            <>{t}</>
                        ))}
                    </p>
                </div>
            ) : null}

            <Keyboard
                layoutName={layoutName}
                onKeyPress={handleKeyPress}
                onKeyReleased={handleKeyReleased}
                disableButtonHold={true}
                display={{
                    Control: 'Ctrl',
                    Backspace: 'Del',
                    Close: '&#x2715;',
                    Shift: 'A@#!'
                }}
                layout={{
                    default: [
                        'F1 F2 F3 F4 F5             F6 F7 F8 F9 F10 F11 F12',
                        '` 1 2 3 4 5 6          7 8 9 0 - = Backspace',
                        'q w e r t              y u i o p [ ] \\ Shift',
                        "a s d f g            h j k l ; ' Enter",
                        'z x c v            b n m , . /',
                        'Space          Close        Space'
                    ],
                    shift: [
                        'F1 F2 F3 F4 F5             F6 F7 F8 F9 F10 F11 F12',
                        '~ ! @ # $ % ^          & * ( ) _ + Backspace',
                        'Q W E R T              Y U I O P { } | Shift',
                        'A S D F G            H J K L : " Enter',
                        'Z X C V            B N M < > ?',
                        'Space          Close        Space'
                    ]
                }}
            />
        </div>
    );
};

const blacklist = [
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'Backspace',
    'Shift',
    'Enter',
    'Alt',
    'Close',
    'Control'
];
