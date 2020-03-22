import { WorldObject } from "./WorldObject";

export class Place {
    static parentTypeName = WorldObject.typeName;
    static typeName = "~place";

    static isPlayerStart = "~isPlayerStart";
}