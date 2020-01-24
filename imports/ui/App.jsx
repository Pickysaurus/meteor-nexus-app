import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { userAccounts } from '../api/userAccounts.js';


import Info from './Info.jsx';
import NexusModsAccount from './NexusModsAccount.jsx';
import Selectors from './Selectors.jsx';
import BodySignIn from './BodySignIn.jsx';
import GameSelector from './GameSelector.jsx';
import ModSelector from './ModSelector.jsx';
import FileSelector from './FileSelector.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    const savedKey = sessionStorage.getItem("key");
    savedKey ? Meteor.call('validateAPIkey', (savedKey), (error, result) => {
      if (error) console.error;
      this.setState({
        nexusModsUser: !error ? result : null,
        ready: true,        
      });
    }) : null;
    // const api = savedUser ? Nexus.create(savedUser.key,'Mod Data', '1.0.0', '100').catch(console.error) : null;

    this.state = {
      nexusModsUser: null,
      activeGame: null,
      activeMod: null,
      activeFile: null,
      ready: false,
    }
  }

  async loginToNexusMods() {
    // Start the SSO login process and update the state if we log in successfully.
    if (this.state.nexusModsUser) {
      // Log out if we're logged in.
      this.setState({nexusModsUser: null, ready: false});
      sessionStorage.removeItem('key');      
    } else {
      // Start the login process.
      const loginInfo = await nexusSSOLogin().catch(console.error);
      if (!loginInfo) alert('Login to Nexus Mods failed.');
      await Meteor.call('validateAPIkey', (loginInfo.key), (error, result) => {
        if (error) alert(error);
        this.setState({nexusModsUser: result, ready: true});
        sessionStorage.setItem("key",result.key);
      });
    }
  }

  updateGame(newGame) {
    console.log('Setting game:', newGame);
    this.setState({activeGame: newGame});
  }

  render() {
    const { activeFile, activeGame, activeMod, ready, nexusModsUser} = this.state;

    return (
      <div>
        <h1>Mod Compatibility Database</h1>
        <NexusModsAccount
          loginButton = {this.loginToNexusMods.bind(this)}
          nexusModsUser = {nexusModsUser}
        />
        <div className="main-content">
          <Info />
          {!this.state.ready ? <BodySignIn onClick={this.loginToNexusMods.bind(this)} />:
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
            />
            <FileSelector 
              nexusModsUser={nexusModsUser}
              activeGame={activeGame}
              activeMod={activeMod}
              activeFile={activeFile}
            />
          </div>}
          <br/>
          {this.state.ready ? <Selectors
              ready={this.state.ready}
              nexusModsUser={this.state.ready ? this.state.nexusModsUser : null}
              activeGame={this.state.activeGame}
              activeMod={this.state.activeMod}
              activeFile={this.state.activeFile}
              updateGame={this.updateGame.bind(this)}
            /> : ''}
        </div>
      </div>
    );
  }
}


function nexusSSOLogin() {
  return new Promise((resolve, reject) => {
    //resolve({name: "Pickysaurus", avatarURL: "https://forums.nexusmods.com/uploads/profile/photo-thumb-31179975.png"});
    const application_slug = "vortex";

    // Open the web socket.
    window.socket = new WebSocket('wss://sso.nexusmods.com');

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
          resolve({name: "Pickysaurus", profile_url: "https://forums.nexusmods.com/uploads/profile/photo-thumb-31179975.png", key: apiKey});
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
