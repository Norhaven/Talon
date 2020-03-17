"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCode_1 = require("./OpCode");
class Instruction {
    constructor(opCode, value) {
        this.opCode = OpCode_1.OpCode.NoOp;
        this.opCode = opCode;
        this.value = value;
    }
    static loadString(value) {
        return new Instruction(OpCode_1.OpCode.LoadString, value);
    }
    static print() {
        return new Instruction(OpCode_1.OpCode.Print);
    }
}
exports.Instruction = Instruction;
//# sourceMappingURL=Instruction.js.map