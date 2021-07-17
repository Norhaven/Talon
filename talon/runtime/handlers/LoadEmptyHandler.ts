import { OpCode } from "../../common/OpCode";
import { RuntimeEmpty } from "../library/RuntimeEmpty";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadEmptyHandler extends OpCodeHandler{
    public code: OpCode = OpCode.LoadEmpty;

    handle(thread:Thread){
        this.logInteraction(thread);

        thread.currentMethod.push(new RuntimeEmpty());

        return super.handle(thread);
    }
}