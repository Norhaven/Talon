import { Any } from "../../library/Any";
import { Variable } from "./Variable";
import { Method } from "../../common/Method";

export class RuntimeAny{
    parentTypeName:string = "";
    typeName:string = Any.typeName;

    fields:Map<string, Variable> = new Map<string, Variable>();
    methods:Map<string, Method> = new Map<string, Method>();

    toString(){
        return this.typeName;
    }
}