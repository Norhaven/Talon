import { OpCode } from "./OpCode";

export class Instruction{
    static loadNumber(value:number){
        return new Instruction(OpCode.LoadNumber, value);
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

    static goTo(lineNumber:number){
        return new Instruction(OpCode.GoTo, lineNumber);
    }

    static branchRelative(count:number){
        return new Instruction(OpCode.BranchRelative, count);
    }

    static branchRelativeIfFalse(count:number){
        return new Instruction(OpCode.BranchRelativeIfFalse, count);
    }

    opCode:OpCode = OpCode.NoOp;
    value?:Object;

    constructor(opCode:OpCode, value?:Object){
        this.opCode = opCode;
        this.value = value;
    }
}