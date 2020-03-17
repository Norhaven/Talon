import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { SayExpression } from "../expressions/SayExpression";

export class SayExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.say);

        const text = context.expectString();

        return new SayExpression(text.value);
    }
}