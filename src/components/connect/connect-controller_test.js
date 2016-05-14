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


import { expect } from 'chai';
import { should } from 'chai';

import ConnectController from './connect-controller';
import styles from './connect.scss';

let controller;

describe('ConnectController', () => {

  beforeEach(function() {
    controller = new ConnectController(styles);
  });

  // constructor()
  // it('should have a connections array', () => {
  //   controller
  //     .should.have.property('connections')
  //     .that.is.an('array');
  // });

  // it('should have a default connection inside the connections array', () => {
  //   controller.connections.length.should.equal(1);
  //   controller.connections[0].protocol.should.equal('ws');
  //   controller.connections[0].host.should.equal('localhost');
  //   controller.connections[0].port.should.equal(4444);
  // });

  // it('should have a newConnection object', () => {
  //   controller
  //     .should.have.property('newConnection')
  //     .that.is.an('object')
  //     .that.deep.equals({});
  // });

  // // addConnection()
  // describe('#addConnection()', () => {
  //   it('should set/reset the newConnection object', () => {
  //     controller.addConnection();

  //     controller
  //       .should.have.property('newConnection')
  //       .that.is.an('object')
  //       .that.deep.equals({
  //         protocol: 'ws',
  //         host: '',
  //         port: 0
  //       });
  //   });
  // });

});