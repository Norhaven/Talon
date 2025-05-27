import { RuntimeAny } from "./RuntimeAny";
import { WorldObject } from "../../library/WorldObject";
import { Any } from "../../library/Any";
import { RuntimeList } from "./RuntimeList";
import { RuntimeString } from "./RuntimeString";
import { RuntimeError } from "../errors/RuntimeError";
import { Variable } from "./Variable";
import { Type } from "../../common/Type";
import { Field } from "../../common/Field";
import { List } from "../../library/List";
import { StringType } from "../../library/StringType";
import { RuntimeBoolean } from "./RuntimeBoolean";
import { Method } from "../../common/Method";
import { Instruction } from "../../common/Instruction";
import { Memory } from "../common/Memory";
import { BooleanType } from "../../library/BooleanType";

export class RuntimeWorldObject extends RuntimeAny{
    parentTypeName = Any.typeName;
    typeName = WorldObject.typeName;

    static get type():Type{
        const type = new Type(WorldObject.typeName, WorldObject.parentTypeName);
        
        const contents = new Field();
        contents.name = WorldObject.contents;
        contents.typeName = List.typeName;
        contents.defaultValue = [];

        const description = new Field();
        description.name = WorldObject.description;
        description.typeName = StringType.typeName;
        description.defaultValue = "";

        const aliases = new Field();
        aliases.name = WorldObject.aliases;
        aliases.typeName = List.typeName;
        aliases.defaultValue = [];

        const state = new Field();
        state.name = WorldObject.state;
        state.typeName = List.typeName;
        state.defaultValue = [];

        const visible = new Field();
        visible.name = WorldObject.visible;
        visible.typeName = BooleanType.typeName;
        visible.defaultValue = true;

        const currentContainer = new Field();
        currentContainer.name = WorldObject.currentContainer;
        currentContainer.typeName = StringType.typeName;
        currentContainer.defaultValue = "";

        type.fields.push(contents);
        type.fields.push(description);
        type.fields.push(aliases);
        type.fields.push(state);
        type.fields.push(visible);
        type.fields.push(currentContainer);

        return type;
    }

    constructor(){
        super();

        this.defineListContentsMethod();
    }

    private defineListContentsMethod(){
        const current = "~current";
        const listText = "~listText";

        const listContents = new Method();
        listContents.name = WorldObject.listContents;
        listContents.returnType = BooleanType.typeName;

        listContents.body.push(
            Instruction.loadThis(),
            Instruction.loadField(WorldObject.contents),
            Instruction.instanceCall(List.group),
            ...Instruction.forEach(
                Instruction.setLocal(current),
                Instruction.loadLocal(current),
                Instruction.loadProperty(WorldObject.list),
                Instruction.setLocal(listText),
                Instruction.loadLocal(listText),
                Instruction.loadString(""),
                Instruction.compareEqual(),
                ...Instruction.ifTrueThen(
                    Instruction.loadString("1"),
                    Instruction.loadLocal(current),
                    Instruction.getTypeName(),
                    Instruction.concatenate(),
                    Instruction.setLocal(listText)
                ),
                Instruction.loadLocal(listText),
                Instruction.loadLocal(current),
                Instruction.interpolateString(),
                Instruction.print()
            ),
            Instruction.loadBoolean(true),
            Instruction.return()
        );

        this.methods.set(WorldObject.listContents, listContents);
    }

    listContents(){
        const contents = this.getContentsField().groupIfPossible();

        const names = contents.items.map(x => x.typeName);

        const namesWithCount = new Map<string, number>();

        for(const name of names){
            if (!namesWithCount.has(name)){
                namesWithCount.set(name, 1);
            } else {
                const count = namesWithCount.get(name)!;
                namesWithCount.set(name, count + 1);
            }
        }

        const namedValues:string[] = [];

        for(const [name, value] of namesWithCount){
            namedValues.push(`${value} ${name}(s)`);
        }

        const text = namedValues.join('\n');
        
        return Memory.allocateString(text);
    }

    getContentsField():RuntimeList{
        return this.getFieldAsList(WorldObject.contents);
    }

    resolveContainers(){
        const pending = this.getContentsField().items.filter(x => x.isTypeOf(WorldObject.typeName)).map(x => <RuntimeWorldObject>x);

        for(const obj of pending){
            const currentContainer = obj.getField(WorldObject.currentContainer);

            if (!currentContainer){
                throw new RuntimeError(`Unable to locate the current container field for world object '${this.typeName}'`);
            }

            currentContainer.value = Memory.allocateString(this.typeName);

            obj.resolveContainers();
        }
    };
}