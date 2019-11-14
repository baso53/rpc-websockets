/**
 * "Client" wraps "ws" or a browser-implemented "WebSocket" library
 * according to the environment providing JSON RPC 2.0 support on top.
 * @module Client
 */
"use strict"; // @ts-ignore

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _assertArgs = _interopRequireDefault(require("assert-args"));

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var _circularJson = _interopRequireDefault(require("circular-json"));

class CommonClient extends _eventemitter["default"] {
  /**
   * Instantiate a Client class.
   * @constructor
   * @param {WebSocketConstructible} WebSocketConstructible - WebSocket implementation class
   * @param {String} address - url to a websocket server
   * @param {Object} options - ws options object with reconnect parameters
   * @param {Function} generate_request_id - custom generation request Id
   * @return {CommonClient}
   */
  constructor(WebSocketConstructible) {
    var _this;

    var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ws://localhost:8080";

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$autoconnect = _ref.autoconnect,
        autoconnect = _ref$autoconnect === void 0 ? true : _ref$autoconnect,
        _ref$reconnect = _ref.reconnect,
        reconnect = _ref$reconnect === void 0 ? true : _ref$reconnect,
        _ref$reconnect_interv = _ref.reconnect_interval,
        reconnect_interval = _ref$reconnect_interv === void 0 ? 1000 : _ref$reconnect_interv,
        _ref$max_reconnects = _ref.max_reconnects,
        max_reconnects = _ref$max_reconnects === void 0 ? 5 : _ref$max_reconnects;

    var generate_request_id = arguments.length > 3 ? arguments[3] : undefined;
    super();
    _this = this;
    this.WebSocketConstructible = WebSocketConstructible;
    this.queue = {};
    this.rpc_id = 0;
    this.address = address;
    this.options = arguments[1];
    this.autoconnect = autoconnect;
    this.ready = false;
    this.reconnect = reconnect;
    this.reconnect_interval = reconnect_interval;
    this.max_reconnects = max_reconnects;
    this.current_reconnects = 0;

    this.generate_request_id = generate_request_id || function () {
      return ++_this.rpc_id;
    };

    if (this.autoconnect) this._connect(this.address, this.options);
  }
  /**
   * Connects to a defined server if not connected already.
   * @method
   * @return {Undefined}
   */


  connect() {
    if (this.socket) return;

    this._connect(this.address, this.options);
  }
  /**
   * Calls a registered RPC method on server.
   * @method
   * @param {String} method - RPC method name
   * @param {Object|Array} params - optional method parameters
   * @param {Number} timeout - RPC reply timeout value
   * @param {Object} ws_opts - options passed to ws
   * @return {Promise}
   */


  call(method, params, timeout, ws_opts) {
    var _this2 = this;

    (0, _assertArgs["default"])(arguments, {
      "method": "string",
      "[params]": ["object", Array],
      "[timeout]": "number",
      "[ws_opts]": "object"
    });

    if (!ws_opts && "object" === (0, _typeof2["default"])(timeout)) {
      ws_opts = timeout;
      timeout = null;
    }

    return new Promise(function (resolve, reject) {
      if (!_this2.ready) return reject(new Error("socket not ready"));

      var rpc_id = _this2.generate_request_id(method, params);

      var message = {
        jsonrpc: "2.0",
        method: method,
        params: params || null,
        id: rpc_id
      };

      _this2.socket.send(JSON.stringify(message), ws_opts, function (error) {
        if (error) return reject(error);
        _this2.queue[rpc_id] = {
          promise: [resolve, reject]
        };

        if (timeout) {
          _this2.queue[rpc_id].timeout = setTimeout(function () {
            _this2.queue[rpc_id] = null;
            reject(new Error("reply timeout"));
          }, timeout);
        }
      });
    });
  }
  /**
   * Logins with the other side of the connection.
   * @method
   * @param {Object} params - Login credentials object
   * @return {Promise}
   */


  login(params) {
    var _this3 = this;

    return function _callee() {
      return _regenerator["default"].async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _regenerator["default"].awrap(_this3.call("rpc.login", params));

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    }();
  }
  /**
   * Fetches a list of client's methods registered on server.
   * @method
   * @return {Array}
   */


  listMethods() {
    var _this4 = this;

    return function _callee2() {
      return _regenerator["default"].async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _regenerator["default"].awrap(_this4.call("__listMethods"));

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    }();
  }
  /**
   * Sends a JSON-RPC 2.0 notification to server.
   * @method
   * @param {String} method - RPC method name
   * @param {Object} params - optional method parameters
   * @return {Promise}
   */


  notify(method, params) {
    var _this5 = this;

    (0, _assertArgs["default"])(arguments, {
      "method": "string",
      "[params]": ["object", Array]
    });
    return new Promise(function (resolve, reject) {
      if (!_this5.ready) return reject(new Error("socket not ready"));
      var message = {
        jsonrpc: "2.0",
        method: method,
        params: params || null
      };

      _this5.socket.send(JSON.stringify(message), function (error) {
        if (error) return reject(error);
        resolve();
      });
    });
  }
  /**
   * Subscribes for a defined event.
   * @method
   * @param {String|Array} event - event name
   * @return {Undefined}
   * @throws {Error}
   */


  subscribe(event) {
    var _arguments = arguments,
        _this6 = this;

    return function _callee3() {
      var result;
      return _regenerator["default"].async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              (0, _assertArgs["default"])(_arguments, {
                event: ["string", Array]
              });
              if (typeof event === "string") event = [event];
              _context3.next = 4;
              return _regenerator["default"].awrap(_this6.call("rpc.on", event));

            case 4:
              result = _context3.sent;

              if (!(typeof event === "string" && result[event] !== "ok")) {
                _context3.next = 7;
                break;
              }

              throw new Error("Failed subscribing to an event '" + event + "' with: " + result[event]);

            case 7:
              return _context3.abrupt("return", result);

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      });
    }();
  }
  /**
   * Unsubscribes from a defined event.
   * @method
   * @param {String|Array} event - event name
   * @return {Undefined}
   * @throws {Error}
   */


  unsubscribe(event) {
    var _arguments2 = arguments,
        _this7 = this;

    return function _callee4() {
      var result;
      return _regenerator["default"].async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              (0, _assertArgs["default"])(_arguments2, {
                event: ["string", Array]
              });
              if (typeof event === "string") event = [event];
              _context4.next = 4;
              return _regenerator["default"].awrap(_this7.call("rpc.off", event));

            case 4:
              result = _context4.sent;

              if (!(typeof event === "string" && result[event] !== "ok")) {
                _context4.next = 7;
                break;
              }

              throw new Error("Failed unsubscribing from an event with: " + result);

            case 7:
              return _context4.abrupt("return", result);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      });
    }();
  }
  /**
   * Closes a WebSocket connection gracefully.
   * @method
   * @param {Number} code - socket close code
   * @param {String} data - optional data to be sent before closing
   * @return {Undefined}
   */


  close(code, data) {
    this.socket.close(code || 1000, data);
  }
  /**
   * Connection/Message handler.
   * @method
   * @private
   * @param {String} address - WebSocket API address
   * @param {Object} options - ws options object
   * @return {Undefined}
   */


  _connect(address, options) {
    var _this8 = this;

    this.socket = new this.WebSocketConstructible(address, options);
    this.socket.addEventListener("open", function () {
      _this8.ready = true;

      _this8.emit("open");

      _this8.current_reconnects = 0;
    });
    this.socket.addEventListener("message", function (_ref2) {
      var message = _ref2.data;
      if (message instanceof ArrayBuffer) message = Buffer.from(message).toString();

      try {
        message = _circularJson["default"].parse(message);
      } catch (error) {
        return;
      } // check if any listeners are attached and forward event


      if (message.notification && _this8.listeners(message.notification).length) {
        if (!Object.keys(message.params).length) return _this8.emit(message.notification);
        var args = [message.notification];
        if (message.params.constructor === Object) args.push(message.params);else // using for-loop instead of unshift/spread because performance is better
          for (var i = 0; i < message.params.length; i++) {
            args.push(message.params[i]);
          }
        return _this8.emit.apply(_this8, args);
      }

      if (!_this8.queue[message.id]) {
        // general JSON RPC 2.0 events
        if (message.method && message.params) return _this8.emit(message.method, message.params);else return;
      }

      if (_this8.queue[message.id].timeout) clearTimeout(_this8.queue[message.id].timeout);
      if (message.error) _this8.queue[message.id].promise[1](message.error);else _this8.queue[message.id].promise[0](message.result);
      _this8.queue[message.id] = null;
    });
    this.socket.addEventListener("error", function (error) {
      return _this8.emit("error", error);
    });
    this.socket.addEventListener("close", function (_ref3) {
      var code = _ref3.code,
          reason = _ref3.reason;
      if (_this8.ready) _this8.emit("close", code, reason);
      _this8.ready = false;
      if (code === 1000) return;
      _this8.current_reconnects++;
      if (_this8.reconnect && (_this8.max_reconnects > _this8.current_reconnects || _this8.max_reconnects === 0)) setTimeout(function () {
        return _this8._connect(address, options);
      }, _this8.reconnect_interval);
    });
  }

}

exports["default"] = CommonClient;