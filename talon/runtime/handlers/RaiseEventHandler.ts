import { EventType } from "../../common/EventType";
import { Instruction } from "../../common/Instruction";
import { Method } from "../../common/Method";
import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { BooleanType } from "../../library/BooleanType";
import { Memory } from "../common/Memory";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { Variable } from "../library/Variable";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class RaiseEventHandler extends OpCodeHandler{
    public code: OpCode = OpCode.RaiseEvent;

    constructor(private eventType?:EventType){
        super();
    }

    handle(thread:Thread){

        if (!this.eventType){
            this.eventType = <EventType>thread.currentInstruction?.value;

            if (!this.eventType){
                this.eventType = <EventType>(<RuntimeString>thread.currentMethod.pop()).value;
            }
        }
        
        const target = <RuntimeWorldObject>thread.currentMethod.pop()!;
        
        this.logInteraction(thread, target.typeName, this.eventType);

        const events = Array.from(target.methods.values()!).filter(x => x.eventType == this.eventType && x.parameters.length === 0);

        thread.writeInfo(`Attempting to raise '${events.length}' events for '${this.eventType}' on '${target.typeName}'...`);

        if (events.length == 0){
            const method = new Method();
            method.name = "~anonDefaultEvent";
            method.returnType = BooleanType.typeName;

            method.body = [
                Instruction.loadBoolean(true),
                Instruction.return()
            ];

            thread.currentMethod.push(new RuntimeDelegate(method));
            
            return super.handle(thread);
        }

        for(const event of events){

            event.actualParameters = [
                Variable.forThis(new Type(target.typeName, target.parentTypeName), target)
            ];

            const delegate = new RuntimeDelegate(event);

            thread.currentMethod.push(delegate);           
        }

        return super.handle(thread);
    }
}