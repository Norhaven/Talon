import { Thread } from "./Thread";
import { OpCode } from "../common/OpCode";
import { EvaluationResult } from "./EvaluationResult";
import { RuntimeAny } from "./library/RuntimeAny";
import { RuntimeError } from "./errors/RuntimeError";

export abstract class OpCodeHandler{
    
    public abstract readonly code:OpCode;
    
    protected logInteraction(thread:Thread, ...parameters:any[]){
        let formattedLine = this.code.toString();

        if (parameters && parameters.length > 0){
            formattedLine += ' ' + parameters.join(' ');
        }
        
        thread.writeDebug(formattedLine);
    }

    protected getMostDerivedFieldFrom(instance:RuntimeAny|null, fieldName:string){
        for(let current = instance;
            current;
            current = current.base){
            
            const method = current.fields.get(fieldName!);

            if (method){
                return method;
            }
        }

        throw new RuntimeError(`Unable to locate field '${fieldName}' within type hierarchy for type '${instance?.typeName}'`);
    }    

    protected getMostDerivedMethodFrom(instance:RuntimeAny|null, methodName:string){
        for(let current = instance;
            current;
            current = current.base){
            
            const method = current.methods.get(methodName);

            if (method){
                return method;
            }
        }

        throw new RuntimeError(`Unable to locate method '${methodName}' within type hierarchy for type '${instance?.typeName}'`);
    }

    handle(thread:Thread){       
        return EvaluationResult.Continue;
    }
}