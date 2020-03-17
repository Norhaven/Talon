import { RuntimeWorldObject } from "./RuntimeWorldObject";
import { WorldObject } from "../../library/WorldObject";
import { Place } from "../../library/Place";
import { Type } from "../../common/Type";

export class RuntimePlace extends RuntimeWorldObject{
    parentTypeName = WorldObject.parentTypeName;
    typeName = Place.typeName;

    static get type():Type{
        const type = RuntimeWorldObject.type;

        type.name = Place.typeName;
        
        return type;
    }
}