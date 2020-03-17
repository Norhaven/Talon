import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { EvaluationResult } from "../EvaluationResult";
import { RuntimeEmpty } from "../library/RuntimeEmpty";

export class ReturnHandler extends OpCodeHandler{
    handle(thread:Thread){
        // TODO: Handle returning top value on stack based on return type of method.
        
        const current = thread.currentMethod;
        const returnValue = thread!.returnFromCurrentMethod();

        if (!(returnValue instanceof RuntimeEmpty)){
            thread.log?.debug(`ret\t\t${returnValue}`);
            thread?.currentMethod.push(returnValue);
        } else {
            thread.log?.debug("ret void");
        }

        return EvaluationResult.Continue;
    }
}