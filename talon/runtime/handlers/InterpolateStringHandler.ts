import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeAny } from "../library/RuntimeAny";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeString } from "../library/RuntimeString";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class InterpolateStringHandler extends OpCodeHandler{
    private readonly openVariable = "{{";
    private readonly closeVariable = "}}";
    private readonly variableRegex = new RegExp(/\{{2}(.+)\}{2}/g);

    public readonly code: OpCode = OpCode.InterpolateString;

    handle(thread:Thread){
    
        this.logInteraction(thread);
        
        const instance = thread.currentMethod.pop();
        const text = thread.currentMethod.pop();

        if (!instance){
            throw new RuntimeError(`Unable to interpolate text '${text}' without an instance!`);
        }

        if (text instanceof RuntimeString){
            let value = text.value;
            const matches = value?.matchAll(this.variableRegex) || [];

            for(const match of matches){
                const currentFieldValue = this.getFieldValue(instance, match[1]);
                
                if (!currentFieldValue){
                    continue;
                }

                const fieldValue = this.convertFieldValueToString(currentFieldValue);

                value = value.replace(match[0], fieldValue);
            }

            thread.currentMethod.push(Memory.allocateString(value));
        } else {
            throw new RuntimeError(`Unable to interpolate non-string type '${text?.typeName}`);
        }

        return super.handle(thread);
    }

    private getFieldValue(instance:RuntimeAny, fieldName:string){
        let field = instance?.fields.get(fieldName);

        if (field){
            return field.value;
        }

        field = instance?.fields.get(`~${fieldName}`);

        if (field){
            return field.value;
        }

        return null;
    }

    private convertFieldValueToString(instance:RuntimeAny|undefined){
        if (instance instanceof RuntimeString){
            return instance.value;
        } else if (instance instanceof RuntimeInteger){
            return instance.value.toString();
        } else if (instance instanceof RuntimeBoolean){
            return instance.value.toString();
        } else {
            throw new RuntimeError(`Unable to convert unsupported string interpolation type '${instance?.typeName}' to string`);
        }
    }
}