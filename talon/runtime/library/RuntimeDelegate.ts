import { RuntimeAny } from "./RuntimeAny";
import { Any } from "../../library/Any";
import { Delegate } from "../../library/Delegate";
import { Method } from "../../common/Method";

export class RuntimeDelegate extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = Delegate.typeName;

    constructor(public readonly wrappedMethod:Method){
        super();
    }
}