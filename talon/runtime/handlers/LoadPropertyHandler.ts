import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { MethodActivation } from "../MethodActivation";
import { Variable } from "../library/Variable";
import { InstanceCallHandler } from "./InstanceCallHandler";
import { LoadThisHandler } from "./LoadThisHandler";
import { EvaluationResult } from "../EvaluationResult";
import { OpCode } from "../../common/OpCode";

export class LoadPropertyHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.LoadProperty;

    constructor(private fieldName?:string){
        super();
    }

    handle(thread:Thread){

        const instance = thread.currentMethod.pop();

        if (!this.fieldName){
            this.fieldName = <string>thread.currentInstruction?.value!;
        }

        try{
            const field = instance?.fields.get(this.fieldName);
            const value = field?.value!;
            const getField = instance?.methods.get(`~get_${this.fieldName}`);

            this.logInteraction(thread, `${instance?.typeName}::${this.fieldName}`, `{get=${getField != undefined}}`, '//', value);

            if (getField){
                thread.currentMethod.push(value);

                const loadThis = new LoadThisHandler();
                const result = loadThis.handle(thread);

                if (result != EvaluationResult.Continue){
                    return result;
                }
                
                const handler = new InstanceCallHandler(getField.name);
                handler.handle(thread);

                //getField.actualParameters.push(new Variable("~value", field?.type!, value));

                //thread.activateMethod(getField);
            } else {
                thread.currentMethod.push(value);
            }

            return super.handle(thread);
        } finally{
            this.fieldName = undefined;
        }
    }
}