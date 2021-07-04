import { Thread } from "./Thread";
import { OpCode } from "../common/OpCode";
import { EvaluationResult } from "./EvaluationResult";

export abstract class OpCodeHandler{
    
    protected abstract code:OpCode;
    
    protected logInteraction(thread:Thread, ...parameters:any[]){
        let formattedLine = this.code.toString();

        if (parameters && parameters.length > 0){
            formattedLine += ' ' + parameters.join(' ');
        }
        
        thread.log?.debug(formattedLine);
    }

    handle(thread:Thread){
        return EvaluationResult.Continue;
    }
}