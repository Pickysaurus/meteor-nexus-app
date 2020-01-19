import React, { Component } from "react";
import { Col, Form } from 'react-bootstrap';

const exampleGames = [
    { id: 110, title: 'Skyrim'},
    { id: 1704, title: 'Skyrim Special Edition'}
];

class Selectors extends Component {

    render() {
        const gameList = undefined //this.props.api ? this.props.api.getGames() : undefined;
        //console.log(gameList);

        return (
            <Form className="selectors">
                <Form.Row>
                    <Form.Group as={Col} controlId="game">
                        <Form.Label>Game</Form.Label>
                        <Form.Control as="select" disabled={!this.props.nexusModsUser}>
                            <option>{this.props.nexusModsUser ? 'Select a game...' : 'Log in to get started'}</option>
                            {this.props.nexusModsUser && gameList && gameList.length ? this.renderGames(gameList) : ''}
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

    renderGames(gameList) {
        return gameList.map((game) => {
            return (
                <option key={game.id}>{game.title}</option>
            );
        })
    }
}

export default Selectors;