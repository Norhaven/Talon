import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { IfExpressionVisitor } from "./IfExpressionVisitor";
import { CompilationError } from "../../exceptions/CompilationError";
import { ContainsExpression } from "../expressions/ContainsExpression";
import { SayExpression } from "../expressions/SayExpression";

export class ExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        if (context.is(Keywords.if)){
            const visitor = new IfExpressionVisitor();
            return visitor.visit(context);
        } else if (context.is(Keywords.it)){
            context.expect(Keywords.it);
            context.expect(Keywords.contains);

            const count = context.expectNumber();
            const typeName = context.expectIdentifier();

            return new ContainsExpression("<>it", Number(count.value), typeName.value);
        } else if (context.is(Keywords.say)){
            context.expect(Keywords.say);
            
            const text = context.expectString();

            return new SayExpression(text.value);
        } else {
            throw new CompilationError("Unable to parse expression");
        }
    }

}