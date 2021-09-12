import { Any } from "./Any";
import { WorldObject } from "./WorldObject";

export class MenuOption{
    static readonly typeName = "~option";
    static readonly parentTypeName = Any.typeName;

    static readonly describe = WorldObject.describe;
}