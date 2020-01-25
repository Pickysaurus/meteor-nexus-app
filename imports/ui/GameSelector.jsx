import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import Select from "react-dropdown-select"; 

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

    searchableGames() {
        const {gameList} = this.state;
        if (gameList.length) {
            return gameList.map((game) => { return {value: game.id, ...game}});
        }
        return [];
    }

    renderSearchOption(option, state, props) {
    return <div><img src={`https://staticdelivery.nexusmods.com/Images/games/4_3/tile_${option.id}.jpg`} style={{maxHeight:'50px'}} />{option.name}</div>
    }
    
    render() {
        this.getAllGames();
        const {activeGame, updateGame} = this.props;
        const {gameList} = this.state;

        return(
            <div className="selector selector-game" style={{backgroundImage: activeGame ? `url(https://staticdelivery.nexusmods.com/Images/games/4_3/tile_${activeGame.id}.jpg)` : 'url(https://staticdelivery.nexusmods.com/Images/games/4_3/tile_empty.png)'}}>
                <div className="selector-overlay"><b>🕹️ Game:</b> {activeGame ? activeGame.id : ''}<br/>
                {activeGame ? activeGame.name : <GameSearch className="selector-dropdown" gameList={gameList} updateGame={this.props.updateGame.bind(this)}/>}
                    <br/>
                {activeGame ? <button className="btn" onClick={() => updateGame(undefined)}>Change</button> : ''}</div>
            </div>
        );

    }
    
}

class GameSearch extends Component {
    itemRenderer = ({item, itemIndex, props, state, methods}) => {
        return(
        <React.Fragment>
            <div className="search-item" onClick={() => methods.addItem(item)}>
                <img src={`https://staticdelivery.nexusmods.com/Images/games/4_3/tile_${item.id}.jpg`} style={{maxHeight: '50px'}} />
                {item.name}
            </div>
        </React.Fragment>)
    }
    
    render() {
        const {gameList, updateGame} = this.props;
        return (
            <Select 
                options={gameList}
                disabled={gameList.length === 0}
                loading={gameList.length === 0}
                onChange={(values) => updateGame(values[0])}
                placeholder='Select a game...'
                labelField="name"
                valueField="name"
                color="#0074D9"
                itemRenderer={this.itemRenderer}
            />
        );
    }
}

export default GameSelector;