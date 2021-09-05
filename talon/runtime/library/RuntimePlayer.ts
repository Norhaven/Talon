import { RuntimeWorldObject } from "./RuntimeWorldObject";
import { Type } from "../../common/Type";
import { Player } from "../../library/Player";

export class RuntimePlayer extends RuntimeWorldObject{
    typeName = Player.typeName;
    parentTypeName = Player.parentTypeName;

    static get type():Type{
        const type = RuntimeWorldObject.type;

        type.name = Player.typeName;
        type.baseTypeName = Player.parentTypeName;

        return type;
    }
}