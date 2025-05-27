import { Constructor } from "../../../common/Constructor";

export class Expression{
    toString(){
        return this.constructor.name;
    }

    isOfType<T extends Expression>(create:Constructor<T>) : this is T{
        return this instanceof create;
    }
}