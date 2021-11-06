import { Type } from "../../../talon/common/Type";
import { Any } from "../../../talon/library/Any";
import { Place } from "../../../talon/library/Place";
import { Memory } from "../../../talon/runtime/common/Memory";
import { RuntimeError } from "../../../talon/runtime/errors/RuntimeError";
import { RuntimeTest } from "../../RuntimeTest";
import * as test from "../../TestExpectationBuilder";

describe("Memory", () => {
    const typeName = "test";
    const derivedTypeName = "derived";
    const invalidTypeName = "invalid";
    const placeTypeName = "derivedPlace";
    const type = new Type(typeName, Any.typeName);
    const derivedType = new Type(derivedTypeName, typeName);
    const invalidType = new Type(invalidTypeName, "");
    const placeType = new Type(placeTypeName, Place.typeName);

    beforeAll(() => {
        RuntimeTest.initializeWith(type, invalidType, derivedType, placeType);
    });

    beforeEach(() => {
    });

    it("will allocate a type that is directly derived from Any", () => {
        const allocatedType = Memory.allocate(type);

        test.expects(allocatedType.typeName).toBe(typeName, "because that was the name of the type in the allocation request");
    });

    it("will throw a RuntimeError when the type does not descend from a known type", () => {
        test.expects(() => Memory.allocate(invalidType)).toThrowErrorOfType(RuntimeError, "because the type must descend from a system type");
    });

    it("will allocate a type that is indirectly derived from a system type", () => {
        const allocatedType = Memory.allocate(derivedType);

        test.expects(allocatedType.typeName).toBe(derivedTypeName, "because that was the name of the type in the allocation request");
    });

    it("will allocate a type derived from Place", () => {
        const allocatedPlace = Memory.allocate(placeType);

        test.expects(allocatedPlace.typeName).toBe(placeTypeName, "because that was the name of the type in the allocation request");
        test.expects(allocatedPlace.base).toBeDefined(`because the type should have a base type of ${Place.typeName}`);
        test.expects(allocatedPlace.base?.typeName).toBe(Place.typeName, `because the type should have a base type of ${Place.typeName}`);
    });
});