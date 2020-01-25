import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import AsyncSelect from 'react-select/async';

class ModSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            disableSearch: false,
        }
    }

    handleInputChange(newValue) {
        //console.log(newValue);
    }

    handleChange(selected) {
        const { nexusModsUser, updateMod } = this.props;
        this.setState({disableSearch: true}, (() => {
            Meteor.call('getModInfo', nexusModsUser.key, selected.value.game_name, selected.value.mod_id, (error, result) => {
                if (error) return this.setState({disableSearch: false});
                updateMod(result);
            });
        }))
    }
    
    render() {
        const {activeMod, activeGame, updateMod} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeMod ? `url(${activeMod.picture_url})` : ''}}>
                <div className="selector-overlay"><b>⚙️ Mod:</b> {activeMod ? activeMod.mod_id : ''}<br/>
                {activeMod ? <span className="selector-title">{activeMod.name}</span> : activeGame 
                ? 
                <AsyncSelect 
                    className="selector-dropdown"
                    disabled={this.state.disableSearch}
                    loadOptions={searchMods.bind(null, activeGame.id)}
                    onInputChange={this.handleInputChange}
                    onChange={this.handleChange.bind(this)}
                />
                : <i>Select a game</i> } <br/>
                {activeMod ? <button className="btn" onClick={() => updateMod()}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

const searchMods = (activeGameId, input, callback) => {
    if (input.length < 3) return callback([]);

    Meteor.call('searchMods', activeGameId, input, function (error, result) {
        if (error) return callback([]);
        const preppedResults = result.results.map((mod) => {return { label: mod.name, value: mod }});
        return callback(preppedResults);
    });
    

}

export default ModSelector;