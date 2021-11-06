import { ILog } from "../../../talon/ILog";
import { MethodActivation } from "../../../talon/runtime/MethodActivation";
import { Thread } from "../../../talon/runtime/Thread";
import * as ts from "ts-mockito";
import { Method } from "../../../talon/common/Method";
import { Type } from "../../../talon/common/Type";
import { Instruction } from "../../../talon/common/Instruction";
import { Memory } from "../../../talon/runtime/common/Memory";
import { Any } from "../../../talon/library/Any";
import { TypeOfHandler } from "../../../talon/runtime/handlers/TypeOfHandler";
import { EvaluationResult } from "../../../talon/runtime/EvaluationResult";
import { RuntimeBoolean } from "../../../talon/runtime/library/RuntimeBoolean";
import { Log } from "../../../talon/Log";
import { Stopwatch } from "../../../talon/Stopwatch";
import { IPerformanceRuler } from "../../../talon/IPerformanceRuler";
import { ITimeOutput } from "../../../talon/ITimeOutput";
import { RuntimeTest } from "../../RuntimeTest";

describe("TypeOfHandler", () => {
    const matchingTypeName = "test";
    const nonMatchingTypeName = "test2";
    const matchingType = new Type(matchingTypeName, Any.typeName);
    const nonMatchingType = new Type(nonMatchingTypeName, Any.typeName);
    const handler = new TypeOfHandler();

    let test:RuntimeTest;

    beforeAll(() => {
        RuntimeTest.initializeWith(matchingType, nonMatchingType);
    });

    beforeEach(() => {        
        test = RuntimeTest.activateMethodWith(Instruction.isTypeOf(matchingTypeName));
    });

    it("has a matching type on the stack", () => {
        handleAndVerify(matchingType, true, "because the requested type check should match the allocated type");
    });

    it("has a non-matching type on the stack", () => {
        handleAndVerify(nonMatchingType, false, "because the requested type check should not match the allocated type");
    });

    function handleAndVerify(allocatedType:Type, expectedBoolValue:boolean, because:string){
        test.allocateOntoStack(allocatedType);
        
        const result = test.handleCurrentInstructionWith(handler);

        test.expects(result).toBe(EvaluationResult.Continue, "because the handle operation should have been successful");
        test.expects(test.stackSize).toBe(1, "because a single result should have been pushed onto the stack");

        test.expectsTopOfStack(isType => {
            test.expects(isType).toBeInstanceOf(RuntimeBoolean, "because the result of handling should produce a boolean value");
            test.expects(isType).asType(RuntimeBoolean, x => test.expects(x.value).toBe(expectedBoolValue, because));
        });
    }
});