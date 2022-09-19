"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const immer_1 = __importStar(require("immer"));
const calculate_1 = require("./calculate");
const serializer_1 = require("./serializer");
const Owage_1 = require("./Owage");
(0, immer_1.enableMapSet)();
function App() {
    const [state, setState] = (0, react_1.useState)(() => {
        const searchParams = new URL(document.location).searchParams;
        if (searchParams.has("q")) {
            try {
                return (0, serializer_1.fromString)(searchParams.get("q"));
            }
            catch (_a) { }
        }
        return {
            items: [{ name: "", splitters: new Set() }],
            splitters: new Set([]),
            total: undefined,
            venmo: "",
            description: "",
        };
    });
    const setVenmo = (0, react_1.useCallback)((venmo) => setState((0, immer_1.default)((state) => {
        state.venmo = venmo;
    })), []);
    const setDescription = (0, react_1.useCallback)((description) => setState((0, immer_1.default)((state) => {
        state.description = description;
    })), []);
    const addSplitter = (0, react_1.useCallback)((splitter) => setState((0, immer_1.default)((state) => {
        state.splitters.add(splitter);
    })), [state.splitters]);
    const addItem = (0, react_1.useCallback)(() => setState((0, immer_1.default)((state) => {
        state.items.push({ splitters: new Set() });
    })), [state.splitters]);
    const changeItemName = (0, react_1.useCallback)((i, name) => setState((0, immer_1.default)((state) => {
        state.items[i].name = name;
    })), []);
    const changeItemPrice = (0, react_1.useCallback)((i, price) => setState((0, immer_1.default)((state) => {
        state.items[i].price = price;
    })), []);
    const toggleItemName = (0, react_1.useCallback)((i, splitter) => setState((0, immer_1.default)((state) => {
        if (state.items[i].splitters.has(splitter)) {
            state.items[i].splitters.delete(splitter);
        }
        else {
            state.items[i].splitters.add(splitter);
        }
    })), []);
    const sortedSplitters = (0, react_1.useMemo)(() => [...state.splitters].sort(), [state.splitters]);
    const owage = (0, calculate_1.calculate)(state.items, sortedSplitters, state.total || 0);
    (0, react_1.useEffect)(() => {
        window.history.replaceState(null, "", `/?q=${(0, serializer_1.toString)(state)}`);
    });
    const [addedName, setAddedName] = (0, react_1.useState)("");
    return (React.createElement("div", { className: "App" },
        React.createElement("div", null,
            React.createElement("label", null, "Venmo Username"),
            React.createElement("input", { type: "text", value: state.venmo, onChange: (e) => setVenmo(e.target.value) })),
        React.createElement("div", null,
            React.createElement("label", null, "Description"),
            React.createElement("input", { type: "text", value: state.description, onChange: (e) => setDescription(e.target.value) })),
        React.createElement("div", null,
            React.createElement("label", null, "Add Splitter"),
            React.createElement("input", { type: "text", value: addedName, onChange: (e) => setAddedName(e.target.value), onKeyPress: (e) => {
                    if (e.key === "Enter") {
                        addSplitter(addedName);
                        setAddedName("");
                    }
                } }),
            React.createElement("button", { tabIndex: -1, onClick: () => {
                    addSplitter(addedName);
                    setAddedName("");
                } }, "Add Splitter")),
        React.createElement("table", null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Item Name"),
                    React.createElement("th", null, "Price"),
                    sortedSplitters.map((splitter) => (React.createElement("th", null, splitter))))),
            React.createElement("tbody", null,
                state.items.map((item, i) => {
                    return (React.createElement("tr", { key: i },
                        React.createElement("td", null,
                            React.createElement("input", { type: "text", value: item.name, onChange: (e) => changeItemName(i, e.target.value) })),
                        React.createElement("td", null,
                            React.createElement("input", { type: "number", value: item.price, onChange: (e) => changeItemPrice(i, parseFloat(e.target.value)), onKeyDown: (e) => {
                                    if (e.key === "Tab" &&
                                        !e.shiftKey &&
                                        i === state.items.length - 1) {
                                        addItem();
                                    }
                                } })),
                        sortedSplitters.map((splitter) => {
                            return (React.createElement("td", { style: {
                                    width: "24px",
                                    backgroundColor: item.splitters.has(splitter)
                                        ? "black"
                                        : "",
                                    border: "1px solid blue",
                                }, onClick: () => toggleItemName(i, splitter) }));
                        })));
                }),
                React.createElement("tr", null,
                    React.createElement("td", null, "Subtotal"),
                    React.createElement("td", null, owage.subtotal.toFixed(2)),
                    sortedSplitters.map((splitter) => (React.createElement("td", null, owage.subtotals[splitter].toFixed(2))))))),
        React.createElement("button", { onClick: addItem }, "Add Item"),
        React.createElement("div", null,
            React.createElement("span", null, "Total: "),
            React.createElement("input", { type: "number", value: state.total, onChange: (e) => setState((0, immer_1.default)((state) => {
                    state.total = parseFloat(e.target.value);
                })) })),
        sortedSplitters.map((splitter) => (React.createElement(Owage_1.Owage, { key: splitter, name: splitter, amount: owage.owage[splitter], venmo: state.venmo, description: state.description })))));
}
exports.default = App;
