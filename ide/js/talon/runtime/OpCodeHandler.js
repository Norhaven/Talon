"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCode_1 = require("../common/OpCode");
const EvaluationResult_1 = require("./EvaluationResult");
class OpCodeHandler {
    constructor() {
        this.code = OpCode_1.OpCode.NoOp;
    }
    handle(executionPoint) {
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.OpCodeHandler = OpCodeHandler;
//# sourceMappingURL=OpCodeHandler.js.map