import React from 'react';
import MIDISounds from 'midi-sounds-react';
import './App.css';

class Key extends React.Component {
    constructor(props) {
        super(props);
        this.toggleActive = this.toggleActive.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.calculateNote = this.calculateNote.bind(this);
        this.state = {
            active: false
        };
    }
    
    calculateNote = (name) => {
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
        
        if (name[1]) {
        }
        else {
            num += 5*12;
        }
        
        if (name[2]) {
        }
        
        return num;
    }
    
    handleClick = () => {
        if (!this.state.active) {
            console.log(this.props.data);
            this.midiSounds.playChordNow(14, [this.calculateNote(this.props.data)], 0.5);
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
                    className={this.state.active ? 'active' : null} 
                    onClick={this.handleClick.bind(this)}
                />
                <MIDISounds ref={(ref) => (this.midiSounds = ref)}  instruments={[3]} />	
            </React.Fragment>
        );
    }
}

class Row extends React.Component {
    data = this.props.data.split('');
    
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    {this.data.map(value => (<Key data={value} key={value}/>))}
                </div>
            </React.Fragment>
        );
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
                <div className="keyboard">
                    <Row data="`1234567890-="/>
                    <Row data="QWERTYUIOP[]"/>
                    <Row data="ASDFGHJKL;'"/>
                    <Row data="ZXCVBNM,./"/>
                    <Row data=" "/>
                </div>
            </div>
        );
    }
}



export default App;
