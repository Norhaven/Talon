import { Type } from "../../common/Type";
import { Menu } from "../../library/Menu";
import { RuntimeAny } from "./RuntimeAny";

export class RuntimeMenu extends RuntimeAny{
    typeName = Menu.typeName;
    parentTypeName = Menu.parentTypeName;

    static get type():Type{
        const type = new Type(Menu.typeName, Menu.parentTypeName);

        return type;
    }
}