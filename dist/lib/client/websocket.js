/* A wrapper for the "qaap/uws-bindings" library. */
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ws = _interopRequireDefault(require("ws"));

class NodeWebSocketImpl extends _ws["default"] {
  constructor(address, options) {
    super(address, options);
  }

}

exports["default"] = NodeWebSocketImpl;