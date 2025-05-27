import { OpCode } from "../../common/OpCode";
import { List } from "../../library/List";
import { Memory } from "../common/Memory";
import { RuntimeError } from "../errors/RuntimeError";
import { RuntimeAny } from "../library/RuntimeAny";
import { RuntimeBoolean } from "../library/RuntimeBoolean";
import { RuntimeDelegate } from "../library/RuntimeDelegate";
import { RuntimeInteger } from "../library/RuntimeInteger";
import { RuntimeList } from "../library/RuntimeList";
import { RuntimeString } from "../library/RuntimeString";
import { OpCodeHandler } from "../OpCodeHandler";
import { Thread } from "../Thread";
import { InstanceCallHandler } from "./InstanceCallHandler";

export class ComparisonHandler extends OpCodeHandler{
    public readonly code: OpCode = OpCode.CompareEqual;

    handle(thread:Thread){

        const isNegated = <boolean>thread.currentInstruction?.value;

        const comparand = thread.currentMethod.pop();
        const instance = thread.currentMethod.pop();

        this.logInteraction(thread, instance, comparand);

        if (!comparand || !instance){
            throw new RuntimeError('Unable to compare for equality without both a comparand and an instance');
        }

        if (instance.isList() && comparand.isString()){
            thread.logReadable(`Checking list for '${(<RuntimeString>comparand).value}'`);

            const result = (<RuntimeList>instance).containsValue(<RuntimeString>comparand);

            if (isNegated){
                result.value = !result.value;
            }
            
            thread.currentMethod.push(result);
        } else {        
            if (!instance.isSameTypeAs(comparand)){
                thread.logReadable(`Attempted to compare instance '${instance.typeName}' with different type '${comparand.typeName}', will never be successful`);
            }

            let evaluationResult:RuntimeBoolean;

            if (instance.isString() && comparand.isString()){
                evaluationResult = this.evaluateWith(instance, comparand, isNegated);
            } else if (instance.isInteger() && comparand.isInteger()){
                evaluationResult = this.evaluateWith(instance, comparand, isNegated);
            } else if (instance.isBoolean() && comparand.isBoolean()){
                evaluationResult = this.evaluateWith(instance, comparand, isNegated);
            } else {
                const result = this.compareWith(instance, comparand, isNegated);
                evaluationResult = Memory.allocateBoolean(result);
            }

            thread.currentMethod.push(evaluationResult);
        }

        return super.handle(thread);
    }

    private evaluateWith<T extends { value:string|number|boolean }>(left:T, right:T, isNegated:boolean){
        const result = this.compareWith(left.value, right.value, isNegated);

        return Memory.allocateBoolean(result);        
    }

    private compareWith<T>(left:T, right:T, isNegated:boolean){
        if (isNegated){
            return left !== right;
        }

        return left === right;
    }
}