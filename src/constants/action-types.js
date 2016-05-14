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


// App
export const SAVE_SERVER_INFO = 'SAVE_SERVER_INFO';

// Websocket
export const OPEN_REQUEST = 'OPEN_REQUEST';
export const OPEN_PENDING = 'OPEN_PENDING';
export const OPEN_RECEIVED = 'OPEN_RECEIVED';
export const CLOSE_REQUEST = 'CLOSE_REQUEST';
export const CLOSE_PENDING = 'CLOSE_PENDING';
export const CLOSE_RECEIVED = 'CLOSE_RECEIVED';
export const ERROR_RECEIVED = 'ERROR_RECEIVED';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const SEND_REQUEST = 'SEND_REQUEST';
export const SEND_PENDING = 'SEND_PENDING';
export const SEND_RECEIVED = 'SEND_RECEIVED';

// Intro
export const ADD_STEP = 'ADD_STEP';
export const GO_TO_STEP = 'GO_TO_STEP';

// Connection
export const ADD_CONNECTION = 'ADD_CONNECTION';
export const REMOVE_CONNECTION = 'REMOVE_CONNECTION';
export const CHANGE_STATUS = 'CHANGE_STATUS';