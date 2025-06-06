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
import { LoadThisHandler } from "./handlers/LoadThisHandler";
import { BranchRelativeHandler } from "./handlers/BranchRelativeHandler";
import { BranchRelativeIfFalseHandler } from "./handlers/BranchRelativeIfFalseHandler";
import { ConcatenateHandler } from "./handlers/ConcatenateHandler";
import { AssignVariableHandler } from "./handlers/AssignVariableHandler";
import { TypeOfHandler } from "./handlers/TypeOfHandler";
import { InvokeDelegateHandler } from "./handlers/InvokeDelegateHandler";
import { ComparisonHandler } from "./handlers/ComparisonHandler";
import { RuntimeState } from "./RuntimeState";
import { StateMachine } from "./common/StateMachine";
import { State } from "./common/State";
import { LoadBooleanHandler } from "./handlers/LoadBooleanHandler";
import { CreateDelegateHandler } from "./handlers/CreateDelegateHandler";
import { CompareLessThanHandler } from "./handlers/CompareLessThanHandler";
import { AddHandler } from "./handlers/AddHandler";
import { LoadElementHandler } from "./handlers/LoadElementHandler";
import { SetLocalHandler } from "./handlers/SetLocalHandler";
import { LoadEmptyHandler } from "./handlers/LoadEmptyHandler";
import { InvokeDelegateOnInstanceHandler } from "./handlers/InvokeDelegateOnInstanceHandler";
import { IncludeStateHandler } from "./handlers/IncludeStateHandler";
import { RemoveStateHandler } from "./handlers/RemoveStateHandler";
import { BaseTypeInstanceCallHandler } from "./handlers/BaseTypeInstanceCallHandler";
import { RaiseEventHandler } from "./handlers/RaiseEventHandler";
import { RaiseContextualEventHandler } from "./handlers/RaiseContextualEventHandler";
import { LoadPlaceHandler } from "./handlers/LoadPlaceHandler";
import { ReplaceInstancesHandler } from "./handlers/ReplaceInstancesHandler";
import { ILog } from "../ILog";
import { HandleMenuCommandHandler } from "./handlers/HandleMenuCommandHandler";
import { IgnoreHandler } from "./handlers/IgnoreHandler";
import { LoadStaticFieldHandler } from "./handlers/LoadStaticFieldHandler";
import { AssignStaticFieldHandler } from "./handlers/AssignStaticFieldHandler";
import { Stopwatch } from "../Stopwatch";
import { ITimeOutput } from "../ITimeOutput";
import { IPerformanceRuler } from "../IPerformanceRuler";
import { CompareGreaterThanHandler } from "./handlers/CompareGreaterThanHandler";
import { InterpolateStringHandler } from "./handlers/InterpolateStringHandler";
import { LoadPlayerHandler } from "./handlers/LoadPlayerHandler";
import { GoToLabelHandler } from "./handlers/GoToLabelHandler";
import { SetPlayerHandler } from "./handlers/SetPlayerHandler";
import { GiveHandler } from "./handlers/GiveHandler";
import { GetTypeNameHandler } from "./handlers/GetTypeHandler";
import { RaiseContextualDirectionEventHandler } from "./handlers/RaiseContextualDirectionEventHandler";
import { MoveHandler } from "./handlers/MoveHandler";
import { RuntimeWorldObject } from "./library/RuntimeWorldObject";
import { WorldObject } from "../library/WorldObject";
import { LoadFieldReferenceHandler } from "./handlers/LoadFieldReferenceHandler";
import { LocalExistsHandler } from "./handlers/LocalExistsHandler";

export class TalonRuntime{

    private state:StateMachine<RuntimeState>;
    private thread?:Thread;
    private readonly handlers:Map<OpCode, OpCodeHandler>;

    constructor(private readonly userOutput:IOutput, private readonly log:ILog, private readonly timeOutput:ITimeOutput, private readonly ruler:IPerformanceRuler){
        
        Stopwatch.initialize(timeOutput, ruler);

        const handlerInstances:OpCodeHandler[] = [
            new NoOpHandler(),
            new LoadStringHandler(),
            new PrintHandler(this.userOutput),
            new NewInstanceHandler(),
            new ReadInputHandler(),
            new ParseCommandHandler(),
            new HandleCommandHandler(this.userOutput),
            new HandleMenuCommandHandler(this.userOutput),
            new GoToHandler(),
            new GoToLabelHandler(),
            new ReturnHandler(),
            new StaticCallHandler(),
            new LoadInstanceHandler(),
            new LoadNumberHandler(),
            new LoadBooleanHandler(),
            new InstanceCallHandler(),
            new LoadPropertyHandler(),
            new LoadFieldHandler(),
            new ExternalCallHandler(),
            new LoadLocalHandler(),
            new LoadThisHandler(),
            new BranchRelativeHandler(),
            new BranchRelativeIfFalseHandler(),
            new ConcatenateHandler(),
            new AssignVariableHandler(),
            new TypeOfHandler(),
            new InvokeDelegateHandler(),
            new ComparisonHandler(),
            new CreateDelegateHandler(),
            new CompareLessThanHandler(),
            new CompareGreaterThanHandler(),
            new AddHandler(),
            new LoadElementHandler(),
            new SetLocalHandler(),
            new LoadEmptyHandler(),
            new InvokeDelegateOnInstanceHandler(),
            new IncludeStateHandler(),
            new RemoveStateHandler(),
            new BaseTypeInstanceCallHandler(),
            new RaiseEventHandler(),
            new RaiseContextualEventHandler(),
            new LoadPlaceHandler(),
            new LoadPlayerHandler(),
            new ReplaceInstancesHandler(),
            new IgnoreHandler(),
            new LoadStaticFieldHandler(),
            new AssignStaticFieldHandler(),
            new InterpolateStringHandler(),
            new SetPlayerHandler(),
            new GiveHandler(),
            new GetTypeNameHandler(),
            new RaiseContextualDirectionEventHandler(),
            new MoveHandler(),
            new LoadFieldReferenceHandler(),
            new LocalExistsHandler()
        ];

        this.handlers = new Map<OpCode, OpCodeHandler>(handlerInstances.map(x => [x.code, x]));

        this.state = new StateMachine<RuntimeState>(
            new State<RuntimeState>(
                RuntimeState.Stopped,
                (current:State<RuntimeState>) => current.state !== RuntimeState.Stopped
            ),
            new State<RuntimeState>(
                RuntimeState.Loaded,
                (current:State<RuntimeState>) => {
                    if (current.state === RuntimeState.Started){
                        this.log.writeReadable("The runtime has already been started and can't load more types.");
                        return false;
                    } 

                    return true;
                }
            ),
            new State<RuntimeState>(
                RuntimeState.Started,
                (current:State<RuntimeState>) => {
                    if (current.state === RuntimeState.Started){
                        this.log.writeReadable("The runtime has already been started.");
                        return false;
                    } else if (current.state === RuntimeState.Stopped){
                        this.log.writeReadable("The runtime must be loaded with types prior to being started.");
                        return false;
                    } 

                    return true;
                }
            )
        );
    }

    start(){        
        if (!this.state.tryMoveTo(RuntimeState.Started)){
            return;
        }

        Stopwatch.measure("TalonRuntime.Start", () => {
            
            if (!this.thread){
                throw new RuntimeError("Unable to start Talon runtime, no active thread was present");
            }

            const places = this.thread.allTypes
                            .filter(x => x.baseTypeName == Place.typeName)
                            .map(x => <RuntimePlace>Memory.allocate(x));

            for(const place of places){
                place.resolveContainers();
            }

            const getPlayerStart = (place:RuntimePlace) => <RuntimeBoolean>(place.fields.get(Place.isPlayerStart)?.value);
            const isPlayerStart = (place:RuntimePlace) => getPlayerStart(place)?.value === true;
            const getDefaultPlayer = () => this.thread?.knownTypes.get(Player.typeName);

            const currentPlace = places?.find(isPlayerStart);

            this.thread.currentPlace = currentPlace;
            
            const types = new Map<string, Type>(this.thread.allTypes.map(x => [x.name, x]));
        
            const knownCustomPlayers = this.thread.allTypes.filter(x => x.name != Player.typeName && x.isTypeOf(Player.typeName)) || [];

            const useDefaultPlayer = !knownCustomPlayers || knownCustomPlayers.length != 1;

            const player = useDefaultPlayer ? getDefaultPlayer() : knownCustomPlayers[0];

            if (!player){
                throw new RuntimeError("Unable to locate either the default player type or a single custom type");
            }

            this.thread.currentPlayer = <RuntimePlayer>Memory.allocate(player);

            this.thread.currentPlayer.resolveContainers();

            return this.runWith("");
        });
    }
    
    stop(){
        if (!this.state.tryMoveTo(RuntimeState.Stopped)){
            return;
        }

        Memory.clear();
        this.thread = undefined;
    }

    loadFrom(types:Type[]):boolean{
                
        if (types.length == 0){
            this.log.writeReadable("No types were provided, unable to load runtime.");
            return false;
        }

        if (!this.state.tryMoveTo(RuntimeState.Loaded)){
            return false;
        }

        Memory.clear();

        const loadedTypes = Memory.loadTypes(types, this.log);

        const entryPoint = loadedTypes.find(x => x.attributes.findIndex(attribute => attribute instanceof EntryPointAttribute) > -1);
        const mainMethod = entryPoint?.methods.find(x => x.name == Any.main);        
        const activation = new MethodActivation(mainMethod!);
        
        this.thread = new Thread(loadedTypes, activation, this.log); 

        return true;
    }

    sendCommand(input:string){
        if (!this.state.is(RuntimeState.Started)){
            return false;
        }

        return this.runWith(input);
    }

    private runWith(command:string){
        
        // We're going to keep their command in the visual history to make things easier to understand.

        this.userOutput.write(command);

        // Now we can go ahead and process their command.

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

        try{
            return Stopwatch.measure(`TalonRuntime.Command: ${command}`, () => {
                for(let evaluationResult = this.evaluateCurrentInstruction();
                    evaluationResult === EvaluationResult.Continue || evaluationResult === EvaluationResult.ShutDown;
                    evaluationResult = this.evaluateCurrentInstruction()){
                    
                    if (evaluationResult === EvaluationResult.ShutDown){
                        this.log.writeReadable("Shutting down runtime");
                        this.log.writeStructured("Shutting down runtime");
                        this.stop();
                        return false;
                    }

                    this.thread?.moveNext();
                }

                return true;
            });
        } catch(ex){
            if (ex instanceof RuntimeError){
                this.log.writeFormatted(`Runtime Error: ${ex.message}`);
                this.log.writeFormatted(`Stack Trace: ${ex.stack}`);
                this.log.writeStructuredError(ex, "Error: {message}", ex.message);
            } else {
                this.log.writeFormatted(`Encountered unhandled error: ${ex}`);
                this.log.writeStructuredError(ex, "Unhandled error");
            }          
        }

        return true;
    }

    private evaluateCurrentInstruction(){
        const instruction = this.thread?.currentInstruction;

        const handler = this.handlers.get(instruction?.opCode!);

        if (handler == undefined){
            throw new RuntimeError(`Encountered unsupported OpCode '${instruction?.opCode}'`);
        }
        
        return Stopwatch.measure(`HandleInstruction: ${instruction?.opCode}`, () => {
            return handler?.handle(this.thread!);
        });
    }
}