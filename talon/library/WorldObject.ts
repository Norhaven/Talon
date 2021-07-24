import { Any } from "./Any";

export class WorldObject {
    static parentTypeName = Any.typeName;
    static typeName = "~worldObject";

    static description = "~description";
    static contents = "~contents";    
    static observation = "~observation";
    static state = "~state";

    static describe = "~describe";
    static observe = "~observe";
    
    static visible = "~visible";

    static contextParameter = "~context";
}