import { Player } from "../../../library/Player";
import { CompilationError } from "../../exceptions/CompilationError";
import { Keywords } from "../../lexing/Keywords";
import { TokenType } from "../../lexing/TokenType";
import { Expression } from "../expressions/Expression";
import { IdentifierExpression } from "../expressions/IdentifierExpression";
import { SetPlayerExpression } from "../expressions/SetPlayerExpression";
import { SetVariableExpression } from "../expressions/SetVariableExpression";
import { ParseContext } from "../ParseContext";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { Visitor } from "./Visitor";

export class SetExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {

        if (context.is(Keywords.the) && context.isFollowedBy(Keywords.player)){
            context.consumeCurrentToken();
            context.consumeCurrentToken();

            context.expect(Keywords.to);

            const playerType = context.expectIdentifier();

            return new SetPlayerExpression(playerType.value);
        }

        const variableIdentifier = this.parseAsIdentifier(context);

        context.expect(Keywords.to);

        let isNegated = false;

        if (context.consumeIf(Keywords.not)){
            isNegated = true;
        }

        if (context.isTypeOf(TokenType.Identifier)){
            const valueIdentifier = this.parseAsIdentifier(context);

            return new SetVariableExpression(variableIdentifier, valueIdentifier, isNegated);
        } else {
            const visitor = new ExpressionVisitor();
            const value = visitor.visit(context);

            return new SetVariableExpression(variableIdentifier, value, isNegated);
        }
    }

    private parseAsIdentifier(context:ParseContext){
        if (context.isTypeOf(TokenType.Identifier)){
            return new IdentifierExpression("~it", context.expectIdentifier().value);
        } else if (context.consumeIf(Keywords.it)){
            return new IdentifierExpression(undefined, "~it");
        } else if (context.consumeIf(Keywords.the)){
            if (context.consumeIf(Keywords.players)){
                return new IdentifierExpression(Player.typeName, context.expectIdentifier().value);
            } 

            return new IdentifierExpression(context.expectIdentifier().value, context.expectIdentifier().value);            
        } else {
            // TODO: Support dereferencing arbitrary instances.
            throw new CompilationError("Currently unable to dereference a field, planned for a future release");
        }
    }
}