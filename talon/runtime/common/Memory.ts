import { RuntimeAny } from "../library/RuntimeAny";
import { Type } from "../../common/Type";
import { Place } from "../../library/Place";
import { RuntimePlace } from "../library/RuntimePlace";
import { RuntimeError } from "../errors/RuntimeError";
import { Variable } from "../library/Variable";
import { Field } from "../../common/Field";
import { StringType } from "../../library/StringType";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeEmpty } from "../library/RuntimeEmpty";
import { RuntimeCommand } from "../library/RuntimeCommand";
import { BooleanType } from "../../library/BooleanType";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { List } from "../../library/List";
import { RuntimeList } from "../library/RuntimeList";
import { Item } from "../../library/Item";
import { RuntimeItem } from "../library/RuntimeItem";
import { Player } from "../../library/Player";
import { RuntimePlayer } from "../library/RuntimePlayer";
import { Say } from "../../library/Say";
import { RuntimeSay } from "../library/RuntimeSay";
import { Method } from "../../common/Method";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { NumberType } from "../../library/NumberType";
import { RuntimeDecoration } from "../library/RuntimeDecoration";
import { Decoration } from "../../library/Decoration";
import { WorldObject } from "../../library/WorldObject";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { Any } from "../../library/Any";
import { Creature } from "../../library/Creature";
import { RuntimeCreature } from "../library/RuntimeCreature";
import { RuntimeEnumerator } from "../library/RuntimeEnumerator";
import { GlobalEvents } from "../../library/GlobalEvents";
import { RuntimeGlobalEvents } from "../library/RuntimeGlobalEvents";
import { Menu } from "../../library/Menu";
import { RuntimeMenu } from "../library/RuntimeMenu";

export class Memory{
    private static typesByName = new Map<string, Type>();
    private static heap = new Map<string, RuntimeAny[]>();

    static clear(){
        Memory.typesByName = new Map<string, Type>();
        Memory.heap = new Map<string, RuntimeAny[]>();
    }

    static dumpTypesToConsole(){
        for(const type of Memory.typesByName.values()){
            console.log(type.name);
        }
    }

    static findTypeByName(name:string){
        if (!this.typesByName.has(name)){
            throw new RuntimeError(`Unable to locate type '${name}'`);
        }

        return this.typesByName.get(name);
    }

    static findInstanceByName(name:string){
        const instances = Memory.heap.get(name);

        if (!instances || instances.length == 0){
            throw new RuntimeError("Object not found");
        }

        if (instances.length > 1){
            throw new RuntimeError("Located more than one instance");
        }

        return instances[0];
    }

    static findOrAddInstance(name:string){
        const instances = Memory.heap.get(name);

        if (!instances || instances.length == 0){
            const type = Memory.findTypeByName(name);

            if (!type){
                throw new RuntimeError(`Unable to locate type '${name}' for instantiation`);
            }

            return Memory.constructInstanceFrom(type);
        }

        if (instances.length > 1){
            throw new RuntimeError("Located more than one instance");
        }

        return instances[0];
    }

    static loadTypes(types:Type[]){
        Memory.typesByName = new Map<string, Type>(types.map(x => [x.name, x]));   
        
        // Override any provided type stubs with the actual runtime type definitions.
        
        const place = RuntimePlace.type;
        const item = RuntimeItem.type;
        const player = RuntimePlayer.type;
        const decoration = RuntimeDecoration.type;

        Memory.typesByName.set(place.name, place);
        Memory.typesByName.set(item.name, item);
        Memory.typesByName.set(player.name, player);  
        Memory.typesByName.set(decoration.name, decoration);
        
        return Array.from(Memory.typesByName.values());
    }

    static allocateCommand():RuntimeCommand{
        return new RuntimeCommand();
    }

    static allocateBoolean(value:boolean):RuntimeBoolean{
        return new RuntimeBoolean(value);
    }

    static allocateNumber(value:number):RuntimeInteger{
        return new RuntimeInteger(value);
    }

    static allocateString(text:string):RuntimeString{
        return new RuntimeString(text);
    }

    static allocateEnumerator(items:RuntimeAny[]){
        return new RuntimeEnumerator(items);
    }

    static allocateList(items:RuntimeAny[]){
        return new RuntimeList(items);
    }

    static allocate(type:Type):RuntimeAny{
        console.log(`Allocating type '${type.name}'`);
        console.log(type);

        const instance = Memory.constructInstanceFrom(type);

        const instancePool = Memory.heap.get(type.name) || [];

        instancePool.push(instance);

        Memory.heap.set(type.name, instancePool);

        return instance;
    }

    private static initializeVariableWith(field:Field){

        const variable = Memory.constructVariableFrom(field);        
        variable.value = Memory.instantiateDefaultValueFor(variable, field.defaultValue);

        return variable;
    }

    private static constructVariableFrom(field:Field){
        if (field.type){
            return new Variable(field.name, field.type);
        }

        const type = Memory.typesByName.get(field.typeName);

        if (!type){
            throw new RuntimeError(`Unable to construct unknown type '${field.typeName}'`);
        }

        return new Variable(field.name, type);
    }

    private static instantiateDefaultValueFor(variable:Variable, defaultValue:Object|undefined){
        
        switch(variable.type!.name){
            case StringType.typeName: return new RuntimeString(defaultValue ? <string>defaultValue : "");
            case BooleanType.typeName: return new RuntimeBoolean(defaultValue ? <boolean>defaultValue : false);
            case NumberType.typeName: return new RuntimeInteger(defaultValue ? <number>defaultValue : 0);
            case List.typeName: return new RuntimeList(defaultValue ? this.instantiateList(<Object[]>defaultValue) : []);
            default:
                return new RuntimeEmpty();
        }
    }

    private static instantiateList(items:Object[]){
        const runtimeItems:RuntimeAny[] = [];

        for(const item of items){
            if (Array.isArray(item)){
                const itemList = <Object[]>item;
                const count = <number>itemList[0];
                const typeName = <string>itemList[1];

                const type = Memory.typesByName.get(typeName)!;

                for(let current = 0; current < count; current++){                
                    const instance = Memory.allocate(type);
                    runtimeItems.push(instance);
                }
            } else {
                const value = Memory.allocateString(<string>item);
                runtimeItems.push(value);
            }
        }

        return runtimeItems;
    }

    private static constructInstanceFrom(type:Type){
        
        console.log(`Constructing type '${type.name}'`);

        let seenTypes = new Set<string>();
        let inheritanceChain:Type[] = [];

        for(let current:Type|undefined = type; 
            current; 
            current = Memory.typesByName.get(current.baseTypeName)){
                
            if (seenTypes.has(current.name)){
                throw new RuntimeError("You can't have cycles in a type hierarchy");
            }

            seenTypes.add(current.name);
            inheritanceChain.push(current);
        }

        const systemTypeRoot = inheritanceChain[inheritanceChain.length - 1];
        
        if (!systemTypeRoot.isSystemType){        
            throw new RuntimeError("Type must ultimately inherit from a system type");
        }

        const instanceChain:RuntimeAny[] = [];

        for(const type of inheritanceChain){
            const instance = Memory.constructInstanceFromStandaloneType(type);
            instanceChain.push(instance);
        }

        for(let i = 0; i < instanceChain.length - 1; i++){
            const currentInstance = instanceChain[i];
            currentInstance.base = instanceChain[i + 1];
        }

        return instanceChain[0];
    }

    private static constructInstanceFromStandaloneType(type:Type){
        const allocate = () => {
            if (type.isSystemType){
                return Memory.allocateSystemTypeByName(type.name);
            }

            const any = new RuntimeWorldObject();

            any.typeName = type.name;
            any.parentTypeName = type.baseTypeName;

            return any;
        }

        const instance = allocate();

        for(const field of type.fields){
            console.log(`Initializing field '${field.name}' in type '${type.name}'`);
            console.log(field);

            const variable = Memory.initializeVariableWith(field);
            instance.fields.set(field.name, variable);
        }

        for(const method of type.methods){
            instance.methods.set(method.name, method);
        }

        return instance;
    }

    private static allocateSystemTypeByName(typeName:string){
        switch(typeName){
            case Place.typeName: return new RuntimePlace();
            case Item.typeName: return new RuntimeItem();
            case Player.typeName: return new RuntimePlayer();
            case List.typeName: return new RuntimeList([]);     
            case Say.typeName: return new RuntimeSay();    
            case Decoration.typeName: return new RuntimeDecoration();   
            case Creature.typeName: return new RuntimeCreature();
            case Menu.typeName: return new RuntimeMenu();
            case GlobalEvents.typeName: return new RuntimeGlobalEvents();
            case WorldObject.typeName: return new RuntimeWorldObject();
            case Any.typeName: return new RuntimeAny();
            default:{
                throw new RuntimeError(`Unable to instantiate type '${typeName}'`);
            }
        }
    }
}