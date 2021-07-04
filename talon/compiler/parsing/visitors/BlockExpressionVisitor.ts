import { Keywords } from "../../lexing/Keywords";
import { ActionsExpression } from "../expressions/ActionsExpression";
import { Expression } from "../expressions/Expression";
import { ParseContext } from "../ParseContext";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { Visitor } from "./Visitor";

export class BlockExpressionVisitor extends Visitor{
    visit(context:ParseContext):Expression{

        const actions:Expression[] = [];
        const expressionVisitor = new ExpressionVisitor();

        while(!context.is(Keywords.and) && !context.is(Keywords.or)){
            const action = expressionVisitor.visit(context);
            actions.push(action);

            context.expectSemiTerminator();
        }

        return new ActionsExpression(actions);
    }
}