import { Field } from "./Field";
import { Method } from "./Method";
import { Attribute } from "./Attribute";

export class Type{      
    fields:Field[] = [];
    methods:Method[] = []; 
    attributes:Attribute[] = [];

    get isSystemType(){
        return this.name.startsWith("~");
    }

    get isAnonymousType(){
        return this.name.startsWith("<~>");
    }

    inheritsFromType(types:Map<string, Type>, typeName:string){
        
        for(let current = <Type>this;
            current;
            current = types.get(current.baseTypeName)!){
                if (current.name == typeName){
                    return true;
                } 
        }
        
        return false;
    }

    constructor(public name:string, public baseTypeName:string){

    }
}