import { Creature } from "../../library/Creature";
import { RuntimeWorldObject } from "./RuntimeWorldObject";

export class RuntimeCreature extends RuntimeWorldObject{
    parentTypeName = Creature.parentTypeName;
    typeName = Creature.typeName;
}