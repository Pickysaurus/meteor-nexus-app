import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Col, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

class FileSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        }
    }
    
    render() {
        const {activeFile, updateMod} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeFile ? `url(${activeFile.id})` : ''}}>
                <div className="selector-overlay"><b>📂 File:</b><br/>
                {activeFile ? activeFile.name : <i>Select a mod</i>} <br/>
                {activeFile ? <button className="btn" onClick={() => null}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

export default FileSelector;