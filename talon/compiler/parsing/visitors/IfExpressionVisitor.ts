import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { IfExpression } from "../expressions/IfExpression";

export class IfExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.if);

        const expressionVisitor = new ExpressionVisitor();
        const conditional = expressionVisitor.visit(context);

        context.expect(Keywords.then);

        const ifBlock = expressionVisitor.visit(context);

        if (context.is(Keywords.else)){
            context.expect(Keywords.else);

            const elseBlock = expressionVisitor.visit(context);
            
            return new IfExpression(conditional, ifBlock, elseBlock);
        }

        return new IfExpression(conditional, ifBlock, new Expression());
    }
}