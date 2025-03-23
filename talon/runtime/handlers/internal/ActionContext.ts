import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";

export class ActionContext{
    static get empty(){
        return new ActionContext();
    }

    get isEmpty(){
        return !this.actorSource && !this.actor && !this.targetSource && !this.target;
    }

    get hasActor(){
        return this.actor != undefined;
    }

    get hasTarget(){
        return this.target != undefined;
    }

    constructor(
        public readonly actorSource?:RuntimeWorldObject,
        public readonly actor?:RuntimeWorldObject,
        public readonly targetSource?:RuntimeWorldObject,
        public readonly target?:RuntimeWorldObject
    ){

    }
}