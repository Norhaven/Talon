import { Token } from "../lexing/Token";
import { Expression } from "./expressions/Expression";
import { ProgramVisitor } from "./visitors/ProgramVisitor";
import { ParseContext } from "./ParseContext";

export class TalonParser{
    parse(tokens:Token[]):Expression{
        const context = new ParseContext(tokens);
        const visitor = new ProgramVisitor();

        return visitor.visit(context);
    }
}