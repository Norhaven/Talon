import { State } from "../../../common/State";
import { Group } from "../../../library/Group";
import { WorldObject } from "../../../library/WorldObject";
import { RuntimeError } from "../../errors/RuntimeError";
import { RuntimeGroup } from "../../library/RuntimeGroup";
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

        // If it's not the world object itself, it might be one of its aliases.

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

    static findByNameIn(thread:Thread, sources:(RuntimeWorldObject|undefined)[], targetName:string, removeWhenFound:boolean):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        thread.logReadable(`Looking for target '${targetName}' in '${sources.join(', ')}'`);

        for(const source of sources){
            if (!source){
                continue;
            }

            const [actualSource, actualObject] = Lookup.findByNameInSource(thread, source, targetName, removeWhenFound);

            if (actualObject){
                return [actualSource, actualObject];
            }
        }

        return [undefined, undefined];
    }

    private static findByNameInSource(thread:Thread, sourceItem:RuntimeWorldObject, targetName:string, removeWhenFound:boolean):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        thread.logReadable(`Looking for target '${targetName}' in '${sourceItem}'`);

        return this.findTargetIn(thread, sourceItem, x => Lookup.objectNameMatches(x, targetName), removeWhenFound);
    }

    private static findTargetIn(thread:Thread, sourceItem:RuntimeWorldObject, isMatch:(instance:RuntimeWorldObject)=>boolean, removeWhenFound:boolean):[RuntimeWorldObject|undefined, RuntimeWorldObject|undefined]{
        
        thread.logReadable(`Verifying state on source '${sourceItem}`);

        const isAvailable = (item:RuntimeWorldObject) => this.isItemVisible(item) && !this.isState(item, State.closed);

        if (!sourceItem.isTypeOf(Group.typeName) && !this.isItemVisible(sourceItem)){
            thread.logReadable(`Target container not applicable, is invisible`);
            return [undefined, undefined];
        }

        thread.logReadable(`Attempting to locate target within source '${sourceItem.typeName}'`);

        // We're grouping any items that have stated that they can do that so that we can also
        // check any aliases that may be attached to the whole group, falling through to check
        // the group contents along with the other items if necessary.

        const contents = sourceItem.getContentsField();
        const groupedContents = contents.groupIfPossible();
        const items = groupedContents.items.map(x => (<RuntimeWorldObject>x));

        const directMatches = items.filter(x => isMatch(x) && this.isItemVisible(x));

        if (directMatches.length > 0){
            thread.logReadable(`One or more direct matches were found, target matched`);

            const matchedItem = directMatches[0];

            if (removeWhenFound){

                // When we matched a group, we want to unpack all of the items in that group
                // and remove all of them.

                if (matchedItem.isTypeOf(Group.typeName)){
                    const groupContents = (<RuntimeGroup>matchedItem).getContentsField().items.map(x => <RuntimeWorldObject>x);
                    const allItems = new Set<RuntimeWorldObject>(groupContents);

                    contents.items = contents.items.filter(x => !allItems.has(<RuntimeWorldObject>x));
                } else {
                    contents.items = items.filter(x => x !== matchedItem);
                }
            }

            return [sourceItem, directMatches[0]];
        }

        thread.logReadable(`No direct matches were found, continuing search in contents`);

        for(const item of items){

            if (item.isTypeOf(Group.typeName)){
                // We didn't directly match the group, check the group items to see
                // whether one of those will match.

                const group = <RuntimeGroup>item;

                for(const groupItem of group.getContentsField().items){
                    const currentItem = <RuntimeWorldObject>groupItem;
                    const isDirectMatch = isMatch(currentItem) && this.isItemVisible(currentItem);

                    if (isDirectMatch){
                        return [sourceItem, currentItem];
                    }

                    const locatedItem = this.findTargetIn(thread, currentItem, isMatch, removeWhenFound);

                    if (locatedItem){
                        return locatedItem;
                    }
                }
            } else if (!isAvailable(item)){
                thread.logReadable(`Item '${item.typeName}' is unavailable, skipping`)
                continue;
            } else {
                const locatedItem = this.findTargetIn(thread, item, isMatch, removeWhenFound);

                if (locatedItem){
                    return locatedItem;
                }
            }
        }

        return [undefined, undefined];
    }
}