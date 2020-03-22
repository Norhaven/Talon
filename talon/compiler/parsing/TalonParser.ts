import { Token } from "../lexing/Token";
import { Expression } from "./expressions/Expression";
import { ProgramVisitor } from "./visitors/ProgramVisitor";
import { ParseContext } from "./ParseContext";
import { IOutput } from "../../runtime/IOutput";

export class TalonParser{
    constructor(private readonly out:IOutput){

    }
    
    parse(tokens:Token[]):Expression{
        const context = new ParseContext(tokens, this.out);
        const visitor = new ProgramVisitor();

        return visitor.visit(context);
    }
}