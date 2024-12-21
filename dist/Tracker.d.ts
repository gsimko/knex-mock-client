import { FunctionQueryMatcher, QueryMatcher, RawQuery } from '../types/mock-client';
import { queryMethods } from './constants';
import { MockConnection } from './MockConnection';
export type TransactionState = {
    id: number;
    parent?: number;
    state: 'ongoing' | 'committed' | 'rolled back';
    queries: RawQuery[];
};
interface Handler<T = any> {
    data: T | ((rawQuery: RawQuery) => T);
    match: FunctionQueryMatcher;
    error?: string | Error;
    once?: true;
}
type ResponseTypes = {
    response: <T = any>(data: Handler<T>['data']) => Tracker;
    responseOnce: <T = any>(data: Handler<T>['data']) => Tracker;
    simulateError: (error: Handler['error']) => Tracker;
    simulateErrorOnce: (error: Handler['error']) => Tracker;
};
type QueryMethodType = (typeof queryMethods)[number];
type History = Record<QueryMethodType, RawQuery[]> & {
    transactions: TransactionState[];
    all: RawQuery[];
};
export declare class Tracker {
    readonly history: History;
    readonly on: Record<QueryMethodType, (rawQueryMatcher: QueryMatcher) => ResponseTypes>;
    private responses;
    constructor();
    _handle(connection: MockConnection, rawQuery: RawQuery): Promise<any>;
    reset(): void;
    resetHandlers(): void;
    resetHistory(): void;
    private receiveTransactionCommand;
    private prepareMatcher;
    private prepareStatement;
    private static applyPostOp;
}
export {};
