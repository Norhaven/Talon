"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
class LoadStringHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(executionPoint) {
        const value = executionPoint.currentInstruction.value;
        if (typeof value === "string") {
            const stringValue = new RuntimeString_1.RuntimeString(value);
            executionPoint.currentMethod.push(stringValue);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Expected a string");
        }
        return super.handle(executionPoint);
    }
}
exports.LoadStringHandler = LoadStringHandler;
//# sourceMappingURL=LoadStringHandler.js.map