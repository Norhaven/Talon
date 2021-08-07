import { OpCode } from "../../common/OpCode";
import { WorldObject } from "../../library/WorldObject";
import { Memory } from "../common/Memory";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class IncludeStateHandler extends OpCodeHandler{
    public code: OpCode = OpCode.IncludeState;

    handle(thread:Thread){
        const state = <RuntimeString>thread.currentMethod.pop();
        const instance = <RuntimeWorldObject>thread.currentMethod.pop()!;

        this.logInteraction(thread, state, instance.typeName);

        this.includeState(thread, instance, state.value); 
        
        return super.handle(thread);
    }

    private includeState(thread:Thread, target:RuntimeWorldObject, state:string){
        const stateField = target.fields.get(WorldObject.state);
        const stateList = <RuntimeList>stateField?.value;

        if (stateList.items.some(x => (<RuntimeString>x).value === state)){
            return;
        }

        stateList.items.push(Memory.allocateString(state));
    }
}