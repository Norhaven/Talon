import { Delegate } from "../library/Delegate";
import { Enumerator } from "../library/Enumerator";
import { GlobalFields } from "../library/GlobalFields";
import { List } from "../library/List";
import { WorldObject } from "../library/WorldObject";
import { EventType } from "./EventType";
import { OpCode } from "./OpCode";

export class Instruction{
    private static generatedForeachLocals = 0;
    private static generatedEnumerationLocals = 0;
    private static generatedLabels = 0;

    static assign(){
        return new Instruction(OpCode.Assign);
    }

    static compareEqual(isNegated:boolean = false){
        return new Instruction(OpCode.CompareEqual, isNegated);
    }

    static invokeDelegate(){
        return new Instruction(OpCode.InvokeDelegate);
    }

    static isTypeOf(typeName?:string){
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

    static loadInstance(typeName?:string){
        return new Instruction(OpCode.LoadInstance, typeName);
    }

    static loadField(fieldName:string){
        return new Instruction(OpCode.LoadField, fieldName);
    }

    static loadFieldReference(fieldName:string){
        return new Instruction(OpCode.LoadFieldReference, fieldName);
    }

    static loadProperty(fieldName:string){
        return new Instruction(OpCode.LoadProperty, fieldName);
    }

    static loadLocal(localName:string){
        return new Instruction(OpCode.LoadLocal, localName);
    }

    static localExists(localName:string){
        return new Instruction(OpCode.LocalExists, localName);
    }

    static loadThis(){
        return new Instruction(OpCode.LoadThis);
    }

    static loadPlace(typeName?:string){
        return new Instruction(OpCode.LoadPlace, typeName);
    }

    static loadPlayer(typeName?:string){
        return new Instruction(OpCode.LoadPlayer, typeName);
    }

    static loadCurrentContainer(instanceInstruction:Instruction){
        const instructions:Instruction[] = [];

        instructions.push(
            instanceInstruction,
            Instruction.loadField(WorldObject.currentContainer),
            Instruction.loadInstance(),
        );

        return instructions;
    }

    static instanceCall(methodName:string){
        return new Instruction(OpCode.InstanceCall, methodName);
    }

    static concatenate(){
        return new Instruction(OpCode.Concatenate);
    }

    static staticCall(typeName:string, methodName:string, hasContextParameter:boolean){
        return new Instruction(OpCode.StaticCall, `${typeName}.${methodName}.${hasContextParameter}`);
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
    
    static goToLabel(label:string){
        return new Instruction(OpCode.GoToLabel, label);
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

    static noOp(){
        return new Instruction(OpCode.NoOp);
    }

    static setPlayer(playerTypeName:string){
        return new Instruction(OpCode.SetPlayer, playerTypeName);
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

    static raiseContextualDirectionEvent(eventType:EventType){
        return new Instruction(OpCode.RaiseContextualDirectionEvent, eventType);
    }

    static move(){
        return new Instruction(OpCode.Move);
    }

    static interpolateString(){
        return new Instruction(OpCode.InterpolateString);
    }

    static give(){
        return new Instruction(OpCode.Give);
    }

    static markAsLabel(label:string){
        return new Instruction(OpCode.NoOp, undefined, label);
    }

    static getTypeName(){
        return new Instruction(OpCode.GetTypeName);
    }

    static assignToFieldReference(fieldName:string){
        const result:Instruction[] = [];

        // This includes a potential abort if assigning to the field reference came 
        // back with a failure.The reason that might happen is that assigning to the
        // field may inadvertently trigger a value change event on the instance it's 
        // assigning to and that might fail (or end the game entirely), so we want to 
        // handle that case appropriately. We don't need to care about unbalancing the
        // stack with this because it works out to the same logic as an abort expression
        // as long as we're not front-loading the stack with things intended to resolve
        // themselves afterwards. It's a bit of a risk, but ideally due diligence handles 
        // that during the IL generation.

        result.push(
            Instruction.loadFieldReference(fieldName),
            Instruction.assign(),
            ...Instruction.raiseAllEvents(false),
            ...Instruction.ifFalseThen(
                Instruction.loadBoolean(false),
                Instruction.return()
            )
        );

        return result;
    }

    static ifTrueThen(...instructions:Instruction[]){
        const result:Instruction[] = [];

        result.push(
            Instruction.branchRelativeIfFalse(instructions.length),
            ...instructions
        );

        return result;
    }

    static ifFalseThen(...instructions:Instruction[]){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadBoolean(false),
            Instruction.compareEqual(),
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

    static while(loadConditionValue:Instruction, ...instructions:Instruction[]){
        const result:Instruction[] = [];

        result.push(
            loadConditionValue,
            Instruction.branchRelativeIfFalse(instructions.length + 1),
            ...instructions,
            Instruction.branchRelative(-(instructions.length + 3))
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

    static groupList(contentsLocalName:string){
        const result:Instruction[] = [];

        result.push(
            Instruction.loadLocal(contentsLocalName),
            Instruction.instanceCall(List.group),
            Instruction.setLocal(contentsLocalName)
        );

        return result;
    }

    static mapList(mappedFunctionName:string, contentsLocalName:string, resultsLocalName:string){
        const result:Instruction[] = [];

        result.push(
            Instruction.newInstance(List.typeName),
            Instruction.setLocal(resultsLocalName),
            Instruction.loadLocal(contentsLocalName),
            ...Instruction.forEach(
                Instruction.instanceCall(mappedFunctionName),
                Instruction.loadLocal(resultsLocalName),
                Instruction.instanceCall(List.add),
                Instruction.ignore()
            )
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

    static raiseAllEvents(ignoreResults:boolean = true){
        const result:Instruction[] = [];

        const availableEventsLocal = "~availableEvents";
        const eventsRaisedLocal = "~eventsRaised";
        const endLabel = `~endLabel.${this.generatedLabels}`;

        this.generatedLabels++;
        
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
                ...Instruction.ifFalseThen(      
                    Instruction.loadBoolean(true),
                    Instruction.setLocal(eventsRaisedLocal),
                    Instruction.goToLabel(endLabel)
                ),     
                
                // We have at least one event to invoke so we'll assume that everything will succeed
                // and then fail and early out if any of those don't meet that expectation.
                
                Instruction.loadBoolean(true),
                Instruction.setLocal(eventsRaisedLocal),

                Instruction.loadLocal(availableEventsLocal),
                ...Instruction.forEach(                    
                    Instruction.invokeDelegate(),
                    ...Instruction.ifFalseThen(
                        Instruction.loadBoolean(false),
                        Instruction.setLocal(eventsRaisedLocal),
                        Instruction.goToLabel(endLabel)
                    ),
                    Instruction.loadStaticField("~globalProgramFields", GlobalFields.canRun),
                    ...Instruction.ifFalseThen(
                        Instruction.loadBoolean(false),
                        Instruction.setLocal(eventsRaisedLocal),
                        Instruction.goToLabel(endLabel)
                    )
                )
            ),
            Instruction.markAsLabel(endLabel),
            Instruction.loadLocal(eventsRaisedLocal),
            ignoreResults ? Instruction.ignore() : Instruction.noOp()
        );

        return result;
    }

    opCode:OpCode = OpCode.NoOp;
    value?:Object;
    label?:string;

    constructor(opCode:OpCode, value?:Object, label?:string){
        this.opCode = opCode;
        this.value = value;
        this.label = label;
    }
}