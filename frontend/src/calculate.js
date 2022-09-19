"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculate = void 0;
function calculate(items, splitters, total) {
    const owage = {};
    let subtotal = 0;
    for (const splitter of splitters) {
        owage[splitter] = 0;
    }
    for (const item of items) {
        if (item.splitters.size === 0 || item.price === undefined) {
            continue;
        }
        subtotal += item.price;
        for (const splitter of item.splitters) {
            owage[splitter] += item.price / item.splitters.size;
        }
    }
    const multiplier = total / subtotal;
    const subtotals = Object.assign({}, owage);
    for (const key in owage) {
        owage[key] *= multiplier;
    }
    return {
        subtotal,
        subtotals,
        owage,
    };
}
exports.calculate = calculate;
