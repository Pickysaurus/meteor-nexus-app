import React, { Component } from "react";


class BodySignIn extends Component {
    render() {
        return (
            <div className="sign-in-body">
                Please log in to continue
                <br/>
                <button className="btn btn-large" onClick={this.props.onClick}>Log in</button>
            </div>
        );
    }
}

export default BodySignIn;