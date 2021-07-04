import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeCommand } from "../library/RuntimeCommand";
import { Memory } from "../common/Memory";
import { OpCode } from "../../common/OpCode";

export class ParseCommandHandler extends OpCodeHandler{
    protected code: OpCode = OpCode.ParseCommand;

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
        const command = Memory.allocateCommand();
        
        command.action = Memory.allocateString(pieces[0]);
        command.targetName = Memory.allocateString(pieces[1]);

        return command;
    }
}