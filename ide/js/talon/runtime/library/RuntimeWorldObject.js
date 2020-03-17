"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const WorldObject_1 = require("../../library/WorldObject");
const Any_1 = require("../../library/Any");
class RuntimeWorldObject extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = WorldObject_1.WorldObject.typeName;
    }
}
exports.RuntimeWorldObject = RuntimeWorldObject;
//# sourceMappingURL=RuntimeWorldObject.js.map