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

export class Memory{
    private static typesByName = new Map<string, Type>();
    private static heap = new Map<string, RuntimeAny[]>();

    static clear(){
        Memory.typesByName = new Map<string, Type>();
        Memory.heap = new Map<string, RuntimeAny[]>();
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

    static allocate(type:Type):RuntimeAny{
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
            const itemList = <Object[]>item;
            const count = <number>itemList[0];
            const typeName = <string>itemList[1];

            const type = Memory.typesByName.get(typeName)!;

            for(let current = 0; current < count; current++){                
                const instance = Memory.allocate(type);
                runtimeItems.push(instance);
            }
        }

        return runtimeItems;
    }

    private static constructInstanceFrom(type:Type){
        
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

        const firstSystemTypeAncestorIndex = inheritanceChain.findIndex(x => x.isSystemType);
                
        if (firstSystemTypeAncestorIndex < 0){
            throw new RuntimeError("Type must ultimately inherit from a system type");
        }

        const instance = this.allocateSystemTypeByName(inheritanceChain[firstSystemTypeAncestorIndex].name);
        
        instance.parentTypeName = instance.typeName;
        instance.typeName = inheritanceChain[0].name;

        // TODO: Inherit more than just fields/methods.
        // TODO: Type check field inheritance for shadowing/overriding.

        // Inherit fields/methods from types in the hierarchy from least to most derived.
        
        for(let i = firstSystemTypeAncestorIndex; i >= 0; i--){
            const currentType = inheritanceChain[i];

            for(const field of currentType.fields){
                const variable = this.initializeVariableWith(field);
                instance.fields.set(field.name, variable);
            }

            for(const method of currentType.methods){
                instance.methods.set(method.name, method);
            }
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
            default:{
                throw new RuntimeError(`Unable to instantiate type '${typeName}'`);
            }
        }
    }
}