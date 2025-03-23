import { Any } from "./Any";

export class List{
    static readonly typeName = "~list";
    static readonly parentTypeName = Any.typeName;

    static readonly count = "~count";
    static readonly add = "~add";
    static readonly map = "~map";
    static readonly contains = "~contains";
    static readonly containsType = "~containsType";
    static readonly join = "~join";
    static readonly remove = "~remove";
    static readonly ensureOne = "~ensureOne";
    static readonly getEnumerator = "~getEnumerator";
    static readonly getFirst = "~getFirst";
    static readonly group = "~group";

    static readonly valueParameter = "~value";
    static readonly separatorParameter = "~separator";
    static readonly instanceParameter = "~instance";
    static readonly delegateParameter = "~delegate";
    static readonly typeNameParameter = "~typeName";
    static readonly countParameter = "~count";
}