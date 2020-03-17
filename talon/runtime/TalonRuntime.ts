import { Type } from "../common/Type";
import { Thread } from "./Thread";
import { EntryPointAttribute } from "../library/EntryPointAttribute";
import { Any } from "../library/Any";
import { MethodActivation } from "./MethodActivation";
import { EvaluationResult } from "./EvaluationResult";
import { OpCode } from "../common/OpCode";
import { OpCodeHandler } from "./OpCodeHandler";
import { PrintHandler } from "./handlers/PrintHandler";
import { IOutput } from "./IOutput";
import { NoOpHandler } from "./handlers/NoOpHandler";
import { LoadStringHandler } from "./handlers/LoadStringHandler";
import { NewInstanceHandler } from "./handlers/NewInstanceHandler";
import { RuntimeCommand } from "./library/RuntimeCommand";
import { Memory } from "./common/Memory";
import { ReadInputHandler } from "./handlers/ReadInputHandler";
import { ParseCommandHandler } from "./handlers/ParseCommandHandler";
import { GoToHandler } from "./handlers/GoToHandler";
import { HandleCommandHandler } from "./handlers/HandleCommandHandler";
import { Place } from "../library/Place";
import { RuntimePlace } from "./library/RuntimePlace";
import { RuntimeBoolean } from "./library/RuntimeBoolean";
import { Player } from "../library/Player";
import { Say } from "../library/Say";
import { RuntimeEmpty } from "./library/RuntimeEmpty";
import { ReturnHandler } from "./handlers/ReturnHandler";
import { StaticCallHandler } from "./handlers/StaticCallHandler";
import { RuntimeError } from "./errors/RuntimeError";
import { RuntimePlayer } from "./library/RuntimePlayer";
import { LoadInstanceHandler } from "./handlers/LoadInstanceHandler";
import { LoadNumberHandler } from "./handlers/LoadNumberHandler";
import { InstanceCallHandler } from "./handlers/InstanceCallHandler";
import { LoadPropertyHandler } from "./handlers/LoadPropertyHandler";
import { LoadFieldHandler } from "./handlers/LoadFieldHandler";
import { ExternalCallHandler } from "./handlers/ExternalCallHandler";
import { LoadLocalHandler } from "./handlers/LoadLocalHandler";
import { ILogOutput } from "./ILogOutput";
import { LoadThisHandler } from "./handlers/LoadThisHandler";
import { BranchRelativeHandler } from "./handlers/BranchRelativeHandler";
import { BranchRelativeIfFalseHandler } from "./handlers/BranchRelativeIfFalseHandler";
import { ConcatenateHandler } from "./handlers/ConcatenateHandler";

export class TalonRuntime{

    private thread?:Thread;
    private handlers:Map<OpCode, OpCodeHandler> = new Map<OpCode, OpCodeHandler>();

    constructor(private readonly userOutput:IOutput, private readonly logOutput?:ILogOutput){
        this.userOutput = userOutput;

        this.handlers.set(OpCode.NoOp, new NoOpHandler());
        this.handlers.set(OpCode.LoadString, new LoadStringHandler());
        this.handlers.set(OpCode.Print, new PrintHandler(this.userOutput));
        this.handlers.set(OpCode.NewInstance, new NewInstanceHandler());
        this.handlers.set(OpCode.ReadInput, new ReadInputHandler());
        this.handlers.set(OpCode.ParseCommand, new ParseCommandHandler());
        this.handlers.set(OpCode.HandleCommand, new HandleCommandHandler(this.userOutput));
        this.handlers.set(OpCode.GoTo, new GoToHandler());
        this.handlers.set(OpCode.Return, new ReturnHandler());
        this.handlers.set(OpCode.StaticCall, new StaticCallHandler());
        this.handlers.set(OpCode.LoadInstance, new LoadInstanceHandler());
        this.handlers.set(OpCode.LoadNumber, new LoadNumberHandler());
        this.handlers.set(OpCode.InstanceCall, new InstanceCallHandler());
        this.handlers.set(OpCode.LoadProperty, new LoadPropertyHandler());
        this.handlers.set(OpCode.LoadField, new LoadFieldHandler());
        this.handlers.set(OpCode.ExternalCall, new ExternalCallHandler());
        this.handlers.set(OpCode.LoadLocal, new LoadLocalHandler());
        this.handlers.set(OpCode.LoadThis, new LoadThisHandler());
        this.handlers.set(OpCode.BranchRelative, new BranchRelativeHandler());
        this.handlers.set(OpCode.BranchRelativeIfFalse, new BranchRelativeIfFalseHandler());
        this.handlers.set(OpCode.Concatenate, new ConcatenateHandler());
    }

    start(){
        const places = this.thread?.allTypes
                        .filter(x => x.baseTypeName == Place.typeName)
                        .map(x => <RuntimePlayer>Memory.allocate(x));

        const getPlayerStart = (place:RuntimePlace) => <RuntimeBoolean>(place.fields.get(Place.isPlayerStart)?.value);
        const isPlayerStart = (place:RuntimePlace) => getPlayerStart(place)?.value === true;

        const currentPlace = places?.find(isPlayerStart);

        this.thread!.currentPlace = currentPlace;

        const player = this.thread?.knownTypes.get(Player.typeName)!;

        this.thread!.currentPlayer = <RuntimePlayer>Memory.allocate(player);

        this.runWith("");
    }

    stop(){

    }

    loadFrom(types:Type[]){
        const loadedTypes = Memory.loadTypes(types);

        const entryPoint = loadedTypes.find(x => x.attributes.findIndex(attribute => attribute instanceof EntryPointAttribute) > -1);
        const mainMethod = entryPoint?.methods.find(x => x.name == Any.main);        
        const activation = new MethodActivation(mainMethod!);
        
        this.thread = new Thread(loadedTypes, activation);  
        this.thread.log = this.logOutput;      
    }

    sendCommand(input:string){
        this.runWith(input);
    }

    private runWith(command:string){
        const instruction = this.thread!.currentInstruction;

        if (instruction?.opCode == OpCode.ReadInput){
            const text = Memory.allocateString(command);
            this.thread?.currentMethod.push(text);

            this.thread?.moveNext();
        }

        if (this.thread?.currentInstruction == undefined){
            this.thread?.moveNext();
        }

        if (this.thread?.currentInstruction == undefined){
            throw new RuntimeError("Unable to execute command, no instruction found");
        }

        for(let instruction = this.evaluateCurrentInstruction();
            instruction == EvaluationResult.Continue;
            instruction = this.evaluateCurrentInstruction()){

            this.thread?.moveNext();
        }
    }

    private evaluateCurrentInstruction(){
        const instruction = this.thread?.currentInstruction;

        const handler = this.handlers.get(instruction?.opCode!);

        if (handler == undefined){
            throw new RuntimeError(`Encountered unsupported OpCode ${instruction?.opCode}`);
        }
        
        return handler?.handle(this.thread!);
    }
}