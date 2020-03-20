import React from 'react';
import MIDISounds from 'midi-sounds-react';
import './App.css';

const noteNameToNum = (name) => {
    // C C# D D# E F F# G G# A A# B
    // 0 1  2 3  4 5 6  7 8  9 10 11
    // Middle C is +5*12
    let num = 0;
    name = name.split('');
    if (name[0] === "C") num += 0;
    else if (name[0] === "D") num += 2;
    else if (name[0] === "E") num += 4;
    else if (name[0] === "F") num += 5;
    else if (name[0] === "G") num += 7;
    else if (name[0] === "A") num += 9;
    else if (name[0] === "B") num += 11;
            
    let parsed = parseInt(name[1]);
    num += parsed*12;
    
    if (name[2]) {
        if (name[2] === "#") {
            num += 1;
        }
        else if (name[2] === "b") {
            num -= 1;
        }
    }
    return num;  
}

const noteNumToName = (num) => {
    let ones = "C C# D D# E F F# G G# A A# B".split(" ");
    let octave = Math.floor(num / 12);
    let letters = num % 12;
    let note = ones[letters].split("");
    note.splice(1, 0, octave.toString());
    note = note.join("");
    return note;
}

class Key extends React.Component {
    constructor(props) {
        super(props);
        this.toggleActive = this.toggleActive.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setSharp = this.setSharp.bind(this);
        this.state = {
            active: false,
            note: this.props.note
        };
    }
    
    setSharp = (value) => {
        if (value) {
            let num = noteNameToNum(this.props.note);
            if (!isNaN(num)) {
                this.setState({note: noteNumToName(num + 1)});
            }
        }
        else this.setState({note: this.props.note})
    }
    
    handleClick = (e) => {
        if (!this.state.active) {
            if (this.state.note !== " ") {
                this.midiSounds.playChordNow(14, [noteNameToNum(this.state.note)], 0.5);
            }
            this.toggleActive();
            setTimeout(this.toggleActive, 100);
        }
    }
    
    toggleActive = () => {
        this.setState({active: !this.state.active})
    }

    render() {        
        return (
            <React.Fragment>
                <span 
                    id={this.props.data}
                    title={this.props.note}
                    className={this.state.active ? 'active' : null} 
                    onClickCapture={this.handleClick}
                />
                <MIDISounds ref={(ref) => (this.midiSounds = ref)}  instruments={[3]} />	
            </React.Fragment>
        );
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.setSharp = this.setSharp.bind(this);
        this.keys = {};
    }
    
    data = this.props.data.split('');
    notes = this.props.notes.split(',');
    zipped = this.data.map((x, i) => [x, this.notes[i]]);
    
    setSharp = (value) => {
        let indices = Object.keys(this.keys);
        for (let i = 0; i < indices.length; i++) {
            this.keys[indices[i]].current.setSharp(value);
        }
    }
    
    // using base note as id for key
    createRef = (id) => {
        id = id.charCodeAt(0);
        let keyRef = React.createRef(id);
        this.keys[id] = keyRef;
        return keyRef;
    }
    
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    {this.zipped.map(value => (
                        <Key 
                            ref={this.createRef(value[0])}
                            data={value[0]} 
                            key={value[0]} 
                            note={value[1]}
                        />
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

class Keyboard extends React.Component {
    constructor(props) {
        super(props);
        this.toggleSharp = this.toggleSharp.bind(this);
        this.rows = {};
        this.state = {
            sharp: false
        };
    }
    
    toggleSharp = (event) => {
        if (event.target.id !== "\#") {
            return;
        }
        let value = !this.state.sharp;
        this.setState({sharp: value})
        for (let key in Object.keys(this.rows)) {
            this.rows[key].current.setSharp(value);
        }
    }
    
    createRef = (id) => {
        let rowRef = React.createRef(id);
        this.rows[id] = rowRef;
        return rowRef;
    }
    
    // recaculate name of notes 
    calculateNotes = (notes, sharp) => {
        // recalculate names for correct octave 
        // i.e. if no octave, set to 5th
        notes = notes.split(",");
        for (let i = 0; i < notes.length; i++) {
            if (notes[i] !== " ") {
                let note = notes[i].split("");
                let parsed = parseInt(note[1]);
                if (isNaN(parsed)) {
                    note.splice(1, 0, "5");
                    notes[i] = note.join("");
                }
            }
        }
        return notes.join();
    }
    
    render() {
        return (
            <React.Fragment>
                <div 
                    id="keyboard" 
                    className={this.state.sharp ? 'sharp' : null}
                    onClick={this.toggleSharp}
                >
                    <Row ref={this.createRef(0)} data="`1234567890-=" notes={this.calculateNotes("A,B,C,D,E,F,G,A,B,C,D,E,F")}/>
                    <Row ref={this.createRef(1)} data="QWERTYUIOP[]" notes={this.calculateNotes("A6#,C7,D7,E7,F7#,G7#,A7#,C8,D8,E8,A,A")}/>
                    <Row ref={this.createRef(2)} data="ASDFGHJKL;'" notes={this.calculateNotes("C5,D5,E5,F5#,G5#,A5#,C6,D6,E6,F6#,G6#")}/>
                    <Row ref={this.createRef(3)} data="#ZXCVBNM,./" notes={this.calculateNotes(" ,E3,F3#,G3#,A3#,C4,D4,E4,F4#,G4#,A4#")}/>
                    <Row ref={this.createRef(4)} data=" " notes=" "/>
                </div>
            </React.Fragment>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="root">
                <div className="titlebox">
                    <div className="name">
                        Test Arena 
                    </div>
                    <div className="titleline">
                        piano notes, and stuff
                    </div>
                </div>
                <Keyboard/>
            </div>
        );
    }
}



export default App;
