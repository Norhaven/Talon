import { OpCode } from "../../common/OpCode";
import { RuntimePlace } from "../library/RuntimePlace";
import { RuntimePlayer } from "../library/RuntimePlayer";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class MoveHandler extends OpCodeHandler{
    public code: OpCode = OpCode.Move;

    handle(thread:Thread){

        const source = <RuntimePlace>thread.currentMethod.pop();
        const context = <RuntimeWorldObject>thread.currentMethod.pop();
        const destination = <RuntimePlace>thread.currentMethod.pop();

        this.logInteraction(thread, source, context, destination);

        if (context instanceof RuntimePlayer){
            thread.currentPlace = destination;            
        } else {
            source.getContentsField().removeInstance(context);
            destination.getContentsField().addInstance(context);
        }

        return super.handle(thread);
    }
}