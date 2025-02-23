import { Any } from "../../library/Any";
import { TupleType } from "../../library/TupleType";
import { RuntimeAny } from "./RuntimeAny";

export class RuntimeTuple<T> extends RuntimeAny{
    parentTypeName = TupleType.parentTypeName;
    typeName = TupleType.typeName;

    get value1(){
        return this.firstValue;
    }

    get value2(){
        return this.secondValue;
    }

    constructor(private readonly firstValue:T, private readonly secondValue:T){
        super();
    }

    toString(){
        return `(${this.value1}, ${this.value2}):${this.typeName}`;
    }
}