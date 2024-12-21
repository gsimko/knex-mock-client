"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockClient = void 0;
const knex_1 = __importDefault(require("knex"));
const MockConnection_1 = require("./MockConnection");
class MockClient extends knex_1.default.Client {
    isMock = true;
    constructor(config) {
        super(config);
        if (config.dialect) {
            this._attachDialectQueryCompiler(config);
        }
    }
    acquireConnection() {
        return Promise.resolve(new MockConnection_1.MockConnection());
    }
    releaseConnection() {
        return Promise.resolve();
    }
    processResponse(response) {
        return response;
    }
    setTracker(tracker) {
        // driver is copied by `makeTxClient` when using a transaction
        this.driver = this.driver || {};
        this.driver.tracker = tracker;
    }
    _query(connection, rawQuery) {
        let method = rawQuery.method;
        const rawMethod = rawQuery.method;
        switch (rawMethod) {
            case 'first':
            case 'pluck':
                rawQuery.postOp = rawMethod;
                method = 'select';
                break;
            case 'del':
                method = 'delete';
                break;
            case 'raw':
                method = rawQuery.sql.toLowerCase().trim().split(' ').shift();
                break;
        }
        const tracker = this.driver?.tracker;
        if (!tracker) {
            throw new Error('Tracker not configured for knex mock client');
        }
        return tracker._handle(connection, { ...rawQuery, method });
    }
    _attachDialectQueryCompiler(config) {
        const { resolveClientNameWithAliases } = require('knex/lib/util/helpers');
        const { SUPPORTED_CLIENTS } = require('knex/lib/constants');
        if (!SUPPORTED_CLIENTS.includes(config.dialect)) {
            throw new Error(`knex-mock-client: Unknown configuration option 'dialect' value ${config.dialect}.\nNote that it is case-sensitive, check documentation for supported values.`);
        }
        const resolvedClientName = resolveClientNameWithAliases(config.dialect);
        const Dialect = require(`knex/lib/dialects/${resolvedClientName}/index.js`);
        const dialect = new Dialect(config);
        Object.setPrototypeOf(this.constructor.prototype, dialect); // make the specific dialect client to be the prototype of this class.
    }
}
exports.MockClient = MockClient;
