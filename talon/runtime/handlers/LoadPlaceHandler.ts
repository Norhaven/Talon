import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimePlace } from "../library/RuntimePlace";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadPlaceHandler extends OpCodeHandler{
    public code: OpCode = OpCode.LoadPlace;
    
    handle(thread:Thread){

        const placeTypeName = thread.currentInstruction?.value;

        this.logInteraction(thread, placeTypeName);

        let place:RuntimePlace;
        
        if (placeTypeName){
            const instance = Memory.findInstanceByName((<string>placeTypeName));

            if (!(instance instanceof RuntimePlace)){
                throw new RuntimeError(`Tried to load place from type '${placeTypeName}' but it isn't a place`);
            }

            place = <RuntimePlace>instance;
        } else {
            place = thread.currentPlace!;
        }

        thread.currentMethod.push(place);

        return super.handle(thread);
    }
}