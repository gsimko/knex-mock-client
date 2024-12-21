"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionCommands = exports.queryMethods = void 0;
exports.queryMethods = ['select', 'insert', 'update', 'delete', 'any'];
exports.transactionCommands = [
    'BEGIN;',
    'COMMIT;',
    'ROLLBACK',
    'SAVEPOINT',
    'RELEASE SAVEPOINT',
    'SET TRANSACTION ISOLATION LEVEL',
    'BEGIN TRANSACTION ISOLATION LEVEL',
];
