import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { WhenDeclarationExpression } from "../expressions/WhenDeclarationExpression";
import { Punctuation } from "../../lexing/Punctuation";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { EventExpressionVisitor } from "./EventExpressionVisitor";
import { CompilationError } from "../../exceptions/CompilationError";
import { Token } from "../../lexing/Token";

export class WhenDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.when);

        let eventKind:Token;
        let target:Token|undefined = undefined;

        if (context.is(Keywords.it)){
            context.expect(Keywords.it);
            context.expect(Keywords.is);

            if (context.isAnyOf(Keywords.used, Keywords.combined)){
                eventKind = context.expectAnyOf(Keywords.used, Keywords.combined);

                if (context.is(Keywords.with)){
                    context.expect(Keywords.with);
                    context.expectAnyOf(Keywords.a, Keywords.an);

                    target = context.expectIdentifier();
                }
            } else {
                eventKind = context.expectAnyOf(
                    Keywords.taken, 
                    Keywords.dropped, 
                    Keywords.opened, 
                    Keywords.closed, 
                    Keywords.dropped, 
                    Keywords.described, 
                    Keywords.observed
                );
            }
        } else {            
            context.expect(Keywords.the);
            context.expect(Keywords.player);
            eventKind = context.expectAnyOf(Keywords.enters, Keywords.exits);
        }

        context.expectOpenMethodBlock();

        const actionsVisitor = new EventExpressionVisitor();
        const actions = actionsVisitor.visit(context);

        return new WhenDeclarationExpression(Keywords.player, eventKind.value, actions,  target?.value);
    }

}