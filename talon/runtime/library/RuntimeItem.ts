import { RuntimeWorldObject } from "./RuntimeWorldObject";
import { WorldObject } from "../../library/WorldObject";
import { Item } from "../../library/Item";
import { Type } from "../../common/Type";

export class RuntimeItem extends RuntimeWorldObject{
    parentTypeName = Item.parentTypeName;
    typeName = Item.typeName;

    static get type():Type{
        const type = RuntimeWorldObject.type;

        type.name = Item.typeName;
        type.baseTypeName = Item.parentTypeName;
        
        return type;
    }
}