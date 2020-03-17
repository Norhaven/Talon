import { RuntimeAny } from "./RuntimeAny";
import { List } from "../../library/List";
import { Method } from "../../common/Method";
import { Parameter } from "../../common/Parameter";
import { NumberType } from "../../library/NumberType";
import { StringType } from "../../library/StringType";
import { Instruction } from "../../common/Instruction";
import { RuntimeString } from "./RuntimeString";
import { RuntimeInteger } from "./RuntimeInteger";
import { Memory } from "../common/Memory";
import { BooleanType } from "../../library/BooleanType";

export class RuntimeList extends RuntimeAny{
    constructor(public items:RuntimeAny[]){
        super();

        const contains = new Method();
        contains.name = List.contains;
        contains.parameters.push(
            new Parameter(List.typeNameParameter, StringType.typeName),
            new Parameter(List.countParameter, NumberType.typeName)
        );

        contains.returnType = BooleanType.typeName;

        contains.body.push(
            Instruction.loadLocal(List.countParameter),
            Instruction.loadLocal(List.typeNameParameter),  
            Instruction.loadThis(),
            Instruction.externalCall("containsType"),
            Instruction.return()
        );

        this.methods.set(List.contains, contains);
    }

    private containsType(typeName:RuntimeString, count:RuntimeInteger){
        const foundItems = this.items.filter(x => x.typeName === typeName.value);
        const found = foundItems.length === count.value;

        return Memory.allocateBoolean(found);
    }
}