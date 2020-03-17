"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCodeHandler_1 = require("../OpCodeHandler");
class PrintHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.output = output;
    }
    handle(executionPoint) {
        const text = executionPoint.currentMethod.pop();
        if (text instanceof RuntimeString_1.RuntimeString) {
            this.output.write(text.value);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Encountered a type other than string");
        }
        return super.handle(executionPoint);
    }
}
exports.PrintHandler = PrintHandler;
//# sourceMappingURL=PrintHandler.js.map