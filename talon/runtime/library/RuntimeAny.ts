import { Any } from "../../library/Any";
import { Variable } from "./Variable";
import { Method } from "../../common/Method";
import { RuntimeError } from "../errors/RuntimeError";
import { Type } from "../../common/Type";
import { StringType } from "../../library/StringType";
import { NumberType } from "../../library/NumberType";
import { BooleanType } from "../../library/BooleanType";
import { List } from "../../library/List";
import { RuntimeList } from "./RuntimeList";
import { RuntimeString } from "./RuntimeString";
import { RuntimeBoolean } from "./RuntimeBoolean";
import { RuntimeInteger } from "./RuntimeInteger";

export class RuntimeAny{
    parentTypeName:string = "";
    typeName:string = Any.typeName;

    base:RuntimeAny|null = null;
    fields:Map<string, Variable> = new Map<string, Variable>();
    methods:Map<string, Method> = new Map<string, Method>();

    hasField(name:string){
        return this.fields.get(name)?.value !== undefined;
    }

    hasOrInheritsField(fieldName:string):boolean{
        if (this.hasField(fieldName)){
            return true;
        }

        if (this.base){
            return this.base.hasOrInheritsField(fieldName);
        }

        return false;
    }

    getField(fieldName:string):Variable|undefined{
        if (this.hasField(fieldName)){
            return this.fields.get(fieldName);
        }

        return this.base?.getField(fieldName);
    }

    getFieldValueByName(name:string):RuntimeAny{
        if (!this.hasField(name)){
            if (!this.base){
                throw new RuntimeError(`Attempted field access for unknown field '${name}'`);
            }

            return this.base.getFieldValueByName(name);
        }

        const instance = this.fields.get(name)?.value;

        if (instance == undefined){
            throw new RuntimeError(`Attempted field access for unknown field '${name}'`);
        }

        return instance;
    }

    isString(): this is RuntimeString{
        return this.isTypeOf(StringType.typeName);
    }

    isInteger(): this is RuntimeInteger{
        return this.isTypeOf(NumberType.typeName);
    }

    isBoolean(): this is RuntimeBoolean{
        return this.isTypeOf(BooleanType.typeName);
    }

    isList(): this is RuntimeList{
        return this.isTypeOf(List.typeName);
    }

    isSameTypeAs(instance:RuntimeAny){
        return this.typeName == instance.typeName;
    }

    isTypeOf(typeName:string):boolean{

        if (this.typeName === typeName){
            return true;
        }

        if (this.base){
            return this.base.isTypeOf(typeName);
        }

        return false;
    }
    
    getFieldAsList(name:string):RuntimeList{
        return <RuntimeList>this.getFieldValueByName(name);
    }

    getFieldAsString(name:string):RuntimeString{
        return <RuntimeString>this.getFieldValueByName(name);
    }

    getFieldAsBoolean(name:string):RuntimeBoolean{
        return <RuntimeBoolean>this.getFieldValueByName(name);
    }

    getFieldAsNumber(name:string):RuntimeInteger{
        return <RuntimeInteger>this.getFieldValueByName(name);
    }

    getType(){
        const type = new Type(this.typeName, this.parentTypeName);

        type.base = this.base?.getType();

        return type;
    }

    toString(){
        return this.typeName;
    }
}