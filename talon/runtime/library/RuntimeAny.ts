import { Any } from "../../library/Any";
import { Variable } from "./Variable";
import { Method } from "../../common/Method";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeList } from "./RuntimeList";
import { RuntimeString } from "./RuntimeString";
import { RuntimeBoolean } from "./RuntimeBoolean";

export class RuntimeAny{
    parentTypeName:string = "";
    typeName:string = Any.typeName;

    base:RuntimeAny|null = null;
    fields:Map<string, Variable> = new Map<string, Variable>();
    methods:Map<string, Method> = new Map<string, Method>();

    hasField(name:string){
        return this.fields.get(name)?.value !== undefined;
    }
    
    protected getFieldValueByName(name:string):RuntimeAny{
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

    toString(){
        return this.typeName;
    }
}