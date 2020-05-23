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

export class ExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        if (context.is(Keywords.if)){
            const visitor = new IfExpressionVisitor();
            return visitor.visit(context);
        } else if (context.is(Keywords.it)){
        
            context.expect(Keywords.it);
            context.expect(Keywords.contains);

            const count = context.expectNumber();
            const typeName = context.expectIdentifier();

            return new ContainsExpression("~it", Number(count.value), typeName.value);
        } else if (context.is(Keywords.set)){
            context.expect(Keywords.set);

            let variableName:string;

            if (context.isTypeOf(TokenType.String)){
                variableName = context.expectString().value;
            } else {
                // TODO: Support dereferencing arbitrary instances.
                throw new CompilationError("Currently unable to dereference a field, planned for a future release");
            }

            context.expect(Keywords.to);

            const visitor = new ExpressionVisitor();
            const value = visitor.visit(context);

            return new SetVariableExpression(undefined, variableName, value);
        } else if (context.is(Keywords.say)){
            context.expect(Keywords.say);
            
            const text = context.expectString();

            return new SayExpression(text.value);
        } else if (context.isTypeOf(TokenType.String)){
            const value = context.expectString();

            return new LiteralExpression(StringType.typeName, value.value);
        } else if (context.isTypeOf(TokenType.Number)){
            const value = context.expectNumber();

            return new LiteralExpression(NumberType.typeName, value.value);
        } else if (context.isTypeOf(TokenType.ListSeparator)){
            const items:Expression[] = [];

            while(context.isTypeOf(TokenType.ListSeparator)){
                context.consumeCurrentToken();
                const item = this.visit(context);
                items.push(item);
            }

            return new ListExpression(items);
        } else {
            throw new CompilationError("Unable to parse expression");
        }
    }

}