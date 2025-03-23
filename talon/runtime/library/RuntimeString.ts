import { RuntimeAny } from "./RuntimeAny";
import { Any } from "../../library/Any";

export class RuntimeString extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = "~string";

    constructor(public value:string){
        super();
    }

    toString(){
        return `"${this.value}"`;
    }
}