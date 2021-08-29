import { CompilationError } from "../../exceptions/CompilationError";
import { Keywords } from "../../lexing/Keywords";
import { TokenType } from "../../lexing/TokenType";
import { Expression } from "../expressions/Expression";
import { IdentifierExpression } from "../expressions/IdentifierExpression";
import { ReplaceExpression } from "../expressions/ReplaceExpression";
import { ParseContext } from "../ParseContext";
import { Visitor } from "./Visitor";

export class ReplaceExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {

        context.expect(Keywords.replace);

        if (!(context.is(Keywords.it) || context.isTypeOf(TokenType.Identifier))){
            throw new CompilationError(`Expected either 'it' or an identifier but found '${context.currentToken}`);
        }

        const replacedEntities:IdentifierExpression[] = [];

        replacedEntities.push(this.parseEntity(context));

        while(context.isTypeOf(TokenType.ListSeparator)){
            context.consumeCurrentToken();
            const item = this.parseEntity(context);
            replacedEntities.push(item);
        }

        context.expect(Keywords.with);

        const entity = this.parseEntity(context);

        return new ReplaceExpression(entity, replacedEntities);
    }

    private parseEntity(context:ParseContext){
        
        if (context.is(Keywords.it)){
            context.expect(Keywords.it);
            return new IdentifierExpression(undefined, "~it");
        } else {
            const identifier = context.expectIdentifier();
            return new IdentifierExpression(undefined, identifier.value);
        }
    }
}