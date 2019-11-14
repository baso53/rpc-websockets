"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Server", {
  enumerable: true,
  get: function () {
    return _server.default;
  }
});
exports.Client = void 0;

var _websocket = _interopRequireDefault(require("./lib/client/websocket"));

var _client = _interopRequireDefault(require("./lib/client"));

var _server = _interopRequireDefault(require("./lib/server"));

class Client extends _client.default {
  constructor(address = "ws://localhost:8080", {
    autoconnect = true,
    reconnect = true,
    reconnect_interval = 1000,
    max_reconnects = 5
  } = {}, generate_request_id) {
    super(_websocket.default, address, {
      autoconnect,
      reconnect,
      reconnect_interval,
      max_reconnects
    }, generate_request_id);
  }

}

exports.Client = Client;