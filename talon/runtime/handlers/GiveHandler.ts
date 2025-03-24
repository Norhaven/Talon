import { OpCode } from "../../common/OpCode";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class GiveHandler extends OpCodeHandler{
    public code: OpCode = OpCode.Give;

    handle(thread:Thread){

        this.logInteraction(thread);

        const target = thread.currentMethod.pop();
        const newInstance = thread.currentMethod.pop();

        if (!target || !newInstance){
            throw new RuntimeError("Unable to locate either the target or the type to give!");
        }

        if (target instanceof RuntimeWorldObject){
            target.getContentsField().addInstance(newInstance);
        } else {
            throw new RuntimeError("Unable to give things to a non-world-object!");
        }

        return super.handle(thread);
    }
}