"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remix-run/react");
const server_1 = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
    let markup = (0, server_1.renderToString)(React.createElement(react_1.RemixServer, { context: remixContext, url: request.url }));
    responseHeaders.set("Content-Type", "text/html");
    return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
    });
}
exports.default = handleRequest;
