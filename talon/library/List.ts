import { Any } from "./Any";

export class List{
    static readonly typeName = "~list";
    static readonly parentTypeName = Any.typeName;

    static readonly count = "~count";
    static readonly add = "~add";
    static readonly map = "~map";
    static readonly contains = "~contains";
    static readonly join = "~join";

    static readonly separatorParameter = "~separator";
    static readonly instanceParameter = "~instance";
    static readonly delegateParameter = "~delegate";
    static readonly typeNameParameter = "~typeName";
    static readonly countParameter = "~count";
}