import { Keywords } from "../../lexing/Keywords";
import { Token } from "../../lexing/Token";
import { Expression } from "../expressions/Expression";
import { WhenDeclarationExpression } from "../expressions/WhenDeclarationExpression";
import { ParseContext } from "../ParseContext";
import { EventExpressionVisitor } from "./EventExpressionVisitor";
import { Visitor } from "./Visitor";

export class MenuWhenDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.when);
        context.expect(Keywords.option);

        const option = context.expectIdentifier();

        context.expect(Keywords.is);
        
        const eventKind = context.expect(Keywords.selected);

        context.expectOpenMethodBlock();

        const actionsVisitor = new EventExpressionVisitor();
        const actions = actionsVisitor.visit(context);

        return new WhenDeclarationExpression(Keywords.player, eventKind.value, actions,  option.value);
    }
}