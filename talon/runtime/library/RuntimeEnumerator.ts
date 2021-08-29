import { Instruction } from "../../common/Instruction";
import { Method } from "../../common/Method";
import { Any } from "../../library/Any";
import { Enumerator } from "../../library/Enumerator";
import { Memory } from "../common/Memory";
import { RuntimeAny } from "./RuntimeAny";
import { RuntimeBoolean } from "./RuntimeBoolean";

export class RuntimeEnumerator extends RuntimeAny{
    typeName = Enumerator.typeName;
    parentTypeName = Any.typeName;

    private currentIndex = -1;

    constructor(private readonly items:RuntimeAny[]){
        super();

        this.defineMoveNextMethod();
        this.defineCurrentMethod();
    }

    private defineMoveNextMethod(){
        const moveNextMethod = new Method();
        moveNextMethod.name = Enumerator.moveNext;
        
        moveNextMethod.returnType = RuntimeBoolean.name;
        
        moveNextMethod.body.push(
            Instruction.loadThis(),
            Instruction.externalCall("moveNext"),
            Instruction.return()
        );

        this.methods.set(Enumerator.moveNext, moveNextMethod);
    }

    private defineCurrentMethod(){
        const currentMethod = new Method();
        currentMethod.name = Enumerator.current;
        
        currentMethod.returnType = RuntimeBoolean.name;
        
        currentMethod.body.push(
            Instruction.loadThis(),
            Instruction.externalCall("current"),
            Instruction.return()
        );

        this.methods.set(Enumerator.current, currentMethod);
    }

    current(){
        return this.items[this.currentIndex];
    }

    moveNext(){
        if (this.currentIndex >= this.items.length - 1){
            return Memory.allocateBoolean(false);
        }

        this.currentIndex++;

        return Memory.allocateBoolean(true);
    }
}