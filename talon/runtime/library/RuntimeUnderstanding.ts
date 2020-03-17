import { RuntimeAny } from "./RuntimeAny";
import { RuntimeString } from "./RuntimeString";

export class RuntimeUnderstanding extends RuntimeAny{
    constructor(public name:RuntimeString, public meaning:RuntimeString){
        super();
    }
}