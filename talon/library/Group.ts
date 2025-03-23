import { WorldObject } from "./WorldObject";

export class Group {
    static readonly typeName = "~group";
    static readonly parentTypeName = WorldObject.typeName;

    static readonly count = "~count";
    static readonly contentType = "~contentType";
    static readonly addAll = "~addAll";

    static readonly instanceListParameter = "~instances";
}