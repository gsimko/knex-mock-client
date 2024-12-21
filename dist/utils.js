"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsingFakeTimers = isUsingFakeTimers;
function isUsingFakeTimers() {
    return (typeof jest !== 'undefined' &&
        typeof setTimeout !== 'undefined' &&
        (setTimeout.hasOwnProperty('_isMockFunction') || setTimeout.hasOwnProperty('clock')));
}
