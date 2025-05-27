import { ExpressionVisitor } from "./ExpressionVisitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Punctuation } from "../../lexing/Punctuation";
import { Keywords } from "../../lexing/Keywords";
import { ActionsExpression } from "../expressions/ActionsExpression";

export class EventExpressionVisitor extends ExpressionVisitor{
    constructor(typeName?:string){
        super(typeName);
    }

    visit(context:ParseContext):Expression{
        
        const actions:Expression[] = [];

        while(!context.is(Keywords.and)){
            const action = super.visit(context);
            actions.push(action);

            context.expectSemiTerminator();
        }

        context.expect(Keywords.and);
        context.expect(Keywords.then);
        context.expect(Keywords.stop);
        context.expectTerminator();

        return new ActionsExpression(actions);
    }
}