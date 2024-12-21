import knex, { Knex } from 'knex';
import { RawQuery } from '../types/mock-client';
import { MockConnection } from './MockConnection';
import { Tracker } from './Tracker';
export declare class MockClient extends knex.Client {
    readonly isMock = true;
    constructor(config: Knex.Config);
    acquireConnection(): Promise<MockConnection>;
    releaseConnection(): Promise<void>;
    processResponse(response: any): any;
    setTracker(tracker: Tracker): void;
    _query(connection: MockConnection, rawQuery: RawQuery): Promise<any>;
    private _attachDialectQueryCompiler;
}
