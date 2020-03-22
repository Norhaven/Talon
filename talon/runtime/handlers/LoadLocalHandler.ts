import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadLocalHandler extends OpCodeHandler{
    handle(thread:Thread){

        const localName = thread.currentInstruction?.value!;

        const parameter = thread.currentMethod.method?.actualParameters.find(x => x.name == localName);

        thread.currentMethod.push(parameter?.value!);

        thread.log?.debug(`.ld.param\t\t${localName}=${parameter?.value}`);

        return super.handle(thread);
    }
}