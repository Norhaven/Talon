"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
class NoOpHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(executionPoint) {
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.NoOpHandler = NoOpHandler;
//# sourceMappingURL=NoOpHandler.js.map