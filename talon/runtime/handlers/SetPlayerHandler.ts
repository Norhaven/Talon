import { OpCode } from "../../common/OpCode";
import { Player } from "../../library/Player";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimePlayer } from "../library/RuntimePlayer";
import { OpCodeHandler } from "../OpCodeHandler"
import { Thread } from "../Thread";

export class SetPlayerHandler extends OpCodeHandler{
    public code: OpCode = OpCode.SetPlayer;

    handle(thread:Thread){
        this.logInteraction(thread);

        const newPlayerTypeName = thread.currentInstruction?.value;

        if (!newPlayerTypeName){
            throw new RuntimeError("Unable to set the player to unspecified type");
        }

        const player = Memory.findOrAddInstance(<string>newPlayerTypeName);

        if (!player || !player.isTypeOf(Player.typeName)){
            throw new RuntimeError(`Unable to find or create unknown player type '${newPlayerTypeName}'`);
        }

        thread.currentPlayer = <RuntimePlayer>player;

        return super.handle(thread);
    }
}