import { Type } from "../common/Type";
import { Any } from "./Any";

export class StringType{
    static parentTypeName = Any.typeName;
    static typeName = "~string";

    static type(){
        return new Type(StringType.typeName, StringType.parentTypeName);
    }
}