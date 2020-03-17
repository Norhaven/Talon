"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaneOutput {
    constructor(pane) {
        this.pane = pane;
    }
    write(line) {
        this.pane.innerHTML += line;
    }
}
exports.PaneOutput = PaneOutput;
//# sourceMappingURL=PaneOutput.js.map