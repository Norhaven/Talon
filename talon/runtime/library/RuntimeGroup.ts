import { Instruction } from "../../common/Instruction";
import { Method } from "../../common/Method";
import { Parameter } from "../../common/Parameter";
import { Group } from "../../library/Group";
import { List } from "../../library/List";
import { NumberType } from "../../library/NumberType";
import { Memory } from "../common/Memory";
import { RuntimeList } from "./RuntimeList";
import { RuntimeWorldObject } from "./RuntimeWorldObject";

export class RuntimeGroup extends RuntimeWorldObject{
    parentTypeName = Group.parentTypeName;
    typeName = Group.typeName;

    static get type(){
        const type = RuntimeWorldObject.type;

        type.name = Group.typeName;
        type.baseTypeName = Group.parentTypeName;
        
        return type;
    }

    constructor(){
        super();

        this.defineAddAllMethod();
    }

    private defineAddAllMethod(){
        const addAll = new Method();
        addAll.name = Group.addAll;        
        addAll.parameters.push(
            new Parameter(Group.instanceListParameter, List.typeName)
        );

        addAll.body.push(
            Instruction.loadLocal(Group.instanceListParameter),
            Instruction.loadThis(),
            Instruction.externalCall("addAllInstances"),
            Instruction.return()
        );

        this.methods.set(Group.addAll, addAll);
    }

    addAllInstances(instances:RuntimeList){
        const contents = this.getContentsField();

        for(const instance of instances.items){
            contents.addInstance(instance);
        }

        const count = this.getFieldAsNumber(Group.count);

        count.value = contents.items.length;
    }

    removeAllInstances(instances:RuntimeList){
        const contents = this.getContentsField();

        contents.removeAllInstances(instances);
    }
}