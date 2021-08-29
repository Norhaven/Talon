import { OpCode } from "../../common/OpCode";
import { Type } from "../../common/Type";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeAny } from "../library/RuntimeAny";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeString } from "../library/RuntimeString";
import { RuntimeWorldObject } from "../library/RuntimeWorldObject";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { Lookup } from "./internal/Lookup";

export class ReplaceInstancesHandler extends OpCodeHandler{
    public code: OpCode = OpCode.ReplaceInstances;

    handle(thread:Thread){

        const replacementTypeName = <string>thread.currentInstruction?.value!;
        const numberToReplace = <RuntimeInteger>thread.currentMethod.pop();
        
        this.logInteraction(thread, numberToReplace, replacementTypeName);

        const replacedEntities:RuntimeWorldObject[] = [];

        for(let i = 0; i < numberToReplace.value; i++){
            const entity = thread.currentMethod.pop()!;

            if (!(entity instanceof RuntimeWorldObject)){
                throw new RuntimeError(`Unable to replace entity of type '${entity.typeName}', expected a world object instance`);
            }

            replacedEntities.push(entity);
        }

        const replacementType = Memory.findTypeByName(replacementTypeName)!;
        const replacement = Memory.allocate(replacementType);

        const placeContents = thread.currentPlace?.getContentsField()!;
        const playerContents = thread.currentPlayer?.getContentsField()!;

        let entitiesAreInPlace = false;

        for(const entity of replacedEntities){
            let container = Lookup.containingWorldObject(thread, thread.currentPlace!, entity);

            if (container){
                thread.logInfo?.debug(`Found '${entity.typeName}' in '${container.typeName}'`);
                container.getContentsField().removeInstance(entity);
                entitiesAreInPlace = true;
                continue;
            }

            container = Lookup.containingWorldObject(thread, thread.currentPlayer!, entity);

            if (container){
                container.getContentsField().removeInstance(entity);
                continue;
            }

            throw new RuntimeError(`Attempted to replace entity '${entity.typeName}' but could not locate it`);
        }

        if (entitiesAreInPlace){
            placeContents.addInstance(replacement);
        } else {
            playerContents.addInstance(replacement);
        }

        return super.handle(thread);
    }
}