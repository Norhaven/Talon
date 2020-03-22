import { RuntimeWorldObject } from "./RuntimeWorldObject";
import { Decoration } from "../../library/Decoration";

export class RuntimeDecoration extends RuntimeWorldObject{
    parentTypeName = Decoration.parentTypeName;
    typeName = Decoration.typeName;
}