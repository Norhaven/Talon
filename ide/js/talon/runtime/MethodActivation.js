"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StackFrame_1 = require("./StackFrame");
class MethodActivation {
    constructor(method) {
        this.stack = [];
        this.method = method;
        this.stackFrame = new StackFrame_1.StackFrame(method);
    }
    pop() {
        return this.stack.pop();
    }
    push(runtimeAny) {
        this.stack.push(runtimeAny);
    }
}
exports.MethodActivation = MethodActivation;
//# sourceMappingURL=MethodActivation.js.map