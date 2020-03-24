import { Any } from "./Any";

export class WorldObject {
    static parentTypeName = Any.typeName;
    static typeName = "~worldObject";

    static description = "~description";
    static contents = "~contents";    
    static observation = "~observation";

    static describe = "~describe";
    static observe = "~observe";
    
    static visible = "~visible";
}