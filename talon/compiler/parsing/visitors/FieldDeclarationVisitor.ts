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
import { Group } from "../../../library/Group";
import { Any } from "../../../library/Any";
import { LocationConditionExpression } from "../expressions/LocationConditionExpression";

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

                let locationCondition:LocationConditionExpression|undefined;

                if (context.is(Keywords.in)){
                    context.consumeCurrentToken();
                    context.expect(Keywords.the);

                    const locationNames = context.expectOneOrMoreIdentifiers();

                    locationCondition = new LocationConditionExpression(locationNames.map(x => x.value));
                }

                context.expect(Keywords.as);

                const observation = context.expectString();

                field.name = WorldObject.observation;
                field.typeName = StringType.typeName;
                field.initialValue = observation.value;
                field.locationCondition = locationCondition;

            } else if (context.is(Keywords.listed)){
                context.expect(Keywords.listed);
                context.expect(Keywords.as);

                const listText = context.expectString();

                field.name = WorldObject.list;
                field.typeName = StringType.typeName;
                field.initialValue = listText.value;
                
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
        
            } else if (context.is(Keywords.also)){
                context.expect(Keywords.also);

                context.expect(Keywords.known);
                context.expect(Keywords.as);
                context.expectAnyOf(Keywords.a, Keywords.an);
                
                const aliases = [context.expectString().value];

                while (context.isTypeOf(TokenType.ListSeparator)){
                    context.consumeCurrentToken();

                    const alias = context.expectString();
                    aliases.push(alias.value);
                }

                field.name = WorldObject.aliases;
                field.typeName = List.typeName;
                field.initialValue = aliases; 
            } else if (context.isTypeOf(TokenType.String)) {
                const states = [context.expectString().value];

                while (context.isTypeOf(TokenType.ListSeparator)){
                    context.consumeCurrentToken();

                    const state = context.expectString();
                    states.push(state.value);
                }

                field.name = WorldObject.state;
                field.typeName = List.typeName;
                field.initialValue = states;
            } else {
                throw new CompilationError("Unable to determine property field");
            }
        } else if (context.is(Keywords.has)){

            context.expect(Keywords.has);
            context.expect(Keywords.a);
            context.expect(Keywords.value);
            context.expect(Keywords.called);
            
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
            } else if (context.is(Keywords.empty)) {
                context.consumeCurrentToken();

                if (context.is(Keywords.and)){
                    context.expect(Keywords.and);
                    context.expect(Keywords.can);
                    context.expect(Keywords.hold);

                    if (context.isAnyOf(Keywords.a, Keywords.an)){
                        context.consumeCurrentToken();
                    }

                    const typeName = context.expectIdentifier();

                    field.typeName = typeName.value;
                    field.initialValue = undefined;
                } else {
                    field.typeName = Any.typeName;
                    field.initialValue = undefined;
                }
            }else {
                throw new CompilationError(`Expected a string, number, or boolean but found '${context.currentToken.value}' of type '${context.currentToken.type}'`);
            }
                
            field.name = name.value;

        } else if (context.is(Keywords.contains)){
            
            context.expect(Keywords.contains);

            const tryReadUpperBound = () => {
                if (!context.is(Keywords.to)){
                    return undefined;
                }

                context.expect(Keywords.to);
                const token = context.expectNumber();

                return Number(token.value)
            };

            const expectPair = () => {
                const count = context.expectNumber();
                const upperBound = tryReadUpperBound();                
                const name = context.expectIdentifier();

                return [Number(count.value), upperBound, name.value];
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

            if (context.is(Keywords.reach)){
                context.expect(Keywords.reach);
                context.expect(Keywords.the);

                const placeName = context.expectIdentifier();

                context.expect(Keywords.by);
                context.expect(Keywords.going);

                const directions = context.expectOneOrMoreStrings();

                field.name = WorldObject.directions;
                field.typeName = List.typeName;
                field.initialValue = directions.map(x => [x.value, placeName.value]);
            } else if (context.is(Keywords.be)){
                context.expect(Keywords.be);
                context.expect(Keywords.grouped);
                context.expect(Keywords.as);

                const typeName = context.expectIdentifier();

                field.name = WorldObject.groupableAsType;
                field.typeName = StringType.typeName;
                field.initialValue = typeName.value;
            } else if (context.is(Keywords.contain)){
                context.expect(Keywords.contain);
                context.expect(Keywords.any);
                
                const typeName = context.expectIdentifier();

                field.name = Group.contentType;
                field.typeName = StringType.typeName;
                field.initialValue = typeName;
            }
        } else {
            throw new CompilationError("Unable to determine field");
        }
        
        context.expectTerminator();

        return field;
    }
}