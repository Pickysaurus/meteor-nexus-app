import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Col, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

class Selectors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameList: [],
        }
    }


    render() {
        this.getAllGames();

        return (
            <Form className="selectors">
                <Form.Row>
                    <Form.Group as={Col} controlId="game">
                        <Form.Label>Game</Form.Label>
                            <Form.Control as="select" disabled={!this.props.ready} onChange={this.selectGame.bind(this)}>
                                <option>Select a game...</option>
                                {this.props.ready && this.props.nexusModsUser && this.state.gameList.length ? this.renderGames() : ''}
                            </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group as={Col} controlId="mod">
                        <Form.Label>Mod</Form.Label>
                        <Form.Control type="text" disabled={!this.props.activeGame} placeholder="Search for a mod..." />
                    </Form.Group>
                    <br />
                    <Form.Group as={Col} controlId="file">
                        <Form.Label>File</Form.Label>
                        <Form.Control as="select" disabled={!this.props.activeMod}>
                            <option>Select a file...</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
            </Form>
        );
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
            if (err) return console.log('renderGames error', err);
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
}

export default Selectors;