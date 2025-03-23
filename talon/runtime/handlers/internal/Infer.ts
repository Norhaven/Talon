import { Type } from "../../../common/Type";
import { WorldObject } from "../../../library/WorldObject";
import { Memory } from "../../common/Memory";
import { Meaning } from "../../library/Meaning";
import { RuntimeTuple } from "../../library/RuntimeTuple";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Thread } from "../../Thread";
import { ActionContext } from "./ActionContext";
import { Lookup } from "./Lookup";

export class Infer{

    static contextFrom(thread:Thread, meaning:Meaning, actorName:string, targetName?:string){
        const actorSources = Infer.actorSourcesFrom(thread, meaning, actorName);
        const [actualActorSource, actor] = Infer.actorFrom(thread, meaning, actorSources, actorName);

        if (!actor){
            return ActionContext.empty;
        }

        const shouldInferTargetFromActor = meaning == Meaning.Moving && (!targetName || targetName == "");
        const actualTargetName = shouldInferTargetFromActor ? actorName : targetName;

        const targetSources = Infer.targetSourcesFrom(thread, meaning, actualTargetName);
        const [actualTargetSource, target] = Infer.targetFrom(thread, meaning, targetSources, actualTargetName);

        return new ActionContext(actualActorSource, actor, actualTargetSource, target);
    }

    static actorSourcesFrom(thread:Thread, meaning:Meaning, actorName?:string){
        switch(meaning){
            case Meaning.Moving:
            case Meaning.Inventory:
            case Meaning.Dropping:
            case Meaning.Giving:
                return [thread.currentPlayer];
            case Meaning.Taking:
                return [thread.currentPlace];
            case Meaning.Describing:{
                if (!actorName){
                    return [thread.currentPlace];
                }
    
                return [thread.currentPlayer, thread.currentPlace];
            }
            case Meaning.Using:
            case Meaning.Combining:
            case Meaning.Opening:
            case Meaning.Closing:{
                if (!actorName){
                    thread.logReadable("No actor name was supplied, inferred no target");
                    return [];
                }
    
                return [thread.currentPlayer, thread.currentPlace];
            }
            default:
                return [];
        }
    }

    static targetSourcesFrom(thread:Thread, meaning:Meaning, targetName?:string):(RuntimeWorldObject|undefined)[]{
        switch(meaning){
            case Meaning.Moving:
            case Meaning.Dropping:
            case Meaning.Giving:
            case Meaning.Taking:
                return [thread.currentPlace];
            case Meaning.Describing:{
                if (!targetName){
                    return [thread.currentPlace];
                }
    
                return [thread.currentPlayer, thread.currentPlace];
            }
            case Meaning.Using:
            case Meaning.Combining:
            case Meaning.Opening:
            case Meaning.Closing:{
                if (!targetName){
                    thread.logReadable("No target name was supplied, inferred no target");
                    return [];
                }
    
                return [thread.currentPlayer, thread.currentPlace];
            }
            default:
                return [undefined];
        }
    }

    static actorFrom(thread:Thread, meaning:Meaning, sources:(RuntimeWorldObject|undefined)[], actorName?:string, ):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        thread.logReadable(`Inferring actor '${actorName}' from meaning '${meaning}'`);
        
        switch(meaning){
            case Meaning.Moving:
            case Meaning.Inventory:
                return [thread.currentPlayer, thread.currentPlayer];
            case Meaning.Dropping:
            case Meaning.Giving:
            case Meaning.Using:
            case Meaning.Combining:
            case Meaning.Opening:
            case Meaning.Closing:
            case Meaning.Taking:{
                if (!actorName){
                    return [undefined, undefined];
                }

                return Lookup.findByNameIn(thread, sources, actorName, false);
            }
            case Meaning.Describing:{
                if (!actorName){
                    return [thread.currentPlace, thread.currentPlace];
                }
    
                return Lookup.findByNameIn(thread, sources, actorName, false);
            }
            default:
                return [undefined, undefined];
        }
    }

    static targetFrom(thread:Thread, meaning:Meaning, sources:(RuntimeWorldObject|undefined)[], targetName:string|undefined):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        const lookupSingletonInstance = (name:string) => <RuntimeWorldObject>Memory.findInstanceByName(name);

        thread.logReadable(`Inferring target '${targetName}' from meaning '${meaning}'`);
        
        switch(meaning){
            case Meaning.Moving:{
                for(const source of sources){
                    if (!source){
                        continue;
                    }

                    const knownDirections = source.getFieldAsList(WorldObject.directions);
                    const matchingDirection = <RuntimeTuple<string>>knownDirections?.items.find(x => (<RuntimeTuple<string>>x).value1 == targetName);
                    const placeName = matchingDirection?.value2;

                    if (!placeName){
                        return [undefined, undefined];
                    }

                    return [source, lookupSingletonInstance(placeName)];
                }

                return [undefined, undefined];
            }
            case Meaning.Inventory:{
                return [thread.currentPlayer, thread.currentPlayer];
            }
            case Meaning.Describing:{
                if (!targetName){
                    return [undefined, undefined];
                }
    
                return Lookup.findByNameIn(thread, sources, targetName, false);
            }
            case Meaning.Giving:{
                if (!targetName){
                    return [undefined, undefined];
                }
    
                return Lookup.findByNameIn(thread, sources, targetName, false);
            }
            case Meaning.Dropping:{
                if (!targetName){
                    return [thread.currentPlace, thread.currentPlace];
                }

                return Lookup.findByNameIn(thread, sources, targetName, false);
            }
            case Meaning.Taking:{
                if (!targetName){
                    return [thread.currentPlayer, thread.currentPlayer];
                }

                return Lookup.findByNameIn(thread, sources, targetName, false);
            }
            case Meaning.Using:
            case Meaning.Combining:
            case Meaning.Opening:
            case Meaning.Closing:{
                if (!targetName){
                    thread.logReadable("No target name was supplied, inferred no target");
                    return [undefined, undefined];
                }
    
                return Lookup.findByNameIn(thread, sources, targetName, false);
            }
            default:{
                return [undefined, undefined];
            }
        }
    }
}