import React, { Component } from "react";

export default class NexusModsAccount extends Component {
    
    render() {
        return (
        <div className="account-banner">
        <div className="account-area">
            <div className="profile-image" style={{backgroundImage: this.props.nexusModsUser ? `url(${this.props.nexusModsUser.profile_url})` : ''}}/>
            {this.props.nexusModsUser ? this.props.nexusModsUser.name : ''}
            <button
                className="btn btn-login"
                onClick={this.props.loginButton}     
            >{this.props.nexusModsUser ? "Log out" : "Log in"} </button>
        </div>
        </div>
        );
    }
}