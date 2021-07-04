import { Thread } from "../Thread";
import { IOutput } from "../IOutput";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { EvaluationResult } from "../EvaluationResult";
import { OpCodeHandler } from "../OpCodeHandler";
import { OpCode } from "../../common/OpCode";

export class PrintHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.Print;

    private output:IOutput;

    constructor(output:IOutput){
        super();
        this.output = output;
    }

    handle(thread:Thread){
        const text = thread.currentMethod.pop();

        this.logInteraction(thread);
        
        if (text instanceof RuntimeString){
            this.output.write(text.value);
        } else {
            throw new RuntimeError("Unable to print, encountered a type on the stack other than string");
        }

        return super.handle(thread);
    }
}