"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockConnection = void 0;
class Stack {
    values = [];
    push(value) {
        this.values.push(value);
    }
    pop() {
        const [lastItem] = this.values.splice(this.values.length - 1);
        return lastItem;
    }
    /**
     * Peek at a value on the stack without removing it.
     *
     * @param offset {number} Offset from the top of the stack to peek. Default to 0.
     */
    peek(offset = 0) {
        return this.values[this.values.length - offset - 1];
    }
    /**
     * Points the stack to the first occurrence of the given value.
     *
     * If the given value is not on the stack, push it to the top.
     * If the given value is already in the stack, remove all the transactions above it.
     * If the given value is undefined, clears the stack.
     */
    pointTo(value) {
        if (this.peek() === value)
            return;
        if (value === undefined) {
            // Clear the stack
            this.values.splice(0);
            return;
        }
        const index = this.values.indexOf(value);
        if (index >= 0) {
            this.values.splice(index + 1);
        }
        else {
            this.values.push(value);
        }
    }
}
class MockConnection {
    __knexUid = Math.trunc(Math.random() * 1e6);
    fakeConnection = true;
    transactionStack = new Stack();
    beginTransaction(cb) { cb(); }
    commitTransaction(cb) { cb(); }
}
exports.MockConnection = MockConnection;
