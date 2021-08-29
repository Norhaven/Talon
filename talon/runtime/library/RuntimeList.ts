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
import { RuntimeWorldObject } from "./RuntimeWorldObject";

export class RuntimeList extends RuntimeAny{
    typeName = List.typeName;
    parentTypeName = Any.typeName;

    constructor(public items:RuntimeAny[]){
        super();

        this.defineContainsMethod()
        this.defineContainsTypeMethod();
        this.defineMapMethod();
        this.defineAddMethod();
        this.defineCountMethod();
        this.defineJoinMethod();
        this.defineRemoveMethod();
        this.defineEnsureOneMethod();
        this.defineGetEnumeratorMethod();
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
            new Parameter(List.valueParameter, StringType.typeName)
        );

        contains.returnType = BooleanType.typeName;

        contains.body.push(
            Instruction.loadLocal(List.valueParameter),  
            Instruction.loadThis(),
            Instruction.externalCall("containsValue"),
            Instruction.return()
        );

        this.methods.set(List.contains, contains);
    }

    private defineContainsTypeMethod(){
        const contains = new Method();
        contains.name = List.containsType;
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

        this.methods.set(List.containsType, contains);
    }
    
    private defineRemoveMethod(){
        const remove = new Method();
        remove.name = List.remove;
        remove.parameters.push(
            new Parameter(List.valueParameter, Any.typeName)
        );

        remove.body.push(
            Instruction.loadLocal(List.valueParameter),  
            Instruction.loadThis(),
            Instruction.externalCall("removeInstance"),
            Instruction.return()
        );

        this.methods.set(List.remove, remove);
    }

    private defineEnsureOneMethod(){
        const ensureOne = new Method();
        ensureOne.name = List.ensureOne;
        ensureOne.parameters.push(
            new Parameter(List.valueParameter, Any.typeName)
        );

        ensureOne.body.push(
            Instruction.loadLocal(List.valueParameter),  
            Instruction.loadThis(),
            Instruction.externalCall("ensureOneInstance"),
            Instruction.return()
        );

        this.methods.set(List.ensureOne, ensureOne);
    }

    private defineGetEnumeratorMethod(){
        const getEnumeratorMethod = new Method();
        getEnumeratorMethod.name = List.getEnumerator;
        getEnumeratorMethod.returnType = RuntimeInteger.name;

        getEnumeratorMethod.body.push(
            Instruction.loadThis(),
            Instruction.externalCall("getEnumerator"),
            Instruction.return()
        );

        this.methods.set(List.getEnumerator, getEnumeratorMethod);
    }

    private replace(instance:RuntimeWorldObject){

    }

    private getEnumerator(){
        return Memory.allocateEnumerator(this.items);
    }

    private ensureOneInstance(instance:RuntimeAny){
        if (!(instance instanceof RuntimeString)){
            throw new RuntimeError(`Unable to remove instance of unsupported type '${instance.typeName}' from list`)
        }

        if (this.containsValue(instance).value){
            console.log(`List already contains '${instance.value}', returning...`);
            return;
        }

        this.addInstance(instance);
    }

    removeInstance(instance:RuntimeAny){

        this.items = this.items.filter(x => {
            if (instance instanceof RuntimeString){
                return (<RuntimeString>x).value != instance.value;
            } else if (instance instanceof RuntimeWorldObject){
                const result = Object.is(x, instance);

                console.log(`Compared ${x.typeName} = ${instance.typeName} : ${result}`);

                return !result;
            } else {
                throw new RuntimeError(`Unable to remove instance of unsupported type '${instance.typeName}' from list`);
            }
        });
    }

    addInstance(instance:RuntimeAny){
        console.log("Adding an instance...");
        console.log(instance);
        this.items.push(instance);
    }

    private countItems(){
        console.log(`ITEMS= ${this.items.length}`);
        return Memory.allocateNumber(this.items.length);
    }

    contains(instance:RuntimeWorldObject){
        const item = this.items.find(x => x === instance);

        if (item){
            return Memory.allocateBoolean(true);
        }

        return Memory.allocateBoolean(false);
    }

    private containsValue(value:RuntimeString){
        console.log(`Contains ${this.items.length} items, checking for '${value.value}'...`);
        console.log(this.items.map(x => (<RuntimeString>x).value));
        const foundItems = this.items.some(x => x.typeName === StringType.typeName && (<RuntimeString>x).value === value.value);

        return Memory.allocateBoolean(foundItems);
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