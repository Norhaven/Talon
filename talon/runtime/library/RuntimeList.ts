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
import { Any } from "../../library/Any";
import { RuntimeDelegate } from "./RuntimeDelegate";
import { Variable } from "./Variable";
import { Type } from "../../common/Type";
import { RuntimeError } from "../errors/RuntimeError";

export class RuntimeList extends RuntimeAny{
    typeName = List.typeName;
    parentTypeName = Any.typeName;

    constructor(public items:RuntimeAny[]){
        super();

        this.defineContainsMethod();
        this.defineMapMethod();
        this.defineAddMethod();
        this.defineCountMethod();
        this.defineJoinMethod();
    }

    private defineJoinMethod(){
        const join = new Method();
        join.name = List.join;
        join.parameters.push(
            new Parameter(List.separatorParameter, RuntimeString.name)
        );
        
        join.returnType = RuntimeString.name;
        
        join.body.push(
            Instruction.loadLocal(List.separatorParameter),
            Instruction.loadThis(),
            Instruction.externalCall("joinList"),
            Instruction.return()
        );

        this.methods.set(List.join, join);
    }

    private defineCountMethod(){
        const count = new Method();
        count.name = List.count;
        count.returnType = RuntimeInteger.name;

        count.body.push(
            Instruction.loadThis(),
            Instruction.externalCall("countItems"),
            Instruction.return()
        );

        this.methods.set(List.count, count);
    }

    private defineAddMethod(){
        const add = new Method();
        add.name = List.add;        
        add.parameters.push(
            new Parameter(List.instanceParameter, RuntimeAny.name)
        );

        add.body.push(
            Instruction.loadLocal(List.instanceParameter),
            Instruction.loadThis(),
            Instruction.externalCall("addInstance"),
            Instruction.return()
        );

        this.methods.set(List.add, add);
    }

    private defineMapMethod(){
        const map = new Method();
        map.name = List.map;
        map.parameters.push(
            new Parameter(List.delegateParameter, RuntimeDelegate.name)
        );
        map.returnType = this.typeName;
                
        map.body.push(
            Instruction.loadNumber(0),
            Instruction.setLocal("~localCount"),  
            Instruction.newInstance(this.typeName),
            Instruction.setLocal("~results"),      

            Instruction.loadLocal("~localCount"),
            Instruction.loadThis(),
            Instruction.instanceCall(List.count),
            Instruction.compareEqual(),
            Instruction.branchRelativeIfFalse(2),
            Instruction.loadLocal("~results"),
            Instruction.return(),  
            
            Instruction.loadThis(),
            Instruction.loadLocal("~localCount"),
            Instruction.loadElement(),
            Instruction.loadLocal(List.delegateParameter),
            Instruction.invokeDelegateOnInstance(),
            Instruction.loadLocal("~results"),
            Instruction.instanceCall(List.add),
            Instruction.loadLocal("~localCount"),
            Instruction.loadNumber(1),
            Instruction.add(),
            Instruction.setLocal("~localCount"),
            Instruction.goTo(4)
        );

        this.methods.set(List.map, map);
    }

    private defineContainsMethod(){
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

    private addInstance(instance:RuntimeAny){
        this.items.push(instance);
    }

    private countItems(){
        return Memory.allocateNumber(this.items.length);
    }

    private containsType(typeName:RuntimeString, count:RuntimeInteger){
        const foundItems = this.items.filter(x => x.typeName === typeName.value);
        const found = foundItems.length === count.value;

        return Memory.allocateBoolean(found);
    }

    private joinList(separator:RuntimeString){
        if (!this.items.every(x => x instanceof RuntimeString)){
            throw new RuntimeError("Attempted to join a list with conflicting data types");
        }

        const values = this.items.map(x => (<RuntimeString>x).value);

        if (values.length == 0 || values.every(x => x === '')){
            return Memory.allocateString('');
        }

        const joinedValue = values.join(separator.value);

        return Memory.allocateString(joinedValue);
    }
}