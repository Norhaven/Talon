import { MethodActivation } from "./MethodActivation";
import { Type } from "../common/Type";
import { Understanding } from "../library/Understanding";
import { RuntimePlace } from "./library/RuntimePlace";
import { RuntimePlayer } from "./library/RuntimePlayer";
import { RuntimeEmpty } from "./library/RuntimeEmpty";
import { ILogOutput } from "./ILogOutput";
import { Method } from "../common/Method";

export class Thread{
    allTypes:Type[] = [];
    knownTypes:Map<string, Type> = new Map<string, Type>();
    knownUnderstandings:Type[] = [];
    knownPlaces:RuntimePlace[] = [];
    methods:MethodActivation[] = [];
    currentPlace?:RuntimePlace;
    currentPlayer?:RuntimePlayer;
    log?:ILogOutput;
    logInfo?:ILogOutput;
    
    get currentMethod() {
        return this.methods[this.methods.length - 1];
    }

    get currentInstruction() {
        const activation = this.currentMethod;
        return activation.method?.body[activation.stackFrame.currentInstruction];
    }

    constructor(types:Type[], method:MethodActivation){
        this.allTypes = types;
        this.knownTypes = new Map<string, Type>(types.map(type => [type.name, type]));
        this.knownUnderstandings = types.filter(x => x.baseTypeName === Understanding.typeName);
        
        this.methods.push(method);
    }

    writeDebug(message:string){
        this.log?.debug(message);
    }

    writeInfo(message:string){
        this.logInfo?.debug(message);
    }

    currentInstructionValueAs<T>(){
        return <T>this.currentInstruction?.value!;
    }

    activateMethod(method:Method){
        const activation = new MethodActivation(method);
        const current = this.currentMethod;

        this.writeDebug(`${current.method?.name} => ${method.name}`);

        this.methods.push(activation);
    }
    
    moveNext(){
        this.currentMethod.stackFrame.currentInstruction++;
    }

    jumpToLine(lineNumber:number){
        this.currentMethod.stackFrame.currentInstruction = lineNumber;
    }

    returnFromCurrentMethod(){
        const expectReturnType = this.currentMethod.method!.returnType != "";
        const returnedMethod = this.methods.pop();

        this.writeDebug(`${this.currentMethod.method?.name} <= ${returnedMethod?.method?.name}`);

        if (!expectReturnType){
            return new RuntimeEmpty();
        }

        const returnValue = returnedMethod?.stack.pop();
        
        return returnValue!;
    }
}