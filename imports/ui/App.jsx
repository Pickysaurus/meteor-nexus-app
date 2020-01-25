import React, { Component } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { userAccounts } from '../api/userAccounts.js';


import Info from './Info.jsx';
import NexusModsAccount from './NexusModsAccount.jsx';
import BodySignIn from './BodySignIn.jsx';
import GameSelector from './GameSelector.jsx';
import ModSelector from './ModSelector.jsx';
import FileSelector from './FileSelector.jsx';
import DetailsTable from './DetailsTable.jsx';
import CompatibilityTable from './CompatibilityTable.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    const savedKey = sessionStorage.getItem("key");
    savedKey ? Meteor.call('validateAPIkey', (savedKey), (error, result) => {
      if (error) return console.error;
      this.setState({
        nexusModsUser: !error ? result : null,
        ready: true,
        activeGame: sessionStorage.getItem('game') ? JSON.parse(sessionStorage.getItem('game')) : null,
        activeMod: sessionStorage.getItem('mod') ? JSON.parse(sessionStorage.getItem('mod')) : null,
        activeFile: sessionStorage.getItem('file') ? JSON.parse(sessionStorage.getItem('file')) : null,       
      });
    }) : null;
    // const api = savedUser ? Nexus.create(savedUser.key,'Mod Data', '1.0.0', '100').catch(console.error) : null;

    this.state = {
      nexusModsUser: null,
      activeGame: null,
      activeMod: null,
      activeFile: null,
      ready: false,
      showFallback: false,
    }
  }

  async loginToNexusMods() {
    // Start the SSO login process and update the state if we log in successfully.
    if (this.state.nexusModsUser) {
      // Log out if we're logged in.
      this.setState({nexusModsUser: null, ready: false, activeGame: null, activeMod: null, activeFile: null});
      sessionStorage.removeItem('key');
      sessionStorage.removeItem('game');
      sessionStorage.removeItem('mod');
      sessionStorage.removeItem('file');      
    } else {
      // Start the login process.
      const loginInfo = await nexusSSOLogin(this)
        .catch((err) => {
          console.log("SSO Error", err);
          return this.setState({showFallback: true});
        });
      if (typeof loginInfo === Error) return this.setState({showFallback: true});
      if (!loginInfo) alert('Login to Nexus Mods failed.');
      await Meteor.call('validateAPIkey', (loginInfo.key), (error, result) => {
        if (error) alert(error);
        this.setState({nexusModsUser: result, ready: true});
        sessionStorage.setItem("key",result.key);
      });
    }
  }

  updateKey(newKey) {
    this.setState({nexusModsUser: newKey, ready: newKey ? true : false});
  }

  updateGame(newGame) {
    this.setState({activeGame: newGame, activeMod: null, activeFile: null});
    newGame ? sessionStorage.setItem("game", JSON.stringify(newGame)) : sessionStorage.removeItem('game');
  }
  
  updateMod(newMod) {
    this.setState({activeMod: newMod, activeFile: null});
    newMod ? sessionStorage.setItem("mod", JSON.stringify(newMod)) : sessionStorage.removeItem('mod');
  }

  updateFile(newFile) {
    this.setState({activeFile: newFile});
    newFile ? sessionStorage.setItem("file", JSON.stringify(newFile)) : sessionStorage.removeItem('file');
  }

  render() {
    const { activeFile, activeGame, activeMod, showFallback, ready, nexusModsUser} = this.state;

    return (
      <div>
        {showFallback ? <FallbackModal login={this.updateKey.bind(this)} /> : ''}
        <h1>Mod Compatibility Database</h1>
        <NexusModsAccount
          loginButton = {this.loginToNexusMods.bind(this)}
          nexusModsUser = {nexusModsUser}
        />
        <div className="main-content">
          <Info />
          {!ready ? <BodySignIn onClick={this.loginToNexusMods.bind(this)} />:
          <div className="selector-container">
            <GameSelector
              nexusModsUser={nexusModsUser}
              activeGame={activeGame}
              ready={ready}
              updateGame={this.updateGame.bind(this)}
            />
            <ModSelector
              nexusModsUser={nexusModsUser}
              activeGame={activeGame}
              activeMod={activeMod}
              updateMod={this.updateMod.bind(this)}
            />
            <FileSelector 
              nexusModsUser={nexusModsUser}
              activeGame={activeGame}
              activeMod={activeMod}
              activeFile={activeFile}
              updateFile={this.updateFile.bind(this)}
            />
          </div>}
          <div className="file-info-container" style={{display: !activeFile ? 'none' : 'inherit'}}>
            <h2>Compatibility Data</h2> 
            {nexusModsUser && ready ?
            <CompatibilityTable 
              nexusModsUser={nexusModsUser}
              activeGame={activeGame}
              activeMod={activeMod}
              activeFile={activeFile}
            />
            : ''}
          </div>
          <div className="file-info-container">
            <DetailsTable activeMod={activeMod} activeFile={activeFile} nexusModsUser={nexusModsUser} /> 
          </div>
        </div>
      </div>
    );
  }
}

class Modal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.show ? "modal display-block" : "modal display-none"}>
        <section className="modal-main">
          {this.props.children}
          <button onClick={this.props.handleClose} className="btn">close</button>
        </section>
      </div>
    );
  }
}


class FallbackModal extends Component {
  constructor(props) {
    super(props);
    this.state = { show: true, errorMessage: null };
    this.fallbackKeyInput = React.createRef();
  }

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
  }
  
  handleSubmit() {
    this.setState({ errorMessage: null });
    const submittedkey = this.fallbackKeyInput.current.value;
    this.validate(submittedkey, this.hideModal);
  }

  async validate(apiKey, callback) {
    if (!apiKey || !apiKey.length) return this.setState({ errorMessage: "API key cannot be blank." });

    return await Meteor.call('validateAPIkey', (apiKey), (error, result) => {
      if(error){
        console.error(error);
        return this.setState({ errorMessage: error.error });
      } 
      sessionStorage.setItem("key",result.key);
      this.props.login(result);
      callback();
    });
  }

  render() {
    return (
      <main>
        <Modal show={this.state.show} handleClose={this.hideModal.bind(this)}>
          <h1>Fallback login</h1>
          <p>The Nexus Mods SSO is currently unavailable. Please enter your API key manually to login in.</p>
          <FormGroup onSubmit={this.handleSubmit}>
            <input className = {this.state.errorMessage ? 'input-error' : ''} type="text" ref={this.fallbackKeyInput} placeholder="Paste your API key here..." />
            <button type="submit" className="btn" onClick={this.handleSubmit.bind(this)}>Save</button>
          </FormGroup>
          {this.state.errorMessage ? <p className="error">{this.state.errorMessage}</p> : ''}
        </Modal>
      </main>
    );
  }
}

function nexusSSOLogin(parent) {
  return new Promise((resolve, reject) => {

    const application_slug = "vortex";

    // Open the web socket.
    window.socket = new WebSocket('wss://sso.nexusmods.com');

    socket.onerror = function (error) {
      return parent.setState({showFallback: true});
    }

    socket.onopen = function (event) {
      // console.log('SSO Connection open!');

      // Generate or retrieve a request ID and connection token (if we are reconnecting)
      let uuid = null;
      let token = null;
      uuid = sessionStorage.getItem("uuid");
      token = sessionStorage.getItem("connection_token");

      if (uuid === null) {
        uuid = uuidv4();
        sessionStorage.setItem('uuid', uuid);
      }

      if (uuid !== null) {

        let data = {
          id: uuid,
          token: token,
          protocol: 2,
        };

        // Send the SSO request
        socket.send(JSON.stringify(data));

        // Now we can direct the user to the authorisation page
        window.open(`https://www.nexusmods.com/sso?id=${uuid}&application=${application_slug}`, '_blank');
      } else { 
        console.error('ID was not calculated correctly.');
        reject('ID was not calculated correctly.');
      };
    }

    socket.onclose = function (event) {
      // console.log("SSO Connection closed!", event.code, event.reason);
    };

    socket.onmessage = function (event) {
      // console.log('Message', event)

      // Parse the response
      const response = JSON.parse(event.data);

      if (response && response.success) {
        if (response.data.hasOwnProperty('connection_token')) sessionStorage.setItem("connection_token", response.data.connection_token);
        else if (response.data.hasOwnProperty('api_key')) {
          // We got the API key back!
          const apiKey = response.data.api_key;
          sessionStorage.removeItem("uuid");
          sessionStorage.removeItem("connection_token");
          socket.close();
          resolve({key: apiKey});
        }
      }
    }

  });
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

export default withTracker(() => {
  Meteor.subscribe('userAccounts');
  return {
    accounts: userAccounts.find().fetch(),
  }
})(App);
