import React, { Component } from 'react';
import { Form, FormGroup, Table } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { Meteor } from 'meteor/meteor';

class CompatibilityTable extends Component {
    render() {
        return (
            <Table striped hover>
                <thead>
                    <tr>
                        <th>
                            Mod File
                        </th>
                        <th>
                            Interaction
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
        );
    }
}

class AddRuleRow extends Component {
    render() {
        return(
            <tr>
                <td>
                    <AsyncSelect />
                </td>
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