import { Keywords } from "../../lexing/Keywords";
import { Token } from "../../lexing/Token";
import { ComparisonExpression } from "../expressions/ComparisonExpression";
import { Expression } from "../expressions/Expression";
import { IdentifierExpression } from "../expressions/IdentifierExpression";
import { ParseContext } from "../ParseContext";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { Visitor } from "./Visitor";

export class ComparisonExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        const identifier = this.parseIdentifier(context);
        const identifierExpression = new IdentifierExpression(undefined, identifier.value);

        context.expect(Keywords.is);

        var visitor = new ExpressionVisitor();
        var comparedTo = visitor.visit(context);

        return new ComparisonExpression(identifierExpression, comparedTo);
    }

    private parseIdentifier(context:ParseContext){
        if (context.is(Keywords.it)){
            context.expect(Keywords.it);
            const token = Token.forString("~it");

            return token;
        }

        return context.expectIdentifier();
    }
}