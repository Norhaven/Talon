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
import { LocationConditionExpression } from "../expressions/LocationConditionExpression";
import { TokenType } from "../../lexing/TokenType";
import { ComparisonType } from "../../../common/ComparisonType";

export class WhenDeclarationVisitor extends Visitor{
    constructor(private readonly typeName?:string){
        super();
    }

    visit(context: ParseContext): Expression {
        context.expect(Keywords.when);

        let actor:Token|undefined = undefined;
        let eventKind:Token[];
        let target:Token[]|undefined = undefined;
        let locationCondition:LocationConditionExpression|undefined = undefined;
        let comparisonKind = ComparisonType.None;

        if (context.is(Keywords.it)){
            context.expect(Keywords.it);

            if (context.is(Keywords.holds)){
                eventKind = [context.expect(Keywords.holds)];

                if (context.isAnyOf(Keywords.a, Keywords.an)){
                    context.consumeCurrentToken();
                }

                target = [context.expectIdentifier()];
            } else {
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

                        if (context.is(Keywords.in)){
                            context.consumeCurrentToken();
                            context.expect(Keywords.the);
                            
                            const locationNames = context.expectOneOrMoreIdentifiers();

                            locationCondition = new LocationConditionExpression(locationNames.map(x => x.value));
                        }
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
            }
        } else if (context.consumeIf(Keywords.its)){
            actor = context.expectIdentifier();

            context.expect(Keywords.is);

            eventKind = [context.expect(Keywords.set)];

            context.expect(Keywords.to);

            if (context.isTypeOf(TokenType.Identifier)){
                target = [context.expectIdentifier()];
            } else if (context.isTypeOf(TokenType.String)){
                target = [context.expectString()];
            } else if (context.isTypeOf(TokenType.Number)){
                comparisonKind = ComparisonType.EqualTo;
                target = [context.expectNumber()];
            } else if (context.consumeIf(Keywords.less)){
                context.expect(Keywords.than);
                comparisonKind = ComparisonType.LessThan;
                target = [context.expectNumber()];
            } else if (context.consumeIf(Keywords.greater)){
                context.expect(Keywords.than);
                comparisonKind = ComparisonType.GreaterThan;
                target = [context.expectNumber()];
            } else {
                throw new CompilationError(`Unable to determine how '${actor.value}' should be compared using '${context.currentToken}'`);
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
                } else if (context.is(Keywords.goes)) {
                    eventKind = [context.expect(Keywords.goes)];
                    target = [context.expectString()];
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

        const actionsVisitor = new EventExpressionVisitor(this.typeName);
        const actions = actionsVisitor.visit(context);

        return new WhenDeclarationExpression(actor?.value || Keywords.player, eventKind.map(x => x.value), actions,  target?.map(x => x.value), locationCondition, undefined, comparisonKind);
    }
}