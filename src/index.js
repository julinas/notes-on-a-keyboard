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

document.onkeypress = handleKeyPress;

ReactDOM.render(<App />, document.getElementById('root'));

