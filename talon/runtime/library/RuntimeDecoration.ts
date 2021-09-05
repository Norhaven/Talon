import { RuntimeWorldObject } from "./RuntimeWorldObject";
import { Decoration } from "../../library/Decoration";
import { Type } from "../../common/Type";
import { WorldObject } from "../../library/WorldObject";

export class RuntimeDecoration extends RuntimeWorldObject{
    parentTypeName = Decoration.parentTypeName;
    typeName = Decoration.typeName;
    
    static get type():Type{
        const type = RuntimeWorldObject.type;

        type.name = Decoration.typeName;
        type.baseTypeName = Decoration.parentTypeName;

        return type;
    }
}