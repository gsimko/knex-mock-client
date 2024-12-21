import { Knex } from 'knex';
import { Tracker } from './Tracker';
export { MockClient } from './MockClient';
export { Tracker } from './Tracker';
export type { RawQuery, QueryMatcher, FunctionQueryMatcher } from '../types/mock-client';
export declare function createTracker(db: Knex): Tracker;
