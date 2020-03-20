import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const handleKeyPress = (event) => {
    if (event.key) {
        let key = event.key.toUpperCase();
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
                keyboard.className !== "sharp") {
                shift.click();
            }
        }
    }
}

// There's really no way at all to prevent keyup from being triggered 
// by another key. It's in the browser.
// So there's really no reason to prefer to propagate from the top 
// instead of just checking for event.shiftKey. 
const handleKeyUp = (event) => {
    if (event.code) {
        if (event.code === "ShiftLeft") {
            let shift = document.getElementById("\#");
            let keyboard = document.getElementById("keyboard");
            if (shift != null && 
                keyboard != null && 
                keyboard.className === "sharp") {
                shift.click();
            }
        }
    }
}

document.onkeypress = handleKeyPress;
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

ReactDOM.render(<App/>, document.getElementById('root'));

