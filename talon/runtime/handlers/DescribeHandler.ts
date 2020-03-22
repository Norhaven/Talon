import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { WorldObject } from "../../library/WorldObject";
import { InstanceCallHandler } from "./InstanceCallHandler";

export class DescribeHandler extends OpCodeHandler{
    handle(thread:Thread){

        const describeType = new InstanceCallHandler(WorldObject.describe);
        return describeType.handle(thread);
    }
}