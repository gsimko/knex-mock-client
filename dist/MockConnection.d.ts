declare class Stack<T> {
    private readonly values;
    push(value: T): void;
    pop(): T | undefined;
    /**
     * Peek at a value on the stack without removing it.
     *
     * @param offset {number} Offset from the top of the stack to peek. Default to 0.
     */
    peek(offset?: number): T | undefined;
    /**
     * Points the stack to the first occurrence of the given value.
     *
     * If the given value is not on the stack, push it to the top.
     * If the given value is already in the stack, remove all the transactions above it.
     * If the given value is undefined, clears the stack.
     */
    pointTo(value: T | undefined): void;
}
export declare class MockConnection {
    __knexUid: number;
    readonly fakeConnection = true;
    transactionStack: Stack<number>;
    beginTransaction(cb: () => void): void;
    commitTransaction(cb: () => void): void;
}
export {};
