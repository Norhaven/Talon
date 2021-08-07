import { OpCode } from "../../common/OpCode";
import { WorldObject } from "../../library/WorldObject";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class RemoveStateHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RemoveState;

    handle(thread:Thread){
        const state = <RuntimeString>thread.currentMethod.pop();
        const instance = <RuntimeWorldObject>thread.currentMethod.pop();

        this.logInteraction(thread, state, instance.typeName);

        this.removeState(thread, instance, state.value);
        
        return super.handle(thread);
    }

    private removeState(thread:Thread, target:RuntimeWorldObject, state:string){
        const stateField = target.fields.get(WorldObject.state);
        const stateList = <RuntimeList>stateField?.value;

        stateList.items = stateList.items.filter(x => (<RuntimeString>x).value !== state);
    }
}