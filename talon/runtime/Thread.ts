import { MethodActivation } from "./MethodActivation";
import { Type } from "../common/Type";
import { Understanding } from "../library/Understanding";
import { RuntimePlace } from "./library/RuntimePlace";
import { RuntimePlayer } from "./library/RuntimePlayer";
import { RuntimeEmpty } from "./library/RuntimeEmpty";
import { Method } from "../common/Method";
import { IOutput } from "./IOutput";
import { ILog } from "../ILog";
import { RuntimeMenu } from "./library/RuntimeMenu";

export class Thread{
    allTypes:Type[] = [];
    knownTypes:Map<string, Type> = new Map<string, Type>();
    knownUnderstandings:Type[] = [];
    knownPlaces:RuntimePlace[] = [];
    methods:MethodActivation[] = [];
    currentPlace?:RuntimePlace;
    currentPlayer?:RuntimePlayer;
    
    get currentMethod() {
        return this.methods[this.methods.length - 1];
    }

    get currentInstruction() {
        const activation = this.currentMethod;
        return activation.method?.body[activation.stackFrame.currentInstruction];
    }

    constructor(types:Type[], method:MethodActivation, public readonly log:ILog){
        this.allTypes = types;
        this.knownTypes = new Map<string, Type>(types.map(type => [type.name, type]));
        this.knownUnderstandings = types.filter(x => x.baseTypeName === Understanding.typeName);
        
        this.methods.push(method);
    }

    logFormatted(message:string){
        this.log.writeFormatted(message);
    }

    logReadable(message:string){
        this.log.writeReadable(message);
    }

    logStructured(message:string, ...parameters:any[]){
        this.log.writeStructured(message, ...parameters);
    }

    currentInstructionValueAs<T>(){
        return <T>this.currentInstruction?.value!;
    }

    activateMethod(method:Method){
        const activation = new MethodActivation(method);
        const current = this.currentMethod;

        this.logFormatted(`${current.method?.name} => ${method.name}`);
        this.logStructured("Method {name} activated from caller {callerName}: {@method}", method.name, current.method?.name, method);

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

        this.logFormatted(`${this.currentMethod?.method?.name} <= ${returnedMethod?.method?.name}`);
        this.logStructured("Method {name}'s activation has completed, returning to {callerName}", returnedMethod?.method?.name, this.currentMethod?.method?.name);

        if (!expectReturnType){
            return new RuntimeEmpty();
        }

        const returnValue = returnedMethod?.stack.pop();
        
        return returnValue!;
    }
}