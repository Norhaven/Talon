import { Field } from "./Field";
import { Method } from "./Method";
import { Attribute } from "./Attribute";

export class Type{      
    base?:Type;
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

    isTypeOf(typeName:string){   
        return this.findTypeInTypeHierarchy(type => type.name == typeName) != null;
    }

    getAllFields(fieldName:string){
        return this.findAllInTypeHierarchy(type => type.fields.find(x => x.name.toLowerCase() == fieldName.toLowerCase()));
    }
    
    hasField(fieldName:string){
        return this.findTypeInTypeHierarchy(type => type.fields.some(x => x.name.toLowerCase() == fieldName.toLowerCase())) != null;
    }

    hasOverriddenField(fieldName:string){
        return this.fields.some(x => x.name.toLowerCase() == fieldName.toLowerCase());
    }

    addField<T extends Object>(fieldName:string, typeName:string, defaultValue:T){
        const field = new Field();

        field.name = fieldName;
        field.typeName = typeName;
        field.defaultValue = defaultValue;

        this.fields.push(field);
    }

    getField(fieldName:string){
        const type = this.findTypeInTypeHierarchy(type => type.fields.some(x => x.name.toLowerCase() == fieldName.toLowerCase()));

        if (!type){
            return undefined;
        }

        return type.fields.find(x => x.name.toLowerCase() == fieldName.toLowerCase());
    }

    private findAllInTypeHierarchy<T>(find:(type:Type)=>T|undefined){
        const results:T[] = [];

        for(let type:Type|undefined = <Type>this; type; type = type.base){
            const result = find(type);

            if (result){
                results.push(result);
            }
        }

        return results;
    }

    private findTypeInTypeHierarchy(isMatch:(type:Type)=>boolean){
        for(let type:Type|undefined = <Type>this; type; type = type.base){
            if (isMatch(type)){
                return type;
            }
        }

        return null;
    }
}