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
import { Creature } from "../../library/Creature";
import { Menu } from "../../library/Menu";
import { MenuOption } from "../../library/MenuOption";
import { GlobalWhenTypeTransformer } from "./transformers/type/GlobalWhenTypeTransformer";
import { GlobalFieldsTypeTransformer } from "./transformers/type/GlobalFieldsTypeTransformer";
import { Group } from "../../library/Group";

export class TalonTransformer{
    constructor(private readonly out:IOutput){
    }
    
    private createSystemTypes(context:TransformerContext){
        
        // These are only here as stubs for external runtime types that allow us to correctly resolve field types.

        context.addType(Any.typeName, Any.parentTypeName);
        context.addType(WorldObject.typeName, WorldObject.parentTypeName);
        context.addType(Place.typeName, Place.parentTypeName);
        context.addType(BooleanType.typeName, BooleanType.parentTypeName);
        context.addType(StringType.typeName, StringType.parentTypeName);
        context.addType(NumberType.typeName, NumberType.parentTypeName);
        context.addType(Item.typeName, Item.parentTypeName);
        context.addType(List.typeName, List.parentTypeName);
        context.addType(Player.typeName, Player.parentTypeName);
        context.addType(Say.typeName, Say.parentTypeName);
        context.addType(Decoration.typeName, Decoration.parentTypeName);
        context.addType(Creature.typeName, Creature.parentTypeName);
        context.addType(Menu.typeName, Menu.parentTypeName);
        context.addType(MenuOption.typeName, MenuOption.parentTypeName);
        context.addType(Group.typeName, Group.parentTypeName);
    }

    orderedMapTransform<T extends ITypeTransformer>(expressions:Expression[], transformerType:(new(context:TransformerContext) => T), context:TransformerContext){
        const orderedTypes = context.orderedTypeHierarchy;
        const typeExpressionsByName = new Map<string, Expression>(expressions.filter(x => x instanceof TypeDeclarationExpression).map(x => [x.name, x]));
        const transformer = new transformerType(context);

        orderedTypes.map(x => transformer.transform(typeExpressionsByName.get(x.name), x));
    }

    mapTransform<T extends ITypeTransformer>(expressions:Expression[], transformerType:(new(context:TransformerContext) => T), context:TransformerContext){
        expressions.map(x => this.typeTransform(x, transformerType, context));
    }

    typeTransform<T extends ITypeTransformer>(expression:Expression, transformerType:(new(context:TransformerContext) => T), context:TransformerContext){
        const transformer = new transformerType(context);
        transformer.transform(expression);
    }

    transform(expression:Expression):Type[]{
        
        if (!(expression instanceof ProgramExpression)){
            throw new CompilationError(`Unable to transform a partial program`);
        }

        const context = new TransformerContext();
        
        this.createSystemTypes(context);        

        this.typeTransform(expression, GlobalFieldsTypeTransformer, context);
        this.typeTransform(expression, GlobalSaysTypeTransformer, context);

        const globalExpressions = expression.expressions;

        // TODO: Transform global 'when' expressions appropriately and then handle menu/option declarations.
        
        this.typeTransform(expression, GlobalWhenTypeTransformer, context);   

        this.mapTransform(globalExpressions, UnderstandingTypeTransformer, context);
        this.mapTransform(globalExpressions, InitialTypeDeclarationTypeTransformer, context);
        
        // The previous transforms should have created at least the definition of all types, custom or otherwise,
        // so make sure everything resolves now to make things easier up front as well as during the build-up of each type.

        context.resolveAllTypes();

        this.orderedMapTransform(globalExpressions, GlobalTypeTransformer, context);     
                
        this.out.write(`Created ${context.typeCount} types...`);
        
        return context.types;
    }    
}