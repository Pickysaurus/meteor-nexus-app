import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Col, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

class ModSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        }
    }
    
    render() {
        const {activeMod, updateMod} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeMod ? `url(${activeMod.id})` : ''}}>
                <div className="selector-overlay"><b>⚙️ Mod:</b><br/>
                {activeMod ? activeMod.name : <i>Select a game</i>} <br/>
                {activeMod ? <button className="btn" onClick={() => null}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

export default ModSelector;