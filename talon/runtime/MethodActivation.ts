import { Method } from "../common/Method";
import { Variable } from "./library/Variable";
import { StackFrame } from "./StackFrame";
import { Instruction } from "../common/Instruction";
import { RuntimeAny } from "./library/RuntimeAny";
import { RuntimeError } from "./errors/RuntimeError";

export class MethodActivation{
    method?:Method;
    stackFrame:StackFrame;
    stack:RuntimeAny[] = [];

    stackSize(){
        return this.stack.length;
    }

    peek(){
        if (this.stack.length == 0){
            throw new RuntimeError(`Stack Imbalance! Attempted to peek an empty stack.`);
        }

        return this.stack[this.stack.length - 1];
    }

    pop(){
        if (this.stack.length == 0){
            throw new RuntimeError(`Stack Imbalance! Attempted to pop an empty stack.`);
        }

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