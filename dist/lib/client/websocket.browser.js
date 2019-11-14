/**
 * WebSocket implements a browser-side WebSocket specification.
 * @module Client
 */
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

class WebSocketBrowserImpl extends _eventemitter["default"] {
  /** Instantiate a WebSocket class
   * @constructor
   * @param {String} address - url to a websocket server
   * @param {(Object)} options - websocket options
   * @param {(String|Array)} protocols - a list of protocols
   * @return {WebSocketBrowserImpl} - returns a WebSocket instance
   */
  constructor(address, options, protocols) {
    var _this;

    super();
    _this = this;
    this.socket = new window.WebSocket(address, protocols);

    this.socket.onopen = function () {
      return _this.emit("open");
    };

    this.socket.onmessage = function (event) {
      return _this.emit("message", event.data);
    };

    this.socket.onerror = function (error) {
      return _this.emit("error", error);
    };

    this.socket.onclose = function (event) {
      _this.emit("close", event.code, event.reason);
    };
  }
  /**
   * Sends data through a websocket connection
   * @method
   * @param {(String|Object)} data - data to be sent via websocket
   * @param {Object} optionsOrCallback - ws options
   * @param {Function} callback - a callback called once the data is sent
   * @return {Undefined}
   */


  send(data, optionsOrCallback, callback) {
    var cb = callback || optionsOrCallback;

    try {
      this.socket.send(data);
      cb();
    } catch (error) {
      cb(error);
    }
  }
  /**
   * Closes an underlying socket
   * @method
   * @param {Number} code - status code explaining why the connection is being closed
   * @param {String} reason - a description why the connection is closing
   * @return {Undefined}
   * @throws {Error}
   */


  close(code, reason) {
    this.socket.close(code, reason);
  }

  addEventListener(type, listener, options) {
    this.socket.addEventListener(type, listener, options);
  }

}

exports["default"] = WebSocketBrowserImpl;