import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import Select from "react-dropdown-select";

class ModSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        }
    }
    
    render() {
        const {activeMod, activeGame, updateMod} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeMod ? `url(https://staticdelivery.nexusmods.com/${activeMod.image})` : ''}}>
                <div className="selector-overlay"><b>⚙️ Mod:</b><br/>
                {activeMod ? activeMod.name : activeGame ? <Select labelField="name" valueField="name" options={options} onChange={(values) => updateMod(values[0])} /> : <i>Select a game</i> } <br/>
                {activeMod ? <button className="btn" onClick={() => updateMod()}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

const options = [{name: "Skyrim Script Extender for VR (SKSEVR)",
downloads: 0,
endorsements: 0,
url: "/skyrimspecialedition/mods/30457",
image: "/mods/1151/images/thumbnails/37135/37135-1548707284-251990173.png",
username: "Pickysaurus",
user_id: 31179975,
game_name: "skyrimspecialedition",
game_id: 1704,
mod_id: 30457}]

export default ModSelector;