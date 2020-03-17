import { Type } from "../../common/Type";
import { RuntimeAny } from "./RuntimeAny";

export class Variable{

    constructor(public readonly name:string, 
                public readonly type:Type,
                public value?:RuntimeAny){
    }
}