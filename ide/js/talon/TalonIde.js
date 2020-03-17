"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonCompiler_1 = require("./compiler/TalonCompiler");
const PaneOutput_1 = require("./PaneOutput");
const TalonRuntime_1 = require("./runtime/TalonRuntime");
class TalonIde {
    constructor() {
        console.log("Creating IDE");
        this.gamePane = document.getElementById("game-pane");
        const button = document.getElementById("compile");
        button === null || button === void 0 ? void 0 : button.addEventListener('click', e => {
            this.run();
        });
    }
    run() {
        console.log("RUNNING");
        const compiler = new TalonCompiler_1.TalonCompiler();
        const types = compiler.compile("");
        const userOutput = new PaneOutput_1.PaneOutput(this.gamePane);
        const runtime = new TalonRuntime_1.TalonRuntime(userOutput);
        runtime.loadFrom(types);
        runtime.send("");
        return "Compiled";
    }
}
exports.TalonIde = TalonIde;
//# sourceMappingURL=TalonIde.js.map