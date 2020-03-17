"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExecutionPoint {
    constructor(method) {
        this.methods = [];
        this.methods.push(method);
    }
    get currentMethod() {
        return this.methods[this.methods.length - 1];
    }
    get currentInstruction() {
        var _a;
        const activation = this.currentMethod;
        return (_a = activation.method) === null || _a === void 0 ? void 0 : _a.body[activation.stackFrame.currentInstruction];
    }
    moveNext() {
        this.methods[this.methods.length - 1].stackFrame.currentInstruction++;
    }
}
exports.ExecutionPoint = ExecutionPoint;
//# sourceMappingURL=ExecutionPoint.js.map