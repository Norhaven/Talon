import { Any } from "../../library/Any";
import { RuntimeAny } from "./RuntimeAny";
import { Variable } from "./Variable";

export class RuntimeVariableReference extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = "~variableReference";

    constructor(public readonly value:Variable, public readonly enclosingType?:RuntimeAny){
        super();
    }
}