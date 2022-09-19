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
const loader = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch("http://localhost:3000/splits", {
        method: "POST",
        credentials: "include",
    });
    console.log(res);
    const j = yield res.json();
    return (0, node_1.redirect)(`/${j.id}`, { headers: res.headers });
});
exports.loader = loader;
function Index() {
    return null;
}
exports.default = Index;
