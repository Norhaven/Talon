import { RuntimeAny } from "./RuntimeAny";
import { WorldObject } from "../../library/WorldObject";
import { Any } from "../../library/Any";
import { RuntimeList } from "./RuntimeList";
import { RuntimeString } from "./RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { Variable } from "./Variable";
import { Type } from "../../common/Type";
import { Field } from "../../common/Field";
import { List } from "../../library/List";
import { StringType } from "../../library/StringType";
import { RuntimeBoolean } from "./RuntimeBoolean";

export class RuntimeWorldObject extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = WorldObject.typeName;

    static get type():Type{
        const type = new Type(WorldObject.typeName, WorldObject.parentTypeName);
        
        const contents = new Field();
        contents.name = WorldObject.contents;
        contents.typeName = List.typeName;
        contents.defaultValue = [];

        const description = new Field();
        description.name = WorldObject.description;
        description.typeName = StringType.typeName;
        description.defaultValue = "";

        const aliases = new Field();
        aliases.name = WorldObject.aliases;
        aliases.typeName = List.typeName;
        aliases.defaultValue = [];

        type.fields.push(contents);
        type.fields.push(description);
        type.fields.push(aliases);

        return type;
    }

    getContentsField():RuntimeList{
        return this.getFieldAsList(WorldObject.contents);
    }    
}