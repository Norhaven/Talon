import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { MethodActivation } from "../MethodActivation";
import { Variable } from "../library/Variable";

export class LoadPropertyHandler extends OpCodeHandler{
    constructor(private fieldName?:string){
        super();
    }

    handle(thread:Thread){

        const instance = thread.currentMethod.pop();

        if (!this.fieldName){
            this.fieldName = <string>thread.currentInstruction?.value!;
        }

        const field = instance?.fields.get(this.fieldName);

        const value = field?.value!;

        const getField = instance?.methods.get(`<>get_${this.fieldName}`);

        thread.log?.debug(`ld.prop\t\t${instance?.typeName}::${this.fieldName} {get=${getField != undefined}} // ${value}`);

        if (getField){
            getField.actualParameters.push(new Variable("<>value", field?.type!, value));

            thread.activateMethod(getField);
        } else {
            thread.currentMethod.push(value);
        }

        return super.handle(thread);
    }
}