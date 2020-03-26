import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const codes = {
    "Backquote": '`',
    "Digit1": '1',
    "Digit2": '2',
    "Digit3": '3',
    "Digit4": '4',
    "Digit5": '5',
    "Digit6": '6',
    "Digit7": '7',
    "Digit8": '8',
    "Digit9": '9',
    "Digit0": '0',
    "Minus": '-',
    "Equal": '=',
    "KeyQ": 'Q',
    "KeyW": 'W',
    "KeyE": 'E',
    "KeyR": 'R',
    "KeyT": 'T',
    "KeyY": 'Y',
    "KeyU": 'U',
    "KeyI": 'I',
    "KeyO": 'O',
    "KeyP": 'P',
    "BracketLeft": '[',
    "BracketRight": ']',
    "KeyA": 'A',
    "KeyS": 'S',
    "KeyD": 'D',
    "KeyF": 'F', 
    "KeyG": 'G', 
    "KeyH": 'H', 
    "KeyJ": 'J', 
    "KeyK": 'K', 
    "KeyL": 'L',
    "Semicolon": ';',
    "Quote": '\'', 
    "KeyZ": 'Z', 
    "KeyX": 'X',
    "KeyC": 'C', 
    "KeyV": 'V', 
    "KeyB": 'B', 
    "KeyN": 'N', 
    "KeyM": 'M', 
    "Comma": ',',
    "Period": '.',
    "Slash": '/',
    "Space": ' '
}

const handleKeyPress = (event) => {
    if (event.key) {
        let key = codes[event.code];
        key = document.getElementById(key);
        if (key != null) {
            key.click();
        }
    }
}

const handleKeyDown = (event) => {
    if (event.code) {
        if (event.code === "ShiftLeft") {
            let shift = document.getElementById("\#");
            let keyboard = document.getElementById("keyboard");
            if (shift != null && 
                keyboard != null && 
                !keyboard.className.includes("sharp")) {
                shift.click();
            }
        }
    }
}

// There's really no way at all to prevent keyup from being triggered 
// by another key. It's in the browser.
// Still need to propagate from the top because you can't 
// check for e.shiftKey in the triggered click().
const handleKeyUp = (event) => {
    if (event.code) {
        if (event.code === "ShiftLeft") {
            let shift = document.getElementById("\#");
            let keyboard = document.getElementById("keyboard");
            if (shift != null && 
                keyboard != null && 
                keyboard.className.includes("sharp")) {
                shift.click();
            }
        }
    }
}

document.onkeypress = handleKeyPress;
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

ReactDOM.render(<App/>, document.getElementById('root'));

