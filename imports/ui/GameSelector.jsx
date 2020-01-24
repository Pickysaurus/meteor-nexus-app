import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Col, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

class GameSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameList: [],
        }
    }

    selectGame(event) {
        event.preventDefault();
        const field = ReactDOM.findDOMNode(this.refs[event.target.value]);
        const game = this.state.gameList.find((game) => game.id === parseInt(field.id));
        this.props.updateGame(game);
    }

    async getAllGames() {
        return [];
        if (this.state.gameList.length) return this.state.gameList;
        const {nexusModsUser} = this.props;
        if (!nexusModsUser) return [];

        Meteor.call('getGames', (nexusModsUser.key), (err, result) => {
            if (err) console.log('renderGames error', error);
            // Fill the games in order of downloads.
            this.setState({gameList: result.sort((a,b) => a.downloads < b.downloads ? 1 : -1)});
        });
    }

    renderGames() {
        const {gameList} = this.state;
        if (gameList.length) {
            return gameList.map((game) => { return (<option ref={game.name} id={game.id} key={game.id}>{game.name}</option>) });
        }
        return '';
    }
    
    render() {
        this.getAllGames();
        const {activeGame, updateGame} = this.props;

        return(
            <div className="selector" style={{backgroundImage: activeGame ? `url(https://staticdelivery.nexusmods.com/Images/games/4_3/tile_${activeGame.id}.jpg)` : 'url(https://staticdelivery.nexusmods.com/Images/games/4_3/tile_empty.png)'}}>
                <div className="selector-overlay"><b>🕹️ Game:</b><br/>
                {activeGame ? activeGame.name : <i>none</i>} <br/>
                {activeGame ? <button className="btn" onClick={() => updateGame(undefined)}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

export default GameSelector;