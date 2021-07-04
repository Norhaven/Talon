import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { WorldObject } from "../../library/WorldObject";
import { InstanceCallHandler } from "./InstanceCallHandler";
import { OpCode } from "../../common/OpCode";

export class DescribeHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.InstanceCall;

    handle(thread:Thread){

        const describeType = new InstanceCallHandler(WorldObject.describe);
        
        return describeType.handle(thread);
    }
}