import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeCommand } from "../library/RuntimeCommand";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class ParseCommandHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.ParseCommand;

    handle(thread:Thread){

        this.logInteraction(thread);
        
        const text = thread.currentMethod.pop();

        if (text instanceof RuntimeString){
            const commandText = text.value;
            const command = this.parseCommand(commandText);

            thread.currentMethod.push(command);
        } else {
            throw new RuntimeError("Unable to parse command");
        }

        return super.handle(thread);
    }

    private parseCommand(text:string):RuntimeCommand{
        const pieces = text.split(" ");

        const action = pieces[0];
        const actor = pieces[1];
        const target = pieces.length == 4 ? pieces[3] : undefined;

        return Memory.allocateCommand(action, actor, target);
    }
}