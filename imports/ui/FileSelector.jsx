import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Col, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Select from "react-dropdown-select";

class FileSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        }
    }
    
    render() {
        const {activeFile, activeMod, updateFile} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeFile ? `url(https://staticdelivery.nexusmods.com/${activeMod.image})` : ''}}>
                <div className="selector-overlay"><b>📂 File:</b><br/>
                {activeFile ? activeFile.name : activeMod ? <Select labelField="name" valueField="file_id" options={options} onChange={(values) => updateFile(values[0])} /> : <i>Select a mod</i>} <br/>
                {activeFile ? <button className="btn" onClick={() => updateFile()}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

const options = [{
    "file_id": 22537,
    "name": "SMAPI 3.1",
    "version": "3.1.0",
    "category_id": 1,
    "category_name": "MAIN",
    "is_primary": false,
    "size": 2022,
    "file_name": "SMAPI 3.1-2400-3-1-0-1578274137.zip",
    "uploaded_timestamp": 1578274137,
    "uploaded_time": "2020-01-06T01:28:57.000+00:00",
    "mod_version": "3.1.0",
    "external_virus_scan_url": "https://www.virustotal.com/file/9236afedb6640a7cdb18d8fc76eeb685e1752f6a7b2e1b5499d37771b37011d1/analysis/1578274164/",
    "description": "For Stardew Valley 1.4.1 or later. See the mod description for install and update instructions, what's new in this update, etc.",
    "size_kb": 2022,
    "changelog_html": null,
    "content_preview_link": "https://file-metadata.nexusmods.com/file/nexus-files-meta/1303/2400/SMAPI 3.1-2400-3-1-0-1578274137.zip.json"
  }
];

export default FileSelector;