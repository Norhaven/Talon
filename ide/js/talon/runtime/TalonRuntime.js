"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutionPoint_1 = require("./ExecutionPoint");
const EntryPointAttribute_1 = require("../library/EntryPointAttribute");
const Any_1 = require("../library/Any");
const MethodActivation_1 = require("./MethodActivation");
const EvaluationResult_1 = require("./EvaluationResult");
const OpCode_1 = require("../common/OpCode");
const PrintHandler_1 = require("./handlers/PrintHandler");
const NoOpHandler_1 = require("./handlers/NoOpHandler");
const LoadStringHandler_1 = require("./handlers/LoadStringHandler");
class TalonRuntime {
    constructor(userOutput) {
        this.types = [];
        this.handlers = new Map();
        this.userOutput = userOutput;
        this.handlers.set(OpCode_1.OpCode.NoOp, new NoOpHandler_1.NoOpHandler());
        this.handlers.set(OpCode_1.OpCode.LoadString, new LoadStringHandler_1.LoadStringHandler());
        this.handlers.set(OpCode_1.OpCode.Print, new PrintHandler_1.PrintHandler(this.userOutput));
    }
    start() {
    }
    stop() {
    }
    loadFrom(types) {
        const entryPoint = types.find(x => x.attributes.findIndex(attribute => attribute instanceof EntryPointAttribute_1.EntryPointAttribute) > -1);
        const mainMethod = entryPoint === null || entryPoint === void 0 ? void 0 : entryPoint.methods.find(x => x.name == Any_1.Any.main);
        const activation = new MethodActivation_1.MethodActivation(mainMethod);
        this.executionPoint = new ExecutionPoint_1.ExecutionPoint(activation);
    }
    send(input) {
        this.runWith(input);
    }
    runWith(input) {
        var _a;
        while (this.evaluateCurrentInstruction() == EvaluationResult_1.EvaluationResult.Continue) {
            (_a = this.executionPoint) === null || _a === void 0 ? void 0 : _a.moveNext();
        }
    }
    evaluateCurrentInstruction() {
        var _a;
        const instruction = (_a = this.executionPoint) === null || _a === void 0 ? void 0 : _a.currentInstruction;
        const handler = this.handlers.get(instruction === null || instruction === void 0 ? void 0 : instruction.opCode);
        return handler === null || handler === void 0 ? void 0 : handler.handle(this.executionPoint);
    }
}
exports.TalonRuntime = TalonRuntime;
//# sourceMappingURL=TalonRuntime.js.map