import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { IfExpressionVisitor } from "./IfExpressionVisitor";
import { CompilationError } from "../../exceptions/CompilationError";
import { ContainsExpression } from "../expressions/ContainsExpression";
import { SayExpression } from "../expressions/SayExpression";
import { TokenType } from "../../lexing/TokenType";
import { SetVariableExpression } from "../expressions/SetVariableExpression";
import { LiteralExpression } from "../expressions/LiteralExpression";
import { NumberType } from "../../../library/NumberType";
import { StringType } from "../../../library/StringType";
import { ListExpression } from "../expressions/ListExpression";
import { ComparisonExpressionVisitor } from "./ComparisonExpressionVisitor";
import { BooleanType } from "../../../library/BooleanType";
import { Convert } from "../../../library/Convert";
import { AbortEventExpression } from "../expressions/AbortEventExpression";
import { ReplaceExpressionVisitor } from "./ReplaceExpressionVisitor";
import { VisibilityExpression } from "../expressions/VisibilityExpression";
import { QuitExpression } from "../expressions/QuitExpression";
import { IncrementDecrementExpression } from "../expressions/IncrementDecrementExpression";
import { AcceptExpression } from "../expressions/AcceptExpression";
import { IdentifierExpression } from "../expressions/IdentifierExpression";
import { PlayerCompletionExpression } from "../expressions/PlayerCompletionExpression";
import { GameCompletionExpression } from "../expressions/GameCompletionExpression";
import { EventType } from "../../../common/EventType";
import { SetPlayerExpression } from "../expressions/SetPlayerExpression";
import { GiveExpression } from "../expressions/GiveExpression";
import { Player } from "../../../library/Player";
import { TypeCountExpression } from "../expressions/TypeCountExpression";

export class ExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        if (context.is(Keywords.if)){
            const visitor = new IfExpressionVisitor();
            return visitor.visit(context);
        } else if (context.is(Keywords.it)){ 

            if (context.isFollowedBy(Keywords.contains))
            {       
                context.expect(Keywords.it);
                context.expect(Keywords.contains);

                const count = context.expectNumber();
                const typeName = context.expectIdentifier();

                return new ContainsExpression("~it", Number(count.value), typeName.value);
            } else if (context.isFollowedBy(Keywords.accepts)){
                context.expect(Keywords.it);
                context.expect(Keywords.accepts);

                const items:IdentifierExpression[] = [];

                while(context.isTypeOf(TokenType.ListSeparator)){
                    context.consumeCurrentToken();
                    
                    const item = context.expectIdentifier();

                    items.push(new IdentifierExpression(undefined, item.value));
                }

                return new AcceptExpression(items);
            } else {
                const visitor = new ComparisonExpressionVisitor();
                return visitor.visit(context);
            }
        } else if (context.is(Keywords.set)){
            context.expect(Keywords.set);

            let variableName:string;

            if (context.isTypeOf(TokenType.Identifier)){
                variableName = context.expectIdentifier().value;
            } else if (context.is(Keywords.it)){
                context.expect(Keywords.it);
                variableName = "~it";
            } else if (context.is(Keywords.the)){
                context.expect(Keywords.the);
                context.expect(Keywords.player);
                context.expect(Keywords.to);

                const playerType = context.expectIdentifier();

                return new SetPlayerExpression(playerType.value);
            } else {
                // TODO: Support dereferencing arbitrary instances.
                throw new CompilationError("Currently unable to dereference a field, planned for a future release");
            }

            context.expect(Keywords.to);

            let isNegated = false;

            if (context.is(Keywords.not)){
                context.expect(Keywords.not);
                isNegated = true;
            }

            const visitor = new ExpressionVisitor();
            const value = visitor.visit(context);

            return new SetVariableExpression(undefined, variableName, value, isNegated);
        } else if (context.is(Keywords.say)){
            context.expect(Keywords.say);
            
            const text = context.expectString();

            return new SayExpression(text.value);
        } else if (context.isTypeOf(TokenType.String)){
            const value = context.expectString();

            return new LiteralExpression(StringType.typeName, value.value);
        } else if (context.isTypeOf(TokenType.Number)){
            const value = context.expectNumber();

            return new LiteralExpression(NumberType.typeName, Number(value.value));
        } else if (context.isTypeOf(TokenType.Boolean)){
            const value = context.expectBoolean();

            return new LiteralExpression(BooleanType.typeName, Convert.stringToBoolean(value.value));
        } else if (context.isTypeOf(TokenType.ListSeparator)){
            const items:Expression[] = [];

            while(context.isTypeOf(TokenType.ListSeparator)){
                context.consumeCurrentToken();
                const item = this.visit(context);
                items.push(item);
            }

            return new ListExpression(items);
        } else if (context.isFollowedBy(Keywords.is)){
            const visitor = new ComparisonExpressionVisitor();
            return visitor.visit(context);
        } else if (context.is(Keywords.abort)){
            context.expect(Keywords.abort);
            context.expect(Keywords.event);

            return new AbortEventExpression();
        } else if (context.is(Keywords.replace)){
            const visitor = new ReplaceExpressionVisitor();
            return visitor.visit(context);
        } else if (context.is(Keywords.show)){
            const action = context.consumeCurrentToken();
            const target = context.expectIdentifier();

            return new VisibilityExpression(action.value, target.value);
        } else if (context.is(Keywords.hide)){
            const action = context.consumeCurrentToken();
            context.expect(Keywords.this);

            return new VisibilityExpression(action.value);
        } else if (context.is(Keywords.quit)){
            context.consumeCurrentToken();

            return new QuitExpression();
        } else if (context.is(Keywords.the)){
            context.consumeCurrentToken();

            if (context.is(Keywords.player)){
                context.consumeCurrentToken();

                if (context.isAnyOf(Keywords.fails, Keywords.wins)){
                    const action = context.consumeCurrentToken();
                    const eventType = action.value == Keywords.fails ? EventType.PlayerFails : EventType.PlayerWins;

                    return new PlayerCompletionExpression(eventType);
                } else {
                    throw new CompilationError(`Unable to determine a valid action for the player with token '${context.consumeCurrentToken()}`);
                }
            } else if (context.is(Keywords.game)) {
                context.consumeCurrentToken();

                if (context.is(Keywords.completes)){
                    context.consumeCurrentToken();
                    return new GameCompletionExpression(EventType.GameIsCompleted);
                } else {
                    throw new CompilationError(`Unable to determine a valid action for the game with token '${context.consumeCurrentToken()}'`);
                }
            } else {
                throw new CompilationError(`Unable to determine an actor with token '${context.consumeCurrentToken()}'`);
            }
        } else if (context.is(Keywords.add)){
            context.consumeCurrentToken();

            const incrementValue = context.expectNumber();
            context.expect(Keywords.to);
            const variableName = context.expectIdentifier();

            return new IncrementDecrementExpression(Number(incrementValue.value), variableName.value);
        } else if (context.is(Keywords.subtract)){
            context.consumeCurrentToken();

            const subtractionValue = context.expectNumber();
            context.expect(Keywords.from);
            const variableName = context.expectIdentifier();

            return new IncrementDecrementExpression(-Number(subtractionValue.value), variableName.value);
        } else if (context.is(Keywords.give)){
            context.consumeCurrentToken();

            const count = context.expectNumber();
            const typeName = context.expectIdentifier();

            const items:TypeCountExpression[] = [new TypeCountExpression(Number(count.value), typeName.value)];

            while(context.isTypeOf(TokenType.ListSeparator)){
                context.consumeCurrentToken();

                const count = context.expectNumber();
                const typeName = context.expectIdentifier();

                const item = new TypeCountExpression(Number(count.value), typeName.value);

                items.push(item);
            }

            context.expect(Keywords.to);

            if (context.is(Keywords.the)){
                context.consumeCurrentToken();

                context.expect(Keywords.player);

                return new GiveExpression(Player.typeName, items);
            } else if (context.is(Keywords.it)){
                context.consumeCurrentToken();

                return new GiveExpression("~it", items);
            } else {
                const identifier = context.expectIdentifier();

                return new GiveExpression(identifier.value, items);
            }
        } else {
            throw new CompilationError(`Unable to parse expression at ${context.currentToken}`);
        }
    }
}