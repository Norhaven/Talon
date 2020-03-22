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

    constructor(public name:string, public baseTypeName:string){

    }    
}