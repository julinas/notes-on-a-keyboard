import React from 'react';
import MIDISounds from 'midi-sounds-react';
import './App.css';

// this doesn't use the full MIDI range
// only 120 out of 127 possible notes - without the highest notes
const noteNameToNum = (name) => {
	if (name === " ") return NaN;

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
	if (isNaN(num)) return " ";

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
            sharp: false
        };
    }

    setSharp = (value) => {
        this.setState({sharp: value});
    }
    
    handleClick = (e) => {
        if (!this.state.active) {
            if (this.props.notekey !== " ") {
            	if (this.state.sharp) {
                	this.props.midi.playChordNow(14, [this.props.sharpNum], 0.5);
            	}
            	else this.props.midi.playChordNow(14, [this.props.noteNum], 0.5);
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
                    className={this.state.active ? 'key active' : 'key'} 
                    onClickCapture={this.handleClick}
                >
                	<span
                		title={this.props.sharpkey}
                		className="sharp"
                	/>  
                   	<span
                	    title={this.props.notekey}
                	    className="note"
                	/>              
                </span>	
            </React.Fragment>
        );
    }
}

// Row
class Row extends React.Component {
    constructor(props) {
        super(props);
        this.setSharp = this.setSharp.bind(this);
        this.keys = {};
    }
    data = this.props.data.split('');
    notes = this.props.notes.split(',');
    notesNum = this.notes.map((x, i) => noteNameToNum(x));
    sharps = this.notes.map((x, i) => noteNumToName(this.notesNum[i] + 1));
    sharpsNum = this.sharps.map((x, i) => noteNameToNum(x));
    zipped = this.data.map((x, i) => [x, this.notes[i], this.notesNum[i], this.sharps[i], this.sharpsNum[i]]);
    className = this.props.shiftLeft ? "row shiftLeft" : "row";
    
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
                <div className={this.className}>
                    {this.zipped.map(x => (
                        <Key 
                            data={x[0]}
                            ref={this.createRef(x[0])} // for ref
                            midi={this.props.midi}
                            notekey={x[1]}
                            noteNum={x[2]}
                            sharpkey={x[3]}
                            sharpNum={x[4]}
                        />
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

class CheckQwerty extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            useQwerty: false
        };
    }

    handleInputChange = (event) => {
    	this.setState({useQwerty: !this.state.useQwerty})
    	this.props.showQwerty();
    }

	render() {
		return (
			<form>
				<label>
					Use QWERTY
					<input
						name="useQwerty"
						type="checkbox"
						checked={this.state.useQwerty}
						onChange={this.handleInputChange} />
				</label>
			</form>
		)
	}
}

class Keyboard extends React.Component {
    constructor(props) {
        super(props);
        this.toggleSharp = this.toggleSharp.bind(this);
        this.toggleShowQwerty = this.toggleShowQwerty.bind(this);
        this.rows = {};
        this.state = {
        	showQwerty: false,
            sharp: false
        };
    }

    toggleShowQwerty = (event) => {
    	this.setState({showQwerty: !this.state.showQwerty});
    }

    toggleSharp = (event) => {
        if (event.target.id !== "#") {
            return;
        }
        let value = !this.state.sharp;
        this.setState({sharp: value});
        let indices = Object.keys(this.rows);
        for (let i = 0; i < indices.length; i++) {
            this.rows[indices[i]].current.setSharp(value);
        }
    }

    createRef = (id) => {
        let rowRef = React.createRef(id);
        this.rows[id] = rowRef;
        return rowRef;
    }
    
    /* recaculate name of notes */
    setNotes = (notes) => {
        // if no octave, set to 5th
        // if no sharp or flat, set to "n"
        notes = notes.split(",");
        for (let i = 0; i < notes.length; i++) {
            if (notes[i] !== " ") {
                let note = notes[i].split("");
                let parsed = parseInt(note[1]);
                if (isNaN(parsed)) note.splice(1, 0, "5");
                notes[i] = note.join("");
            }
        }
        return notes.join();
    }
    
    // Moving MIDISounds to top level makes the application lighter, 
    // but it doesn't allow *exactly* simultaneous notes, so chords could be problematic (mostly fine, though)
    render() {
        return (
            <React.Fragment>
                <div 
                	id="keyboard"
                	className={(this.state.sharp ? 'sharp' : '') + " " + (this.state.showQwerty ? 'showQwerty' : '')}
                	onClick={this.toggleSharp}
                >
                	<MIDISounds ref={(ref) => (this.midi = ref)}  instruments={[3]} />
                    <Row ref={this.createRef(0)} midi={this.midi} data="`1234567890-=" notes={this.setNotes("F8#,G8#,A8#,C9,D9,E9,F9#,G9#,A9#,G2#,A2#,C3,D3")}/>
                    <Row ref={this.createRef(1)} midi={this.midi} data="QWERTYUIOP[]" notes={this.setNotes("A6#,G6#,D7,C6,F7#,G7#,A7#,G5#,D5,E8,E2,F2#")}/>
                    <Row ref={this.createRef(2)} midi={this.midi} data="ASDFGHJKL;'" notes={this.setNotes("F4#,C5,F6#,F5#,C8,A5#,E7,D6,F3#,E5,G4#")}/>
                    <Row ref={this.createRef(3)} midi={this.midi} data="#ZXCVBNM,./" notes={this.setNotes(" ,E3,E6,G3#,A3#,C4,A4#,E4,D8,C7,D4")} shiftLeft={true}/>
                    <Row ref={this.createRef(4)} midi={this.midi} data=" " notes=" "/>
                </div>
                <CheckQwerty showQwerty={this.toggleShowQwerty}/>
            </React.Fragment>
        )
    }

    componentDidMount() {
		this.setState(this.state);
	}
}

class App extends React.Component {
    render() {
        return (
            <div className="root">
                <div className="titlebox">
                    <div className="name">
                        musical notes on a keyboard
                    </div>
                    <div className="titleline">
                        Try this: (☉ is rhythm placeholder)
                    </div>
                    <div className="titleline">
                        /☉" " "☉"☉n☉no"☉☉☉A☉AAA☉M☉A☉A"/☉☉☉A☉AAA☉/mM☉MMM☉m/m☉mmmAMm/☉/☉/☉☉☉
                    </div>
                </div>
	            <Keyboard/>
            </div>
        );
    }
}

export default App;
