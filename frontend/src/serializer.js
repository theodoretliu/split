"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromString = exports.toString = void 0;
function toIntermediate(state) {
    const splitters = Array.from(state.splitters).sort();
    let data = [];
    for (let item of state.items) {
        let datum = [item.name, item.price];
        for (let splitter of splitters) {
            if (item.splitters.has(splitter)) {
                datum.push(1);
            }
            else {
                datum.push(0);
            }
        }
        data.push(datum);
    }
    return {
        splitters,
        data,
        total: state.total,
        venmo: state.venmo,
        description: state.description,
    };
}
function fromIntermediate(intermediate) {
    let splittersSet = new Set(intermediate.splitters);
    let items = [];
    for (let datum of intermediate.data) {
        let splits = datum.slice(2);
        items.push({
            name: datum[0],
            price: datum[1],
            splitters: new Set(intermediate.splitters.filter((_splitter, i) => splits[i] === 1)),
        });
    }
    return {
        items,
        splitters: splittersSet,
        total: intermediate.total,
        venmo: intermediate.venmo,
        description: intermediate.description,
    };
}
function toString(state) {
    return btoa(JSON.stringify(toIntermediate(state)));
}
exports.toString = toString;
function fromString(str) {
    return fromIntermediate(JSON.parse(atob(str)));
}
exports.fromString = fromString;
