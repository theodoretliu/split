"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = void 0;
const node_1 = require("@remix-run/node");
const react_1 = require("@remix-run/react");
const loader = ({ params, request }) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`http://localhost:3000/splits/${params.splitId}`, {
        headers: {
            cookie: request.headers.get("cookie"),
        },
    });
    const j = yield res.json();
    return (0, node_1.json)(j, { headers: res.headers });
});
exports.loader = loader;
function Split() {
    const data = (0, react_1.useLoaderData)();
    return React.createElement("div", null, JSON.stringify(data));
}
exports.default = Split;
