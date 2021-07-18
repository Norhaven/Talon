import { RuntimeAny } from "./RuntimeAny";
import { RuntimeString } from "./RuntimeString";

export class RuntimeCommand extends RuntimeAny{
    constructor(public targetName?:RuntimeString, public actorName?:RuntimeString, public action?:RuntimeString){
        super();
    }
}