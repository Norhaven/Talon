import { Thread } from "../Thread";
import { IOutput } from "../IOutput";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { EvaluationResult } from "../EvaluationResult";
import { OpCodeHandler } from "../OpCodeHandler";

export class PrintHandler extends OpCodeHandler{
    private output:IOutput;

    constructor(output:IOutput){
        super();
        this.output = output;
    }

    handle(thread:Thread){
        const text = thread.currentMethod.pop();

        if (text instanceof RuntimeString){
            thread.log?.debug(".print");
            this.output.write(text.value);
        } else {
            throw new RuntimeError("Unable to print, encountered a type on the stack other than string");
        }

        return super.handle(thread);
    }
}