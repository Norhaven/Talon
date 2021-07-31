import { Thread } from "./Thread";
import { OpCode } from "../common/OpCode";
import { EvaluationResult } from "./EvaluationResult";

export abstract class OpCodeHandler{
    
    public abstract readonly code:OpCode;
    
    protected logInteraction(thread:Thread, ...parameters:any[]){
        let formattedLine = this.code.toString();

        if (parameters && parameters.length > 0){
            formattedLine += ' ' + parameters.join(' ');
        }
        
        thread.writeDebug(formattedLine);
    }

    handle(thread:Thread){       
        return EvaluationResult.Continue;
    }
}