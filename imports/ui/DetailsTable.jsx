import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

class DetailsTable extends Component {
    render() {
        return (
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Mod Details</th>
                        <th>File Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><ModInfo activeMod={this.props.activeMod} /></td>
                        <td><FileInfo activeMod={this.props.activeMod} activeFile={this.props.activeFile} nexusModsUser={this.props.nexusModsUser} /></td>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

class ModInfo extends Component {
    render() {
        const { activeMod } = this.props;
        return (
            <div>
            <h2>{activeMod ? activeMod.name : ''}</h2>
            <p>Version: {activeMod ? activeMod.version : ''}</p>
            <p>Author: {activeMod ? activeMod.author : ''}</p>
            <p>Uploader: {activeMod ? <a href={`https://nexusmods.com/users/${activeMod.user.member_id}`}>{activeMod.user.name}</a> : ''}</p>
            <p>Summary: <br/>{activeMod ? activeMod.summary.replace(/(<br \/>)/g, '\n').replace(/(\[.+\]).+(\[\/.+\])/g, '') : ''}</p>
            {activeMod? <img src={activeMod.picture_url} /> : ''}<br />
            { activeMod ? <div>
                <button className="btn" onClick={() => window.open(`https://nexusmods.com/${activeMod.domain_name}/mods/${activeMod.mod_id}`, '_blank')}>Visit mod page</button>
                <button className="btn" disabled={true}>👍 Endorse</button>
                </div> : ''}
            </div>
        );
    }
}

class FileInfo extends Component {
    nxmLink = () => {
        const { activeMod, activeFile } = this.props;
        const nxmLink = `nxm://${activeMod.domain_name}/mods/${activeMod.mod_id}/files/${activeFile.file_id}`;
        window.open(nxmLink);
        //nxm://SkyrimSE/mods/31922/files/120809?key=9FACco1Da_gf4w_-_eF-lA&expires=1580143164&user_id=31179975
    }

    manualDownload = () => {
        const {nexusModsUser, activeFile, activeMod} = this.props;
        if (nexusModsUser.is_premium) {
            Meteor.call('getDownloadURLs', nexusModsUser.key,activeMod.domain_name, activeMod.mod_id, activeFile.file_id, (error, result) => {
                if (error) return alert('There was a problem getting a download link'+ error);
                window.open(result[0]['URI']);
            });
        }
        else window.open(`https://nexusmods.com/${activeMod.domain_name}/mods/${activeMod.mod_id}?tab=files`, '_blank');
    }

    renderCategory = (category) => {
        if (category.toLowerCase() === "main") {
            return 'Main Files'
        }
        else if (category.toLowerCase() === "update") {
            return 'Update files'
        }
        else if (category.toLowerCase() === "optional") {
            return 'Optional files'
        }
        else if (category.toLowerCase() === "miscellaneous") {
            return 'Miscellaneous files'
        }
        else if (category.toLowerCase() === "old_version") {
            return 'Old files'
        }
        else return 'Deleted Files'
    }

    render(){
        const { activeFile, nexusModsUser } = this.props;
        return (
            <div>
            <h2>{activeFile ? activeFile.title : ''}</h2>
            <p>Type: {activeFile ? this.renderCategory(activeFile.category_name) : ''}</p>
            <p>Version: {activeFile ? activeFile.version : ''}</p>
            <p>Uploaded: {activeFile ? activeFile.uploaded_time.toLocaleString() : ''}</p>
            <p>Summary: <br/>{activeFile ? activeFile.description.replace(/(<br \/>)/g, '\n').replace(/(\[.+\]).+(\[\/.+\])/g, '') : ''}</p>
            { activeFile ? <div><button className="btn" disabled={!nexusModsUser.is_premium} onClick={this.nxmLink}>Vortex</button><button className='btn' onClick={this.manualDownload.bind(this)}>Manual</button></div> : ''}
            </div>
        );
    }
}

export default DetailsTable;