"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Client = void 0;

var _websocket = _interopRequireDefault(require("./lib/client/websocket.browser"));

var _client = _interopRequireDefault(require("./lib/client"));

class Client extends _client["default"] {
  constructor() {
    var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ws://localhost:8080";

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$autoconnect = _ref.autoconnect,
        autoconnect = _ref$autoconnect === void 0 ? true : _ref$autoconnect,
        _ref$reconnect = _ref.reconnect,
        reconnect = _ref$reconnect === void 0 ? true : _ref$reconnect,
        _ref$reconnect_interv = _ref.reconnect_interval,
        reconnect_interval = _ref$reconnect_interv === void 0 ? 1000 : _ref$reconnect_interv,
        _ref$max_reconnects = _ref.max_reconnects,
        max_reconnects = _ref$max_reconnects === void 0 ? 5 : _ref$max_reconnects;

    var generate_request_id = arguments.length > 2 ? arguments[2] : undefined;
    super(_websocket["default"], address, {
      autoconnect: autoconnect,
      reconnect: reconnect,
      reconnect_interval: reconnect_interval,
      max_reconnects: max_reconnects
    }, generate_request_id);
  }

}

exports.Client = Client;