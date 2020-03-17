import { Method } from "../common/Method";
import { Variable } from "./library/Variable";
import { StackFrame } from "./StackFrame";
import { Instruction } from "../common/Instruction";
import { RuntimeAny } from "./library/RuntimeAny";

export class MethodActivation{
    method?:Method;
    stackFrame:StackFrame;
    stack:RuntimeAny[] = [];

    stackSize(){
        return this.stack.length;
    }

    pop(){
        return this.stack.pop();
    }

    push(runtimeAny:RuntimeAny){
        this.stack.push(runtimeAny);
    }

    constructor(method:Method){
        this.method = method;
        this.stackFrame = new StackFrame(method);
    }
}