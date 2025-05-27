import { EventType } from "../../../../common/EventType";
import { Field } from "../../../../common/Field";
import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Parameter } from "../../../../common/Parameter";
import { State } from "../../../../common/State";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { Convert } from "../../../../library/Convert";
import { Delegate } from "../../../../library/Delegate";
import { Group } from "../../../../library/Group";
import { Item } from "../../../../library/Item";
import { List } from "../../../../library/List";
import { Menu } from "../../../../library/Menu";
import { MenuOption } from "../../../../library/MenuOption";
import { NumberType } from "../../../../library/NumberType";
import { Place } from "../../../../library/Place";
import { Player } from "../../../../library/Player";
import { StringType } from "../../../../library/StringType";
import { WorldObject } from "../../../../library/WorldObject";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Keywords } from "../../../lexing/Keywords";
import { AbortEventExpression } from "../../../parsing/expressions/AbortEventExpression";
import { ActionsExpression } from "../../../parsing/expressions/ActionsExpression";
import { ComparisonExpression } from "../../../parsing/expressions/ComparisonExpression";
import { ConcatenationExpression } from "../../../parsing/expressions/ConcatenationExpression";
import { ContainsExpression } from "../../../parsing/expressions/ContainsExpression";
import { Expression } from "../../../parsing/expressions/Expression";
import { FieldDeclarationExpression } from "../../../parsing/expressions/FieldDeclarationExpression";
import { IdentifierExpression } from "../../../parsing/expressions/IdentifierExpression";
import { IfExpression } from "../../../parsing/expressions/IfExpression";
import { LiteralExpression } from "../../../parsing/expressions/LiteralExpression";
import { ReplaceExpression } from "../../../parsing/expressions/ReplaceExpression";
import { SayExpression } from "../../../parsing/expressions/SayExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { ExpressionTransformationMode } from "../../ExpressionTransformationMode";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";
import { EventTransformer } from "../events/EventTransformer";
import { ExpressionTransformer } from "../expressions/ExpressionTransformer";
import { FieldWriter } from "../writers/FieldWriter";
import { MethodWriter } from "../writers/MethodWriter";

export class GlobalTypeTransformer implements ITypeTransformer{
    private readonly exclusiveStates = [[State.opened, State.closed]];
    private readonly knownExclusiveStatesByName:Map<string, string> = new Map<string, string>();

    constructor(private readonly context:TransformerContext){
        for(const statePair of this.exclusiveStates){
            this.knownExclusiveStatesByName.set(statePair[0], statePair[1]);
            this.knownExclusiveStatesByName.set(statePair[1], statePair[0]);
        }
    }

    transform(expression: Expression|undefined, type?:Type): void {
        if (expression && !(expression instanceof TypeDeclarationExpression)){
            throw new CompilationError(`Attempted to transform a non-type declaration with the type transformer`);
        }
        
        if (!type){
            type = this.context.getType(expression?.name);
        }

        if (!type){
            throw new CompilationError(`Unable to transform type with unknown definition '${expression?.name}'`);
        }

        type.base = this.context.getType(type.baseTypeName);

        this.mergeMultipleDirectionsDefinitionsIfNecessary(expression);
        
        const fieldWriter = new FieldWriter(this.context, type);
        const methodWriter = new MethodWriter(this.context, type);

        if (type.isTypeOf(Menu.typeName)){
            fieldWriter.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true);
            fieldWriter.createFieldIfNotExists(WorldObject.description, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.contents, List.typeName, []);
            fieldWriter.createFieldIfNotExists(Menu.itClosures, List.typeName, []);
            
            methodWriter.createDescribeMenuMethod();
            methodWriter.createShowMethod();
            methodWriter.createHideMethod();
            methodWriter.createMenuMainMethod();

            EventTransformer.createEvents(expression, this.context, type);

        } else if (type.isTypeOf(MenuOption.typeName)){
            fieldWriter.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true);
            fieldWriter.createFieldIfNotExists(WorldObject.observation, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.description, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.contents, List.typeName, []);

            methodWriter.createDescribeMenuOptionMethod();

        } else if (type.isTypeOf(WorldObject.typeName)){
            
            const isPlace = type.isTypeOf(Place.typeName);
            const isPlayer = type.isTypeOf(Player.typeName);
            const isGroup = type.isTypeOf(Group.typeName);

            const defaultState = isPlace || isPlayer ? State.opened : State.closed;

            fieldWriter.createFieldIfNotExistsOrAppend(WorldObject.state, List.typeName, [defaultState], this.knownExclusiveStatesByName);
            fieldWriter.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true);
            fieldWriter.createFieldIfNotExists(WorldObject.contents, List.typeName, []);
            fieldWriter.createFieldIfNotExists(WorldObject.observation, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.description, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.aliases, List.typeName, []);
            fieldWriter.createFieldIfNotExists(WorldObject.groupableAsType, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.list, StringType.typeName, "");
            fieldWriter.createFieldIfNotExists(WorldObject.currentContainer, StringType.typeName, "");

            if (isGroup){
                fieldWriter.createFieldIfNotExists(Group.contentType, StringType.typeName, WorldObject.typeName);
                fieldWriter.createFieldIfNotExists(Group.count, NumberType.typeName, 0);
            }

            methodWriter.createDescribeMethod();
            methodWriter.createObserveMethod();
            methodWriter.createTransferMethod();

            if (isPlace){
                methodWriter.createMoveMethod();
            }

            EventTransformer.createEvents(expression, this.context, type);
        }
    
        fieldWriter.transformCustomFields(expression);

        this.context.markTypeAsTransformed(type);
    }
        
    private mergeMultipleDirectionsDefinitionsIfNecessary(type:TypeDeclarationExpression|undefined) {        
        if (!type){
            return;
        }
        
        const directionsFieldDeclarations = type.fields.filter(x => x.name == WorldObject.directions);
        
        if (directionsFieldDeclarations.length == 0){
            return type;
        }

        const mergedDirections = directionsFieldDeclarations.flatMap(x => <string[][]>x.initialValue);

        const directionsField = new FieldDeclarationExpression();

        directionsField.name = WorldObject.directions;
        directionsField.typeName = List.typeName;
        directionsField.type = directionsFieldDeclarations[0].type;
        directionsField.initialValue = mergedDirections;

        const fieldsWithoutDirections = type.fields.filter(x => x.name != WorldObject.directions);
        
        fieldsWithoutDirections.push(directionsField);

        type.fields = fieldsWithoutDirections;
    }
}