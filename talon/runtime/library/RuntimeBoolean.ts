import { RuntimeAny } from "./RuntimeAny";

export class RuntimeBoolean extends RuntimeAny{
    constructor(public value:boolean){
        super();
    }

    toString(){
        return this.value.toString();
    }
}