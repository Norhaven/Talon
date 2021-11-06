import { Any } from "../../library/Any";
import { BooleanType } from "../../library/BooleanType";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeAny } from "./RuntimeAny";

export class RuntimeBoolean extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = BooleanType.typeName;

    constructor(public value:boolean = false){
        super();
    }

    toString(){
        return `${this.value.toString()}:${this.typeName}`;
    }
}