"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
exports.getRandomInt = getRandomInt;
function getRandomBool() {
    return Math.random() > 0.5;
}
exports.getRandomBool = getRandomBool;
function getRandomBetween(from, to) {
    return from + getRandomInt(from - to);
}
exports.getRandomBetween = getRandomBetween;
//# sourceMappingURL=random.js.map