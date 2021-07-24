import { Type } from "../../common/Type";

export class TransformerContext{
    typesByName:Map<string, Type> = new Map<string, Type>();
    dynamicTypeCount = 0;

    get types():Type[]{
        return Array.from(this.typesByName.values());
    }
}