import { Any } from "./Any";

export class List{
    static readonly typeName = "<>list";
    static readonly parentTypeName = Any.typeName;

    static readonly contains = "<>contains";

    static readonly typeNameParameter = "<>typeName";
    static readonly countParameter = "<>count";
}