import { Any } from "./Any";

export class WorldObject {
    static parentTypeName = Any.typeName;
    static typeName = "~worldObject";

    static description = "~description";
    static contents = "~contents";    
    static observation = "~observation";
    static state = "~state";
    static aliases = "~aliases";
    static directions = "~directions";
    static groupableAsType = "~groupableAsType";
    static currentContainer = "~currentContainer";

    static describe = "~describe";
    static observe = "~observe";
    static list = "~list";
    static listContents = "~listContents";
    static transferContents = "~transferContents";
    static move = "~move";

    static visible = "~visible";

    static contextParameter = "~context";
    static recipientParameter = "~recipient";
    static directionParameter = "~direction";
    static eventTypeParameter = "~eventType";
    static closureParameter = "~closure";
}