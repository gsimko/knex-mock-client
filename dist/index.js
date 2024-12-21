"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = exports.MockClient = void 0;
exports.createTracker = createTracker;
const Tracker_1 = require("./Tracker");
var MockClient_1 = require("./MockClient");
Object.defineProperty(exports, "MockClient", { enumerable: true, get: function () { return MockClient_1.MockClient; } });
var Tracker_2 = require("./Tracker");
Object.defineProperty(exports, "Tracker", { enumerable: true, get: function () { return Tracker_2.Tracker; } });
function createTracker(db) {
    const tracker = new Tracker_1.Tracker();
    db.client.setTracker(tracker);
    return tracker;
}
