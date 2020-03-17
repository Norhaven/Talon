import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { Memory } from "../common/Memory";

export class ConcatenateHandler extends OpCodeHandler{
    handle(thread:Thread){
        const last = <RuntimeString>thread.currentMethod.pop();
        const first = <RuntimeString>thread.currentMethod.pop();

        const concatenated = Memory.allocateString(first.value + " " + last.value);

        thread.currentMethod.push(concatenated);

        return super.handle(thread);
    }
}