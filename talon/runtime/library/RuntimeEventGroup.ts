import { Any } from "../../library/Any";
import { EventGroup } from "../../library/EventGroup";
import { RuntimeAny } from "./RuntimeAny";
import { RuntimeDelegate } from "./RuntimeDelegate";

export class RuntimeEventGroup extends RuntimeAny{
    parentTypeName = EventGroup.parentTypeName;
    typeName = EventGroup.typeName;

    constructor(public readonly delegates:RuntimeDelegate[]){
        super();
    }
}