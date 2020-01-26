import React, { Component } from 'react';
import { Form, FormGroup, Table } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { Meteor } from 'meteor/meteor';

class CompatibilityTable extends Component {
    render() {
        return (
            <div className="file-info-container">
                <h2>Compatibility Data{this.props.activeFile ? ` for ${this.props.activeFile.name}` : ''}</h2>
            <Table striped hover>
                <thead>
                    <tr>
                        <th>
                            Type
                        </th>
                        <th>
                            Mod File
                        </th>
                        <th>
                            Comment
                        </th>
                        <th>
                            Added by
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows}
                    <AddRuleRow nexusModsUser={this.props.nexusModsUser} />
                </tbody>
            </Table>
            </div>
        );
    }
}

class AddRuleRow extends Component {
    render() {
        return(
            <tr>
                <td>
                    <select>
                        <option>Requires</option>
                        <option>Recommended</option>
                        <option>Incompatible</option>
                        <option>Requires Patch</option>
                        <option>Includes</option>
                    </select>
                </td>
                <td>
                    <AsyncSelect />
                </td>
                <td>
                    <input type="text" placeholder="Comment" onChange={() => null} />
                </td>
                <td>
                    <i>{this.props.nexusModsUser.name}</i>
                </td>
                <td>
                    <i>Now</i>
                </td>
                <td>
                <button className="btn btn-small" title="Save">✅</button>
                <button className="btn btn-small" title="Clear">🗑️</button>
                </td>
            </tr>
        );
    }
}

export default CompatibilityTable;