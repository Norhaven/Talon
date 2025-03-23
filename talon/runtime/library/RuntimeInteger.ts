import { Any } from "../../library/Any";
import { NumberType } from "../../library/NumberType";
import { RuntimeAny } from "./RuntimeAny";

export class RuntimeInteger extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = NumberType.typeName;

    constructor(public value:number){
        super();
    }

    toString(){
        return this.value.toString();
    }
}