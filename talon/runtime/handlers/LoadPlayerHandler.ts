import { OpCode } from "../../common/OpCode";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimePlayer } from "../library/RuntimePlayer";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";

export class LoadPlayerHandler extends OpCodeHandler{
    public code: OpCode = OpCode.LoadPlayer;

    handle(thread:Thread){
    
            const playerTypeName = thread.currentInstruction?.value;
    
            this.logInteraction(thread, playerTypeName);
    
            let player:RuntimePlayer;
            
            if (playerTypeName){
                const instance = Memory.findInstanceByName((<string>playerTypeName));
    
                if (!(instance instanceof RuntimePlayer)){
                    throw new RuntimeError(`Tried to load player from type '${playerTypeName}' but it isn't a player`);
                }
    
                player = <RuntimePlayer>instance;
            } else {
                player = thread.currentPlayer!;
            }
    
            thread.currentMethod.push(player);
    
            return super.handle(thread);
        }
}