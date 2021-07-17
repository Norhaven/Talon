import { OpCode } from "../../common/OpCode";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeList } from "../library/RuntimeList";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadElementHandler extends OpCodeHandler{
    public code: OpCode = OpCode.LoadElement;

    handle(thread:Thread){
        this.logInteraction(thread);

        const elementNumber = <RuntimeInteger>thread.currentMethod.pop();
        const list = <RuntimeList>thread.currentMethod.pop();

        const item = list.items[elementNumber.value];

        thread.currentMethod.push(item);

        return super.handle(thread);
    }
}