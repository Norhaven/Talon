"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Variable_1 = require("./library/Variable");
class StackFrame {
    constructor(method) {
        this.locals = [];
        this.currentInstruction = 0;
        for (var parameter of method.parameters) {
            const variable = new Variable_1.Variable(parameter.name, parameter.type);
            this.locals.push(variable);
        }
    }
}
exports.StackFrame = StackFrame;
//# sourceMappingURL=StackFrame.js.map