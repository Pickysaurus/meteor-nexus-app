import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import Select from 'react-dropdown-select';

class FileSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        }
    }

    prepareFiles(modFiles) {
        return modFiles.map((file) => {
            file.title = [...file.name].join('');
            const displayTitle = `${file.name} (${file.version})`
            file.name = displayTitle;
            return file;
        }).sort((a,b) => {
            const versionA = a.version;
            const versionB = b.version;
            return (versionA > versionB) ? -1 : 1;
        });
    }
    
    render() {
        const {activeFile, activeMod, updateFile} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeFile ? `url(${activeMod.picture_url})` : ''}}>
                <div className="selector-overlay"><b>📂 File:</b> {activeFile ? activeFile.file_id : ''}<br/>
                {activeFile ? <span className="selector-title">{activeFile.name}</span> : activeMod ? <Select className="selector-dropdown" labelField="name" valueField="file_id" options={this.prepareFiles(activeMod.files)} onChange={(values) => updateFile(values[0])} /> : <i>Select a mod</i>} <br/>
                {activeFile ? <button className="btn" onClick={() => updateFile()}>Change</button> : ''}</div>
            </div>
        );

    }
    
}


export default FileSelector;