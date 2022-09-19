"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Owage = void 0;
const react_1 = __importDefault(require("react"));
function getUrl({ recipient, amount, note, }) {
    const urlParams = new URLSearchParams({
        recipients: recipient,
        amount,
        note,
        audience: "private",
    });
    return `https://venmo.com/?${urlParams.toString()}`;
}
const Owage = ({ name, amount, venmo, description, }) => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("span", null,
            name,
            " owes ",
            amount.toFixed(2)),
        react_1.default.createElement("a", { target: "_blank", href: getUrl({
                recipient: venmo,
                amount: amount.toFixed(2),
                note: description,
            }) }, "Pay with Venmo")));
};
exports.Owage = Owage;
