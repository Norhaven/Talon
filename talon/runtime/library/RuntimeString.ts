import { RuntimeAny } from "./RuntimeAny";
import { Any } from "../../library/Any";

export class RuntimeString extends RuntimeAny{
    value:string;
    parentTypeName = Any.typeName;
    typeName = "~string";

    constructor(value:string){
        super();
        this.value = value;
    }

    toString(){
        return `"${this.value}"`;
    }
}