"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonCompiler_1 = require("../talon/compiler/TalonCompiler");
const TalonRuntime_1 = require("../talon/runtime/TalonRuntime");
const ConsoleOutput_1 = require("../talon/ConsoleOutput");
describe('run', function () {
    it('everything', function () {
        const compiler = new TalonCompiler_1.TalonCompiler();
        const types = compiler.compile("");
        const output = new ConsoleOutput_1.ConsoleOutput();
        const runtime = new TalonRuntime_1.TalonRuntime(output);
        runtime.loadFrom(types);
        runtime.send("");
    });
});
//# sourceMappingURL=main.test.js.map