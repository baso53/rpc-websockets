"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Client = void 0;

var _websocket = _interopRequireDefault(require("./lib/client/websocket.browser"));

var _client = _interopRequireDefault(require("./lib/client"));

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