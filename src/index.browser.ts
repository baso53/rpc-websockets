"use strict"

import WebSocketBrowserImpl from "./lib/client/websocket.browser"
import clientFactory from "./lib/client"

export class Client extends clientFactory {
    constructor(
        address = "ws://localhost:8080",
        {
            autoconnect = true,
            reconnect = true,
            reconnect_interval = 1000,
            max_reconnects = 5
        } = {},
        generate_request_id?: (method: string, params: object | Array<any>) => number
    ) {
        super(
            WebSocketBrowserImpl,
            address,
            {
                autoconnect,
                reconnect,
                reconnect_interval,
                max_reconnects
            },
            generate_request_id
        );
    }
}