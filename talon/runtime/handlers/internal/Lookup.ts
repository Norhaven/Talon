import { States } from "../../../common/States";
import { WorldObject } from "../../../library/WorldObject";
import { RuntimeError } from "../../errors/RuntimeError";
import { RuntimeList } from "../../library/RuntimeList";
import { RuntimeString } from "../../library/RuntimeString";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Thread } from "../../Thread";

export class Lookup{
    static containingWorldObject(thread:Thread, rootContainer:RuntimeWorldObject, instance:RuntimeWorldObject){
        const [container, _] = Lookup.findTargetIn(thread, rootContainer, x => Object.is(x, instance), false);

        return container;
    }

    private static objectNameMatches(worldObject:RuntimeWorldObject, name:string){
        if (worldObject.typeName.toLowerCase() === name.toLowerCase()){
            return true;
        }

        const aliases = <RuntimeList>worldObject.fields.get(WorldObject.aliases)?.value;

        for(const alias of aliases.items){
            if (alias instanceof RuntimeString){
                if (alias.value.toLowerCase() === name.toLowerCase()){
                    return true;
                }
            } else {
                throw new RuntimeError(`Found type '${alias.typeName}' instead of string during alias match attempt`);
            }
        }

        return false;
    }
    private static isState(target:RuntimeWorldObject, state:string){
        const stateField = target.fields.get(WorldObject.state);
        const stateList = <RuntimeList>stateField?.value;

        return stateList.items.some(x => (<RuntimeString>x).value === state);
    }
    
    private static isItemVisible(item:RuntimeWorldObject){
        const visible = item.getFieldAsBoolean(WorldObject.visible);
        return visible.value;
    }

    static findTargetByNameIn(thread:Thread, sourceItem:RuntimeWorldObject, targetName:string, removeWhenFound:boolean):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        thread.writeInfo(`Looking for target '${targetName}' in '${sourceItem}'`);

        return this.findTargetIn(thread, sourceItem, x => Lookup.objectNameMatches(x, targetName), removeWhenFound);
    }

    private static findTargetIn(thread:Thread, sourceItem:RuntimeWorldObject, isMatch:(instance:RuntimeWorldObject)=>boolean, removeWhenFound:boolean):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        
        thread.writeInfo(`Verifying state on source '${sourceItem}`);

        const isAvailable = (item:RuntimeWorldObject) => this.isItemVisible(item) && !this.isState(item, States.closed);
        const isClosed = this.isState(sourceItem, States.closed);

        if (!this.isItemVisible(sourceItem) || isClosed){
            thread.writeInfo(`Target container not applicable, is invisible or closed`);
            return [undefined, undefined];
        }

        thread.writeInfo(`Attempting to locate target within source '${sourceItem.typeName}'`);

        const contents = sourceItem.getContentsField();
        const items = contents.items.map(x => (<RuntimeWorldObject>x));

        const directMatches = items.filter(x => isMatch(x) && this.isItemVisible(x));

        if (directMatches.length > 0){
            thread.writeInfo(`One or more direct matches were found, target matched`);

            const matchedItem = directMatches[0];

            if (removeWhenFound){
                contents.items = items.filter(x => x !== matchedItem);
            }

            return [sourceItem, directMatches[0]];
        }

        thread.writeInfo(`No direct matches were found, continuing search in contents`);

        for(const item of items){
            if (!isAvailable(item)){
                thread.writeInfo(`Item '${item.typeName}' is unavailable, skipping`)
                continue;
            }

            const locatedItem = this.findTargetIn(thread, item, isMatch, removeWhenFound);

            if (locatedItem){
                return locatedItem;
            }
        }

        return [undefined, undefined];
    }
}