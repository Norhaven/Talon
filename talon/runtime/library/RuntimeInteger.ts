import { RuntimeAny } from "./RuntimeAny";

export class RuntimeInteger extends RuntimeAny{
    constructor(public readonly value:number){
        super();
    }

    toString(){
        return this.value.toString();
    }
}