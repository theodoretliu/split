"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = void 0;
const react_1 = require("@remix-run/react");
const meta = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
});
exports.meta = meta;
function App() {
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement(react_1.Meta, null),
            React.createElement(react_1.Links, null)),
        React.createElement("body", null,
            React.createElement(react_1.Outlet, null),
            React.createElement(react_1.ScrollRestoration, null),
            React.createElement(react_1.Scripts, null),
            React.createElement(react_1.LiveReload, null))));
}
exports.default = App;
