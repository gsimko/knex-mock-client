"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class Tracker {
    history = {
        ...Object.fromEntries(constants_1.queryMethods.map((method) => [method, []])),
        transactions: [],
        all: [],
    };
    on = Object.fromEntries(constants_1.queryMethods.map((method) => [method, this.prepareStatement(method)]));
    responses = new Map();
    constructor() {
        this.reset();
    }
    _handle(connection, rawQuery) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                if (this.receiveTransactionCommand(connection, rawQuery)) {
                    return resolve(undefined);
                }
                this.history.all.push(rawQuery);
                const possibleMethods = [rawQuery.method, 'any'];
                for (const method of possibleMethods) {
                    const handlers = this.responses.get(method) || [];
                    for (let i = 0; i < handlers.length; i++) {
                        const handler = handlers[i];
                        if (handler.match(rawQuery)) {
                            this.history[method].push(rawQuery);
                            if (handler.error) {
                                reject(handler.error instanceof Error ? handler.error : new Error(handler.error));
                            }
                            else {
                                const data = typeof handler.data === 'function' ? await handler.data(rawQuery) : handler.data;
                                if (data instanceof Error)
                                    reject(data);
                                else
                                    resolve((0, lodash_clonedeep_1.default)(Tracker.applyPostOp(data, rawQuery)));
                            }
                            if (handler.once) {
                                handlers.splice(i, 1);
                            }
                            return;
                        }
                    }
                }
                reject(new Error(`Mock handler not found`));
            }, 0);
            if ((0, utils_1.isUsingFakeTimers)()) {
                /**
                 * Based on https://github.com/testing-library/react-testing-library/commit/403aa5cd8479c9778174fad76b59b02a470c7d1b
                 * without this, a test using fake timers would never get microtasks actually flushed.
                 */
                jest.advanceTimersByTime(0);
            }
        });
    }
    reset() {
        this.resetHandlers();
        this.resetHistory();
    }
    resetHandlers() {
        constants_1.queryMethods.forEach((method) => this.responses.set(method, []));
    }
    resetHistory() {
        this.history.transactions = [];
        this.history.all = [];
        constants_1.queryMethods.forEach((method) => (this.history[method] = []));
    }
    receiveTransactionCommand(connection, rawQuery) {
        const txId = connection.transactionStack.peek(0);
        const txState = txId === undefined ? undefined : this.history.transactions[txId];
        const trxCommand = constants_1.transactionCommands.find((trxCommand) => rawQuery.sql.startsWith(trxCommand));
        switch (trxCommand) {
            case 'BEGIN;':
            case 'SAVEPOINT': {
                const newTxState = {
                    id: this.history.transactions.length,
                    state: 'ongoing',
                    queries: [],
                    ...(txId !== undefined && { parent: txId }),
                };
                this.history.transactions.push(newTxState);
                connection.transactionStack.pointTo(newTxState.id);
                break;
            }
            case 'COMMIT;':
            case 'RELEASE SAVEPOINT': {
                if (txState) {
                    txState.state = 'committed';
                    connection.transactionStack.pointTo(txState.parent);
                }
                break;
            }
            case 'ROLLBACK': {
                if (txState) {
                    txState.state = 'rolled back';
                    connection.transactionStack.pointTo(txState.parent);
                }
                break;
            }
            case undefined:
                txState?.queries.push(rawQuery);
                return false;
        }
        return true;
    }
    prepareMatcher(rawQueryMatcher) {
        if (typeof rawQueryMatcher === 'string' && rawQueryMatcher) {
            return (rawQuery) => rawQuery.sql.includes(rawQueryMatcher);
        }
        else if (rawQueryMatcher instanceof RegExp) {
            return (rawQuery) => rawQueryMatcher.test(rawQuery.sql);
        }
        else if (typeof rawQueryMatcher === 'function') {
            return rawQueryMatcher;
        }
        throw new Error('Given invalid query matcher');
    }
    prepareStatement(queryMethod) {
        return (rawQueryMatcher) => {
            const matcher = this.prepareMatcher(rawQueryMatcher);
            return {
                response: (data) => {
                    const handlers = this.responses.get(queryMethod) || [];
                    handlers.push({ match: matcher, data });
                    return this;
                },
                responseOnce: (data) => {
                    const handlers = this.responses.get(queryMethod) || [];
                    handlers.push({ match: matcher, data, once: true });
                    return this;
                },
                simulateError: (error) => {
                    const handlers = this.responses.get(queryMethod) || [];
                    handlers.push({ match: matcher, data: null, error });
                    return this;
                },
                simulateErrorOnce: (error) => {
                    const handlers = this.responses.get(queryMethod) || [];
                    handlers.push({ match: matcher, data: null, once: true, error });
                    return this;
                },
            };
        };
    }
    static applyPostOp(data, rawQuery) {
        if (rawQuery.postOp === 'first' && Array.isArray(data)) {
            return data[0];
        }
        else if (rawQuery.postOp === 'pluck' && rawQuery.pluck && Array.isArray(data)) {
            return data.map((item) => item[rawQuery.pluck]);
        }
        return data;
    }
}
exports.Tracker = Tracker;
