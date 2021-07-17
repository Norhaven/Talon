import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { RuntimeAny } from "../library/RuntimeAny";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class SetLocalHandler extends OpCodeHandler{
    public code: OpCode = OpCode.SetLocal;

    handle(thread:Thread){

        const localName = <string>thread.currentInstruction?.value!;
        const value = <RuntimeAny>thread.currentMethod.pop();
        
        this.logInteraction(thread, localName);

        let parameter = thread.currentMethod.method?.actualParameters.find(x => x.name == localName)!;

        if (!parameter){
            parameter = new Variable(localName, new Type(RuntimeAny.name, ""), undefined);

            thread.currentMethod.method?.actualParameters.push(parameter);
        }

        parameter.value = value;

        return super.handle(thread);
    }
}