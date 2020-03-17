"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../common/Type");
const Method_1 = require("../common/Method");
const Any_1 = require("../library/Any");
const Instruction_1 = require("../common/Instruction");
const EntryPointAttribute_1 = require("../library/EntryPointAttribute");
class TalonCompiler {
    compile(code) {
        const entryPoint = this.createEntryPoint();
        return [entryPoint];
    }
    createEntryPoint() {
        const type = new Type_1.Type();
        type.attributes.push(new EntryPointAttribute_1.EntryPointAttribute());
        const main = new Method_1.Method();
        main.name = Any_1.Any.main;
        main.body.push(Instruction_1.Instruction.loadString("Hi"), Instruction_1.Instruction.print());
        type.methods.push(main);
        return type;
    }
}
exports.TalonCompiler = TalonCompiler;
//# sourceMappingURL=TalonCompiler.js.map