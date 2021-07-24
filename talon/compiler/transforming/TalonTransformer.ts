import { Expression } from "../parsing/expressions/Expression";
import { Type } from "../../common/Type";
import { ProgramExpression } from "../parsing/expressions/ProgramExpression";
import { CompilationError } from "../exceptions/CompilationError";
import { TypeDeclarationExpression } from "../parsing/expressions/TypeDeclarationExpression";
import { UnderstandingDeclarationExpression } from "../parsing/expressions/UnderstandingDeclarationExpression";
import { Understanding } from "../../library/Understanding";
import { Field } from "../../common/Field";
import { Any } from "../../library/Any";
import { WorldObject } from "../../library/WorldObject";
import { Place } from "../../library/Place";
import { BooleanType } from "../../library/BooleanType";
import { StringType } from "../../library/StringType";
import { Item } from "../../library/Item";
import { NumberType } from "../../library/NumberType";
import { List } from "../../library/List";
import { Player } from "../../library/Player";
import { SayExpression } from "../parsing/expressions/SayExpression";
import { Method } from "../../common/Method";
import { Say } from "../../library/Say";
import { Instruction } from "../../common/Instruction";
import { Parameter } from "../../common/Parameter";
import { IfExpression } from "../parsing/expressions/IfExpression";
import { ConcatenationExpression } from "../parsing/expressions/ConcatenationExpression";
import { ContainsExpression } from "../parsing/expressions/ContainsExpression";
import { FieldDeclarationExpression } from "../parsing/expressions/FieldDeclarationExpression";
import { ActionsExpression } from "../parsing/expressions/ActionsExpression";
import { Keywords } from "../lexing/Keywords";
import { EventType } from "../../common/EventType";
import { ExpressionTransformationMode } from "./ExpressionTransformationMode";
import { IOutput } from "../../runtime/IOutput";
import { SetVariableExpression } from "../parsing/expressions/SetVariableExpression";
import { LiteralExpression } from "../parsing/expressions/LiteralExpression";
import { Decoration } from "../../library/Decoration";
import { ComparisonExpression } from "../parsing/expressions/ComparisonExpression";
import { IdentifierExpression } from "../parsing/expressions/IdentifierExpression";
import { Convert } from "../../library/Convert";
import { ITypeTransformer } from "./ITypeTransformer";
import { TransformerContext } from "./TransformerContext";
import { UnderstandingTypeTransformer } from "./transformers/type/UnderstandingTypeTransformer";
import { InitialTypeDeclarationTypeTransformer } from "./transformers/type/InitialTypeDeclarationTypeTransformer";
import { GlobalSaysTypeTransformer } from "./transformers/type/GlobalSaysTypeTransformer";
import { GlobalTypeTransformer } from "./transformers/type/GlobalTypeTransformer";

export class TalonTransformer{
    constructor(private readonly out:IOutput){

    }
    
    private createSystemTypes(){
        const types:Type[] = [];
        
        // These are only here as stubs for external runtime types that allow us to correctly resolve field types.

        types.push(new Type(Any.typeName, Any.parentTypeName));
        types.push(new Type(WorldObject.typeName, WorldObject.parentTypeName));
        types.push(new Type(Place.typeName, Place.parentTypeName));
        types.push(new Type(BooleanType.typeName, BooleanType.parentTypeName));
        types.push(new Type(StringType.typeName, StringType.parentTypeName));
        types.push(new Type(NumberType.typeName, NumberType.parentTypeName));
        types.push(new Type(Item.typeName, Item.parentTypeName));
        types.push(new Type(List.typeName, List.parentTypeName));
        types.push(new Type(Player.typeName, Player.parentTypeName));
        types.push(new Type(Say.typeName, Say.parentTypeName));
        types.push(new Type(Decoration.typeName, Decoration.parentTypeName));

        return new Map<string, Type>(types.map(x => [x.name, x]));
    }

    mapTransform<T extends ITypeTransformer>(expressions:Expression[], transformerType:(new() => T), context:TransformerContext){
        expressions.map(x => this.typeTransform(x, transformerType, context));
    }

    typeTransform<T extends ITypeTransformer>(expression:Expression, transformerType:(new() => T), context:TransformerContext){
        const transformer = new transformerType();
        transformer.transform(expression, context)
    }

    transform(expression:Expression):Type[]{
        
        if (!(expression instanceof ProgramExpression)){
            throw new CompilationError(`Unable to transform a partial program`);
        }

        const context = new TransformerContext();
        
        context.typesByName = this.createSystemTypes();        

        this.typeTransform(expression, GlobalSaysTypeTransformer, context);

        const globalExpressions = expression.expressions;

        this.mapTransform(globalExpressions, UnderstandingTypeTransformer, context);
        this.mapTransform(globalExpressions, InitialTypeDeclarationTypeTransformer, context);
        this.mapTransform(globalExpressions, GlobalTypeTransformer, context);        
        
        this.out.write(`Created ${context.typesByName.size} types...`);
        
        return context.types;
    }    
}