"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("../../library/Any");
class RuntimeAny {
    constructor() {
        this.parentTypeName = "";
        this.typeName = Any_1.Any.typeName;
        this.fields = [];
    }
    toString() {
        return this.typeName;
    }
}
exports.RuntimeAny = RuntimeAny;
//# sourceMappingURL=RuntimeAny.js.map