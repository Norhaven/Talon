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

        let actor:Token|undefined = undefined;
        let eventKind:Token[];
        let target:Token[]|undefined = undefined;

        if (context.is(Keywords.it)){
            context.expect(Keywords.it);
            context.expect(Keywords.is);

            if (context.isAnyOf(Keywords.used, Keywords.combined)){
                eventKind = context.expectOneOrMoreKeywords(Keywords.used, Keywords.combined);

                if (context.is(Keywords.with)){
                    context.expect(Keywords.with);
                    context.expectAnyOf(Keywords.a, Keywords.an);

                    target = context.expectOneOrMoreIdentifiers();
                }
            } else if (context.is(Keywords.given)){
                eventKind = [context.expect(Keywords.given)];

                if (context.isAnyOf(Keywords.a, Keywords.an)){
                    context.expectAnyOf(Keywords.a, Keywords.an);

                    target = context.expectOneOrMoreIdentifiers();
                }
            } else {
                eventKind = [context.expectAnyOf(
                    Keywords.taken,
                    Keywords.dropped, 
                    Keywords.opened, 
                    Keywords.closed, 
                    Keywords.described, 
                    Keywords.observed
                )];
            }
        } else if (context.is(Keywords.the)){
            context.expect(Keywords.the);

            if (context.is(Keywords.player)){               
                actor = context.expect(Keywords.player);

                if (context.is(Keywords.presses)){
                    eventKind = [context.expect(Keywords.presses)];
                    target = [context.expectString()];
                } else if (context.is(Keywords.is)){
                    context.expect(Keywords.is);

                    if (context.is(Keywords.set)){
                        eventKind = [context.expect(Keywords.set)];
                    } else {
                        throw new CompilationError(`Unable to identify the kind of player-focused event for context '${context.currentToken}'`);
                    }
                } else {
                    eventKind = [context.expectAnyOf(Keywords.enters, Keywords.exits, Keywords.starts, Keywords.fails, Keywords.wins)];
                }
            } else {
                actor = context.expect(Keywords.game);
                eventKind = [context.expectAnyOf(Keywords.starts, Keywords.ends, Keywords.completes)];
            }
        } else {
            throw new CompilationError(`Unable to determine the kind of event for context '${context.currentToken}'`);
        }

        context.expectOpenMethodBlock();

        const actionsVisitor = new EventExpressionVisitor();
        const actions = actionsVisitor.visit(context);

        return new WhenDeclarationExpression(actor?.value || Keywords.player, eventKind.map(x => x.value), actions,  target?.map(x => x.value));
    }
}