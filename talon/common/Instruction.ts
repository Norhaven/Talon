import { Delegate } from "../library/Delegate";
import { Enumerator } from "../library/Enumerator";
import { List } from "../library/List";
import { EventType } from "./EventType";
import { OpCode } from "./OpCode";

export class Instruction{
    private static generatedForeachLocals = 0;
    private static generatedEnumerationLocals = 0;

    static assign(){
        return new Instruction(OpCode.Assign);
    }

    static compareEqual(){
        return new Instruction(OpCode.CompareEqual);
    }

    static invokeDelegate(){
        return new Instruction(OpCode.InvokeDelegate);
    }

    static isTypeOf(typeName:string){
        return new Instruction(OpCode.TypeOf, typeName);
    }

    static loadNumber(value:number){
        return new Instruction(OpCode.LoadNumber, value);
    }

    static loadBoolean(value:boolean){
        return new Instruction(OpCode.LoadBoolean, value);
    }

    static loadString(value:string){
        return new Instruction(OpCode.LoadString, value);
    }

    static loadInstance(typeName:string){
        return new Instruction(OpCode.LoadInstance, typeName);
    }

    static loadField(fieldName:string){
        return new Instruction(OpCode.LoadField, fieldName);
    }

    static loadProperty(fieldName:string){
        return new Instruction(OpCode.LoadProperty, fieldName);
    }

    static loadLocal(localName:string){
        return new Instruction(OpCode.LoadLocal, localName);
    }

    static loadThis(){
        return new Instruction(OpCode.LoadThis);
    }

    static loadPlace(typeName?:string){
        return new Instruction(OpCode.LoadPlace, typeName);
    }

    static instanceCall(methodName:string){
        return new Instruction(OpCode.InstanceCall, methodName);
    }

    static concatenate(){
        return new Instruction(OpCode.Concatenate);
    }

    static staticCall(typeName:string, methodName:string){
        return new Instruction(OpCode.StaticCall, `${typeName}.${methodName}`);
    }

    static externalCall(methodName:string){
        return new Instruction(OpCode.ExternalCall, methodName);
    }

    static print(){
        return new Instruction(OpCode.Print);
    }

    static return(){
        return new Instruction(OpCode.Return);
    }

    static readInput(){
        return new Instruction(OpCode.ReadInput);
    }

    static parseCommand(){
        return new Instruction(OpCode.ParseCommand);
    }

    static handleCommand(){
        return new Instruction(OpCode.HandleCommand);
    }

    static handleMenuCommand(){
        return new Instruction(OpCode.HandleMenuCommand);
    }

    static goTo(lineNumber:number){
        return new Instruction(OpCode.GoTo, lineNumber);
    }

    static branchRelative(count:number){
        return new Instruction(OpCode.BranchRelative, count);
    }

    static branchRelativeIfFalse(count:number){
        return new Instruction(OpCode.BranchRelativeIfFalse, count);
    }

    static compareLessThan(){
        return new Instruction(OpCode.CompareLessThan);
    }

    static compareGreaterThan(){
        return new Instruction(OpCode.CompareGreaterThan);
    }

    static add(){
        return new Instruction(OpCode.Add);
    }

    static loadElement(){
        return new Instruction(OpCode.LoadElement);
    }

    static setLocal(name:string){
        return new Instruction(OpCode.SetLocal, name);
    }

    static createDelegate(methodName:string){
        return new Instruction(OpCode.CreateDelegate, methodName);
    }

    static loadEmpty(){
        return new Instruction(OpCode.LoadEmpty);
    }

    static newInstance(typeName:string){
        return new Instruction(OpCode.NewInstance, typeName);
    }

    static invokeDelegateOnInstance(){
        return new Instruction(OpCode.InvokeDelegateOnInstance);
    }

    static includeState(){
        return new Instruction(OpCode.IncludeState);
    }

    static removeState(){
        return new Instruction(OpCode.RemoveState);
    }

    static baseTypeInstanceCall(){
        return new Instruction(OpCode.BaseTypeInstanceCall);
    }

    static replaceInstancesWith(typeName:string){
        return new Instruction(OpCode.ReplaceInstances, typeName);
    }

    static ignore(){
        return new Instruction(OpCode.Ignore);
    }

    static loadStaticField(typeName:string, fieldName:string){
        return new Instruction(OpCode.LoadStaticField, `${typeName}.${fieldName}`);
    }

    static assignStaticField(typeName:string, fieldName:string){
        return new Instruction(OpCode.AssignStaticField, `${typeName}.${fieldName}`);
    }

    static raiseEvent(eventType:EventType){
        return new Instruction(OpCode.RaiseEvent, eventType);
    }

    static raiseContextualEvent(eventType:EventType){
        return new Instruction(OpCode.RaiseContextualEvent, eventType);
    }

    static ifTrueThen(...instructions:Instruction[]){
        const result:Instruction[] = [];

        result.push(
            Instruction.branchRelativeIfFalse(instructions.length),
            ...instructions
        );

        return result;
    }

    static forEach(...instructions:Instruction[]){
        const result:Instruction[] = [];
        const enumeratorLocal = `~enumerator.${this.generatedForeachLocals}`;

        this.generatedForeachLocals++;

        result.push(
            Instruction.instanceCall(List.getEnumerator),
            Instruction.setLocal(enumeratorLocal),
            ...Instruction.enumerate(enumeratorLocal, ...instructions)
        );

        return result;
    }

    static enumerate(enumeratorLocal:string, ...instructions:Instruction[]){
        const result:Instruction[] = [];
        const valueLocal = `~enumerated.value.${this.generatedEnumerationLocals}`;

        this.generatedEnumerationLocals++;

        result.push(
            Instruction.loadLocal(enumeratorLocal),
            Instruction.instanceCall(Enumerator.moveNext),
            ...Instruction.ifTrueThen(
                Instruction.loadLocal(enumeratorLocal),
                Instruction.instanceCall(Enumerator.current),
                ...instructions,
                Instruction.branchRelative(-(instructions.length + 6))
            )
        );

        return result;
    }

    static containsTextValue(value:string, propertyName:string){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadString(value),
            Instruction.loadThis(),
            Instruction.loadProperty(propertyName),
            Instruction.instanceCall(List.contains)
        );

        return result;
    }

    static joinList(separator:string, ...instructions:Instruction[]){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadString(separator),
            ...instructions,            
            Instruction.instanceCall(List.join)
        );

        return result;
    }

    static mapList(mappedFunctionName:string, listPropertyName:string){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadThis(),
            Instruction.createDelegate(mappedFunctionName),

            Instruction.loadThis(),
            Instruction.loadProperty(listPropertyName),
            Instruction.instanceCall(List.map)
        );

        return result;
    }

    static includeStateInThis(state:string){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadThis(),
            Instruction.loadString(state),
            Instruction.includeState(),
        );

        return result;
    }

    static removeStateFromThis(state:string){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadThis(),
            Instruction.loadString(state),
            Instruction.removeState(),
        );

        return result;
    }

    static raiseAllEvents(){
        const result:Instruction[] = [];

        const availableEventsLocal = "~availableEvents";
        const eventsRaisedLocal = "~eventsRaised";
        
        result.push(    
            Instruction.loadBoolean(false),
            Instruction.setLocal(eventsRaisedLocal),       
            Instruction.setLocal(availableEventsLocal),
            Instruction.loadLocal(availableEventsLocal),
            Instruction.isTypeOf(Delegate.typeName),
            ...Instruction.ifTrueThen(    
                Instruction.loadLocal(availableEventsLocal),
                Instruction.invokeDelegate(),
                Instruction.loadBoolean(true),
                Instruction.setLocal(eventsRaisedLocal)
            ),
            Instruction.loadLocal(availableEventsLocal),
            Instruction.isTypeOf(List.typeName),
            ...Instruction.ifTrueThen(
                Instruction.loadNumber(0),
                Instruction.loadLocal(availableEventsLocal),
                Instruction.instanceCall(List.count),
                Instruction.compareGreaterThan(),
                ...Instruction.ifTrueThen(                      
                    Instruction.loadLocal(availableEventsLocal),
                    ...Instruction.forEach(
                        Instruction.invokeDelegate(),
                        Instruction.ignore() // All delegates will be events, which return a boolean indicating aborted status, not used at this point.
                    ),
                    Instruction.loadBoolean(true),
                    Instruction.setLocal(eventsRaisedLocal)
                )
            ),
            Instruction.loadLocal(eventsRaisedLocal)
        );

        return result;
    }

    opCode:OpCode = OpCode.NoOp;
    value?:Object;

    constructor(opCode:OpCode, value?:Object){
        this.opCode = opCode;
        this.value = value;
    }
}