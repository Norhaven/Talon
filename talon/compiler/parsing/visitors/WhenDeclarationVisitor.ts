import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { WhenDeclarationExpression } from "../expressions/WhenDeclarationExpression";
import { Punctuation } from "../../lexing/Punctuation";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { EventExpressionVisitor } from "./EventExpressionVisitor";

export class WhenDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.when);
        context.expect(Keywords.the);
        context.expect(Keywords.player);

        const eventKind = context.expectAnyOf(Keywords.enters, Keywords.exits);

        context.expectOpenMethodBlock();

        const actionsVisitor = new EventExpressionVisitor();
        const actions = actionsVisitor.visit(context);

        return new WhenDeclarationExpression(Keywords.player, eventKind.value, actions);
    }

}