import { RuntimeAny } from "./RuntimeAny";
import { Any } from "../../library/Any";

export class RuntimeEmpty extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = "<>empty";
}