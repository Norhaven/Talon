
import * as ts from "ts-mockito";
import { Instruction } from "../talon/common/Instruction";
import { Method } from "../talon/common/Method";
import { Type } from "../talon/common/Type";
import { IPerformanceRuler } from "../talon/IPerformanceRuler";
import { ITimeOutput } from "../talon/ITimeOutput";
import { Any } from "../talon/library/Any";
import { BooleanType } from "../talon/library/BooleanType";
import { Creature } from "../talon/library/Creature";
import { Decoration } from "../talon/library/Decoration";
import { Item } from "../talon/library/Item";
import { List } from "../talon/library/List";
import { Menu } from "../talon/library/Menu";
import { MenuOption } from "../talon/library/MenuOption";
import { NumberType } from "../talon/library/NumberType";
import { Place } from "../talon/library/Place";
import { Player } from "../talon/library/Player";
import { Say } from "../talon/library/Say";
import { StringType } from "../talon/library/StringType";
import { WorldObject } from "../talon/library/WorldObject";
import { Log } from "../talon/Log";
import { Memory } from "../talon/runtime/common/Memory";
import { RuntimeAny } from "../talon/runtime/library/RuntimeAny";
import { MethodActivation } from "../talon/runtime/MethodActivation";
import { OpCodeHandler } from "../talon/runtime/OpCodeHandler";
import { Thread } from "../talon/runtime/Thread";
import { Stopwatch } from "../talon/Stopwatch";
import { TestExpectationBuilder } from "./TestExpectationBuilder";

export class RuntimeTest{
    private static readonly logMock:Log = ts.mock(Log);
    private static readonly timeOutputMock:ITimeOutput = ts.mock<ITimeOutput>();
    private static readonly ruler:IPerformanceRuler = ts.mock<IPerformanceRuler>();
    private static types:Type[] = [];
    private static typeMap:Map<string, Type>;

    readonly thread:Thread;

    private constructor(private readonly activation:MethodActivation, private readonly knownTypes:Type[]){
        this.thread = new Thread(knownTypes, activation, ts.instance(RuntimeTest.logMock));
    }

    get currentInstruction(){
        return this.thread.currentInstruction;
    }

    get stackSize(){
        return this.thread.currentMethod.stackSize();
    }

    nextInstruction(){
        this.thread.currentMethod.stackFrame.currentInstruction++;
    }

    handleCurrentInstructionWith(handler:OpCodeHandler){
        return handler.handle(this.thread);
    }

    peekOnStack(){
        return this.thread.currentMethod.peek();
    }

    pushInstanceOnStack(instance:RuntimeAny){
        this.thread.currentMethod.push(instance);
    }

    expects(value:any){
        return new TestExpectationBuilder(value);
    }

    expectsTopOfStack(use:(instance:RuntimeAny)=>void){
        const instance = this.peekOnStack();
        use(instance);
    }

    allocateOntoStack(...types:Type[]){
        for(const type of types){
            const instance = Memory.allocate(type);
            this.pushInstanceOnStack(instance);
        }
    }

    static activateMethodWith(...instructions:Instruction[]){
        const method = new Method();
        method.body.push(...instructions);

        const activation = new MethodActivation(method);

        const test = new RuntimeTest(activation, RuntimeTest.types);

        test.nextInstruction();

        return test;
    }

    static initializeWith(...knownTypes:Type[]){        
        ts.when(RuntimeTest.logMock.writeStructured(ts.anyString())).thenResolve();
        ts.when(RuntimeTest.logMock.writeFormatted(ts.anyString())).thenResolve();

        // We need to have all of the known system types loaded along with the known types"

        RuntimeTest.types = [];
        RuntimeTest.types.push(new Type(Any.typeName, Any.parentTypeName));
        RuntimeTest.types.push(new Type(List.typeName, List.parentTypeName));
        RuntimeTest.types.push(new Type(Any.typeName, Any.parentTypeName));
        RuntimeTest.types.push(new Type(WorldObject.typeName, WorldObject.parentTypeName));
        RuntimeTest.types.push(new Type(Place.typeName, Place.parentTypeName));
        RuntimeTest.types.push(new Type(BooleanType.typeName, BooleanType.parentTypeName));
        RuntimeTest.types.push(new Type(StringType.typeName, StringType.parentTypeName));
        RuntimeTest.types.push(new Type(NumberType.typeName, NumberType.parentTypeName));
        RuntimeTest.types.push(new Type(Item.typeName, Item.parentTypeName));
        RuntimeTest.types.push(new Type(List.typeName, List.parentTypeName));
        RuntimeTest.types.push(new Type(Player.typeName, Player.parentTypeName));
        RuntimeTest.types.push(new Type(Say.typeName, Say.parentTypeName));
        RuntimeTest.types.push(new Type(Decoration.typeName, Decoration.parentTypeName));
        RuntimeTest.types.push(new Type(Creature.typeName, Creature.parentTypeName));
        RuntimeTest.types.push(new Type(Menu.typeName, Menu.parentTypeName));
        RuntimeTest.types.push(new Type(MenuOption.typeName, MenuOption.parentTypeName));

        RuntimeTest.typeMap = new Map<string, Type>(RuntimeTest.types.map(x => [x.name, x]));

        for(const type of knownTypes){
            if (RuntimeTest.typeMap.has(type.name)){
                throw new Error(`A test initialization attempt failed due to a known type '${type.name}' having the same name as an existing type`);
            }

            RuntimeTest.types.push(type);
            RuntimeTest.typeMap.set(type.name, type);
        }

        Memory.clear();
        Memory.loadTypes(RuntimeTest.types, ts.instance(RuntimeTest.logMock));
        Stopwatch.initialize(ts.instance(RuntimeTest.timeOutputMock), ts.instance(RuntimeTest.ruler));
    }
}