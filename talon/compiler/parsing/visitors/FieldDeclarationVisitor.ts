import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { FieldDeclarationExpression } from "../expressions/FieldDeclarationExpression";
import { Place } from "../../../library/Place";
import { BooleanType } from "../../../library/BooleanType";
import { CompilationError } from "../../exceptions/CompilationError";
import { WorldObject } from "../../../library/WorldObject";
import { StringType } from "../../../library/StringType";
import { List } from "../../../library/List";
import { AndExpression } from "../expressions/AndExpression";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { ConcatenationExpression } from "../expressions/ConcatenationExpression";
import { TokenType } from "../../lexing/TokenType";
import { NumberType } from "../../../library/NumberType";

export class FieldDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {

        const field = new FieldDeclarationExpression();

        context.expect(Keywords.it);

        if (context.is(Keywords.is)){
            context.expect(Keywords.is);

            if (context.isAnyOf(Keywords.not, Keywords.visible)){
                let isVisible = true;

                if (context.is(Keywords.not)){
                    context.expect(Keywords.not);
                    isVisible = false;
                }

                context.expect(Keywords.visible);

                field.name = WorldObject.visible;
                field.typeName = BooleanType.typeName;
                field.initialValue = isVisible;

            } else if (context.is(Keywords.observed)){
                context.expect(Keywords.observed);
                context.expect(Keywords.as);

                const observation = context.expectString();

                field.name = WorldObject.observation;
                field.typeName = StringType.typeName;
                field.initialValue = observation.value;

            } else if (context.is(Keywords.described)){
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

            } else if (context.is(Keywords.where)){
                context.expect(Keywords.where);
                context.expect(Keywords.the);
                context.expect(Keywords.player);
                context.expect(Keywords.starts);

                field.name = Place.isPlayerStart;
                field.typeName = BooleanType.typeName;
                field.initialValue = true;
        
            } else {
                throw new CompilationError("Unable to determine property field");
            }
        } else if (context.is(Keywords.has)){

            context.expect(Keywords.has);
            context.expect(Keywords.a);
            
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

        } else if (context.is(Keywords.contains)){
            
            context.expect(Keywords.contains);

            const expectPair = () => {
                const count = context.expectNumber();
                const name = context.expectIdentifier();

                return [Number(count.value), name.value];
            };

            const items = [expectPair()];

            while (context.isTypeOf(TokenType.ListSeparator)){
                context.consumeCurrentToken();

                items.push(expectPair());
            }

            field.name = WorldObject.contents;
            field.typeName = List.typeName;
            field.initialValue = items; 
        } else if (context.is(Keywords.can)){

            context.expect(Keywords.can);
            context.expect(Keywords.reach);
            context.expect(Keywords.the);

            const placeName = context.expectIdentifier();

            context.expect(Keywords.by);
            context.expect(Keywords.going);

            const direction = context.expectString();

            field.name = `~${direction.value}`;
            field.typeName = StringType.typeName;
            field.initialValue = `${placeName.value}`;
        } else {
            throw new CompilationError("Unable to determine field");
        }
        
        context.expectTerminator();

        return field;
    }
}