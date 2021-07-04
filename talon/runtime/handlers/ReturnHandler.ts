import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { EvaluationResult } from "../EvaluationResult";
import { RuntimeEmpty } from "../library/RuntimeEmpty";
import { RuntimeError } from "../errors/RuntimeError";
import { OpCode } from "../../common/OpCode";

export class ReturnHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.Return;

    handle(thread:Thread){
        // TODO: Handle returning top value on stack based on return type of method.
        
        const current = thread.currentMethod;
        const size = current.stackSize();
        const hasReturnType = current.method?.returnType != "";

        if (hasReturnType){
            if (size == 0){
                throw new RuntimeError("Expected return value from method but found no instance on the stack");
            } else if (size > 1){
                throw new RuntimeError(`Stack Imbalance! Returning from '${current.method?.name}' found '${size}' instances left but expected one.`);
            }
        } else {
            if (size > 0){
                throw new RuntimeError(`Stack Imbalance! Returning from '${current.method?.name}' found '${size}' instances left but expected zero.`);
            }
        }

        const returnValue = thread!.returnFromCurrentMethod();

        if (!(returnValue instanceof RuntimeEmpty)){
            
            this.logInteraction(thread, returnValue);
            thread?.currentMethod.push(returnValue);
        } else {
            this.logInteraction(thread, 'void');
        }

        return EvaluationResult.Continue;
    }
}