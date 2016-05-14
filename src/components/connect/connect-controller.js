/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


// Vendor
import _ from 'lodash';
import * as uuid from 'node-uuid';

// Constants
import * as constants from '../../constants/app-types';


function _getNewConnection() {
  return {
    id: uuid.v4(),
    host: undefined,
    port: undefined,
    ssl: false
  };
}

class ConnectController {

  constructor() {
    this.view = {
      changeConnection: true,
      addConnection: false
    };

    this.constants = constants;
  }

  $onInit() {
    // Deep copy objects (because of one-way data binding behaviour of objects)
    // Info: https://toddmotto.com/one-way-data-binding-in-angular-1-5/
    this.connections = _.cloneDeep(this.availableConnections);
  }

  $onChanges(changes) {
    this.connections = _.cloneDeep(changes.availableConnections.currentValue);
  }

  addConnection() {
    // Reset form
    this.setConnectionForm.$setPristine();
    this.setConnectionForm.$setUntouched();

    this.newConnection = _getNewConnection();

    this.view.changeConnection = false;
    this.view.addConnection = true;
  }

  editConnection(connection) {
    // Don't allow editting of default connection
    if(connection.default) {
      return;
    }

    this.newConnection = connection;

    this.view.changeConnection = false;
    this.view.addConnection = true;
  }

  removeConnection(connection) {
    this.onRemoveConnection({
      id: connection.id
    });
  }

  saveConnection(isValid, newConnection) {
    if(!isValid) {
      return;
    }

    this.onAddConnection({
      newConnection
    });

    this.view.changeConnection = true;
    this.view.addConnection = false;
  }

  openConnection(connection) {
    let protocol = connection.ssl ? 'wss' : 'ws';
    let { host, port } = connection;

    this.onOpenConnection({
      connectionId: connection.id,
      url: protocol + '://' + host + ':' + port
    });
  }

  closeConnection(connection) {
    let protocol = connection.ssl ? 'wss' : 'ws';
    let { host, port } = connection;

    this.onCloseConnection({
      connectionId: connection.id,
      url: protocol + '://' + host + ':' + port
    });
  }

}

export default ConnectController;