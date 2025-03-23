import { RuntimeAny } from "./RuntimeAny";
import { RuntimeString } from "./RuntimeString";

export class RuntimeCommand extends RuntimeAny{
    constructor(public action:RuntimeString, public actorName:RuntimeString, public targetName?:RuntimeString){
        super();
    }
}