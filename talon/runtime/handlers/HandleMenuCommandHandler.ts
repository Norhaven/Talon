import { OpCode } from "../../common/OpCode";
import { Menu } from "../../library/Menu";
import { WorldObject } from "../../library/WorldObject";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { IOutput } from "../IOutput";
import { RuntimeCommand } from "../library/RuntimeCommand";
import { RuntimeMenu } from "../library/RuntimeMenu";
import { RuntimeMenuOption } from "../library/RuntimeMenuOption";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Event } from "./internal/Event";

export class HandleMenuCommandHandler extends OpCodeHandler{
    public code: OpCode = OpCode.HandleMenuCommand;

    constructor(private readonly output:IOutput){
        super();
    }

    handle(thread:Thread){
        const menu = <RuntimeMenu>thread.currentMethod.pop();
        const command = thread.currentMethod.pop();

        if (!(command instanceof RuntimeCommand)){
            throw new RuntimeError(`Unable to handle a non-command, found '${command}'`);
        }
                
        const action = command.action!.value;

        this.logInteraction(thread, action);

        this.raiseMenuOptionSelectedEvent(thread, menu, action);

        return super.handle(thread);
    }

    private raiseMenuOptionSelectedEvent(thread:Thread, menu:RuntimeMenu, action:string){
        const menuOptionIndex = Number(action) - 1;
        const options = menu.getFieldAsList(WorldObject.contents);
        const option = <RuntimeMenuOption>options.items[menuOptionIndex];
        
        if (!option){
            thread.currentMethod.push(Memory.allocateList([]));
            return;
        }

        Event.using(thread).raiseMenuSelection(menu, option);
    }
}