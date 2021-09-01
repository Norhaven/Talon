import { BooleanType } from "../../../library/BooleanType";
import { NumberType } from "../../../library/NumberType";
import { StringType } from "../../../library/StringType";
import { WorldObject } from "../../../library/WorldObject";
import { CompilationError } from "../../exceptions/CompilationError";
import { Keywords } from "../../lexing/Keywords";
import { TokenType } from "../../lexing/TokenType";
import { ConcatenationExpression } from "../expressions/ConcatenationExpression";
import { Expression } from "../expressions/Expression";
import { FieldDeclarationExpression } from "../expressions/FieldDeclarationExpression";
import { ParseContext } from "../ParseContext";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { Visitor } from "./Visitor";

export class OptionFieldDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        const field = new FieldDeclarationExpression();

        context.expect(Keywords.it);

        if (context.is(Keywords.is)){
            context.expect(Keywords.is);
            context.expect(Keywords.described);
            context.expect(Keywords.as);

            const description = context.expectString();

            field.name = WorldObject.description;
            field.typeName = StringType.typeName;
            field.initialValue = description.value;

            while (context.is(Keywords.and)){
                context.expect(Keywords.and);
                
                const expressionVisitor = new ExpressionVisitor();
                const expression = expressionVisitor.visit(context);

                const leftExpression = (field.associatedExpressions.length == 0) ? field : field.associatedExpressions[field.associatedExpressions.length - 1];

                const concat = new ConcatenationExpression();

                concat.left = leftExpression;
                concat.right = expression;

                field.associatedExpressions.push(concat);
            }
        } else if (context.is(Keywords.has)){

            context.expect(Keywords.has);
            context.expectAnyOf(Keywords.a, Keywords.an);
            
            const name = context.expectIdentifier();

            context.expect(Keywords.that);
            context.expect(Keywords.is);

            if (context.isTypeOf(TokenType.String)){
                field.typeName = StringType.typeName;
                field.initialValue = context.expectString().value;
            } else if (context.isTypeOf(TokenType.Number)){
                field.typeName = NumberType.typeName;
                field.initialValue = context.expectNumber().value;
            } else if (context.isTypeOf(TokenType.Boolean)){
                field.typeName = BooleanType.typeName;
                field.initialValue = context.expectBoolean().value;
            } else {
                throw new CompilationError(`Expected a string, number, or boolean but found '${context.currentToken.value}' of type '${context.currentToken.type}'`);
            }
                
            field.name = name.value;

        } else {
            throw new CompilationError("Unable to determine field");
        }
        
        context.expectTerminator();

        return field;
    }
}