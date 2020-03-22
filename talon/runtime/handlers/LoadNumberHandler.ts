import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Memory } from "../common/Memory";

export class LoadNumberHandler extends OpCodeHandler{
    handle(thread:Thread){

        const value = <number>thread.currentInstruction?.value!;
        const runtimeValue = Memory.allocateNumber(value);

        thread.currentMethod.push(runtimeValue);

        thread.log?.debug(`.ld.const.num\t${value}`);

        return super.handle(thread);
    }
}