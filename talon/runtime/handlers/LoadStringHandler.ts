import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";

export class LoadStringHandler extends OpCodeHandler{
    handle(thread:Thread){
        const value = thread.currentInstruction!.value;

        if (typeof value === "string"){
            const stringValue = new RuntimeString(value);
            thread.currentMethod.push(stringValue);

            thread.log?.debug(`.ld.const.str\t"${value}"`);
        } else {
            throw new RuntimeError("Expected a string");
        }

        return super.handle(thread);
    }
}