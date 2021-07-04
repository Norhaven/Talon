import { Type } from "../../common/Type";
import { RuntimeAny } from "./RuntimeAny";

export class Variable{

    private static readonly thisTypeName = "~this";

    constructor(public readonly name:string, 
                public readonly type:Type,
                public value?:RuntimeAny){
    }

    static forThis(type:Type, value?:RuntimeAny){
        return new Variable(Variable.thisTypeName, type, value);
    }
}