import { Type } from "../../common/Type";
import { MenuOption } from "../../library/MenuOption";
import { RuntimeAny } from "./RuntimeAny";

export class RuntimeMenuOption extends RuntimeAny{
    typeName = MenuOption.typeName;
    parentTypeName = MenuOption.parentTypeName;

    static get type():Type{
        const type = new Type(MenuOption.typeName, MenuOption.parentTypeName);

        return type;
    }
}