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
import { SetVariableExpression } from "../../../parsing/expressions/SetVariableExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { ExpressionTransformationMode } from "../../ExpressionTransformationMode";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";
import { EventTransformer } from "../events/EventTransformer";
import { ExpressionTransformer } from "../expressions/ExpressionTransformer";

export class GlobalTypeTransformer implements ITypeTransformer{
    private readonly exclusiveStates = [[State.opened, State.closed]];
    private readonly knownExclusiveStatesByName:Map<string, string> = new Map<string, string>();

    constructor(){
        for(const statePair of this.exclusiveStates){
            this.knownExclusiveStatesByName.set(statePair[0], statePair[1]);
            this.knownExclusiveStatesByName.set(statePair[1], statePair[0]);
        }
    }

    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof TypeDeclarationExpression)){
            return;
        }
        
        const type = context.typesByName.get(expression.name);

        if (!type){
            throw new CompilationError(`Unable to transform type with unknown definition '${expression.name}'`);
        }

        this.transformCustomFields(expression, context, type);
        
        if (type.baseTypeName === Menu.typeName){
            this.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true, type);
            this.createFieldIfNotExists(WorldObject.description, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.contents, List.typeName, [], type);
            this.createDescribeMenuMethod(type);
            this.createShowMethod(type);
            this.createHideMethod(type);
            this.createMenuMainMethod(type);

            EventTransformer.createEvents(expression, context, type);

        } else if (type.baseTypeName === MenuOption.typeName){
            this.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true, type);
            this.createFieldIfNotExists(WorldObject.observation, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.description, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.contents, List.typeName, [], type);

            this.createDescribeMenuOptionMethod(type);

        } else if (type.inheritsFromType(context.typesByName, WorldObject.typeName)){
            
            const isPlace = type.inheritsFromType(context.typesByName, Place.typeName);
            const isPlayer = type.inheritsFromType(context.typesByName, Player.typeName);
            const isGroup = type.inheritsFromType(context.typesByName, Group.typeName);

            const defaultState = isPlace || isPlayer ? State.opened : State.closed;

            this.createFieldIfNotExistsOrAppend(WorldObject.state, List.typeName, [defaultState], type, this.knownExclusiveStatesByName);
            this.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true, type);
            this.createFieldIfNotExists(WorldObject.contents, List.typeName, [], type);
            this.createFieldIfNotExists(WorldObject.observation, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.description, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.aliases, List.typeName, [], type);
            this.createFieldIfNotExists(WorldObject.groupableAsType, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.list, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.name, StringType.typeName, type.name, type);

            if (isGroup){
                this.createFieldIfNotExists(Group.contentType, StringType.typeName, WorldObject.typeName, type);
                this.createFieldIfNotExists(Group.count, NumberType.typeName, 0, type);
            }

            this.createDescribeMethod(type);
            this.createObserveMethod(type);
            this.createTransferMethod(type);

            EventTransformer.createEvents(expression, context, type);            
        } 
    }
        
    private createDescribeMenuOptionMethod(type:Type){
        const describe = new Method();
        describe.name = Menu.describe;
        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.print()
            ),            
            Instruction.return()
        );

        type.methods.push(describe);
    }

    private createDescribeMenuMethod(type:Type){
        const describe = new Method();
        describe.name = Menu.describe;
        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.print(),
                Instruction.loadThis(),
                Instruction.loadField(WorldObject.contents),
                ...Instruction.forEach(
                    Instruction.instanceCall(MenuOption.describe)
                ),
            ),            
            Instruction.return()
        );

        type.methods.push(describe);
    }

    private createMenuMainMethod(type:Type){
        const handledCommandLocal = "~handledCommand";

        const main = new Method();
        main.name = Menu.main;
        main.parameters = [];
        main.body.push(
            Instruction.loadThis(),
            Instruction.loadField(Menu.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.instanceCall(WorldObject.describe),
                Instruction.loadThis(),
                Instruction.raiseEvent(EventType.ItIsDescribed),
                ...Instruction.raiseAllEvents(),
                Instruction.readInput(),
                Instruction.parseCommand(),
                Instruction.loadThis(),
                Instruction.handleMenuCommand(),
                Instruction.setLocal(handledCommandLocal),
                Instruction.loadLocal(handledCommandLocal),
                Instruction.isTypeOf(List.typeName),
                ...Instruction.ifTrueThen(
                    Instruction.loadLocal(handledCommandLocal),
                    Instruction.instanceCall(List.count),
                    Instruction.loadNumber(0),
                    Instruction.compareEqual(),
                    ...Instruction.ifTrueThen(
                        Instruction.loadString("That doesn't appear to be one of the options."),
                        Instruction.print(),
                        Instruction.goTo(0)
                    ),                    
                    Instruction.loadLocal(handledCommandLocal),
                    ...Instruction.forEach(
                        Instruction.invokeDelegate(),
                        Instruction.ignore() // We know that all delegates will be invoking events, which return a boolean that we don't care about.
                    )
                ),
                Instruction.goTo(0)
            ),
            Instruction.return()
        );     

        type.methods.push(main);
    }

    private createShowMethod(type:Type){
        const menuInstance = "~menuInstance";

        const show = new Method();
        show.name = Menu.show;        
        show.parameters = [];
        show.body.push(
            Instruction.loadInstance(type.name),
            Instruction.setLocal(menuInstance),
            Instruction.loadBoolean(true),
            Instruction.loadLocal(menuInstance),
            Instruction.loadField(Menu.visible),
            Instruction.assign(),
            Instruction.loadLocal(menuInstance),
            Instruction.instanceCall(Menu.main),
            Instruction.return()
        );

        type.methods.push(show);
    }

    private createHideMethod(type:Type){
        const hide = new Method();
        hide.name = Menu.hide;        
        hide.parameters = [];
        hide.body.push(
            Instruction.loadBoolean(false),
            Instruction.loadThis(),
            Instruction.loadField(WorldObject.visible),
            Instruction.assign(),
            Instruction.return()
        );

        type.methods.push(hide);
    }

    private createTransferMethod(type:Type){
        const transfer = new Method();
        transfer.name = WorldObject.transferContents;
        transfer.returnType = BooleanType.typeName;
        transfer.parameters = [
            new Parameter(WorldObject.recipientParameter, WorldObject.typeName),
            new Parameter(WorldObject.contextParameter, WorldObject.typeName),
            new Parameter(WorldObject.eventTypeParameter, StringType.typeName)
        ];

        transfer.body.push(

            // Invoke matching events, if they're present, on the content and recipient.
      
            Instruction.loadLocal(WorldObject.contextParameter),
            Instruction.loadLocal(WorldObject.recipientParameter),
            Instruction.loadLocal(WorldObject.eventTypeParameter),
            Instruction.raiseContextualEvent(EventType.RuntimeDetermined),
            ...Instruction.raiseAllEvents(false),

            // Early out if we declined any of the events, otherwise go ahead and transfer the content.

            ...Instruction.ifTrueThen(
                Instruction.loadLocal(WorldObject.contextParameter),
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.contents),
                Instruction.instanceCall(List.remove),
                Instruction.loadLocal(WorldObject.contextParameter),
                Instruction.loadLocal(WorldObject.recipientParameter),
                Instruction.loadField(WorldObject.contents),
                Instruction.instanceCall(List.add),
                Instruction.loadBoolean(true),
                Instruction.return()
            ),
            Instruction.loadBoolean(false),
            Instruction.return()
        );

        type.methods.push(transfer);
    }

    private createDescribeMethod(type:Type){
        const contentsLocal = "~contents";
        const contentsObservationsLocal = "~contentsObservations";

        const describe = new Method();
        describe.name = WorldObject.describe;
        describe.returnType = BooleanType.typeName;

        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                ...Instruction.containsTextValue(State.opened, WorldObject.state),
                ...Instruction.ifTrueThen(
                    ...Instruction.joinList(' ',
                        Instruction.loadThis(),
                        Instruction.loadProperty(WorldObject.contents),
                        Instruction.setLocal(contentsLocal),
                        ...Instruction.groupList(contentsLocal),
                        ...Instruction.mapList(WorldObject.observe, contentsLocal, contentsObservationsLocal),
                        Instruction.loadLocal(contentsObservationsLocal)
                    ),
                    Instruction.concatenate()
                ),
                Instruction.print(),
            ),            
            Instruction.loadBoolean(true),
            Instruction.return()
        );

        type.methods.push(describe);
    }

    private createObserveMethod(type:Type){
        const contentsLocal = "~contents";
        const contentsObservationsLocal = "~contentsObservations";

        const observe = new Method();
        observe.name = WorldObject.observe;
        observe.returnType = StringType.typeName;

        observe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(                                
                ...Instruction.containsTextValue(State.opened, WorldObject.state),
                ...Instruction.ifTrueThen(
                    Instruction.loadThis(),
                    Instruction.loadProperty(WorldObject.observation),
                    Instruction.loadThis(),
                    Instruction.interpolateString(),
                    ...Instruction.joinList(' ',
                        Instruction.loadThis(),
                        Instruction.loadProperty(WorldObject.contents),
                        Instruction.setLocal(contentsLocal),
                        ...Instruction.groupList(contentsLocal),
                        ...Instruction.mapList(WorldObject.observe, contentsLocal, contentsObservationsLocal),
                        Instruction.loadLocal(contentsObservationsLocal)
                    ),                    
                    Instruction.concatenate(),
                    Instruction.return(),
                ),                
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.observation),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.return(),
            ),
            Instruction.loadString(""),
            Instruction.return()
        );

        type.methods.push(observe);
    }

    private isFieldPresent(name:string, type:Type){
        return type.fields.some(x => x.name === name);
    }

    private isMethodPresent(name:string, type:Type){
        return type.methods.some(x => x.name === name);
    }

    private createFieldIfNotExistsOrAppend(name:string, typeName:string, defaultValues:Object[], type:Type, exclusiveValuesByName:Map<string, Object>){
        if (this.createFieldIfNotExists(name, typeName, defaultValues, type)){
            return;
        }

        const field = type.fields.find(x => x.name == name);

        if (!field){
            throw new CompilationError(`Failed to find field '${name}' in type '${typeName}' but field should have been created`);
        }

        const existingValues = new Set<Object>(<Object[]>field?.defaultValue);
                
        for(const value of defaultValues){            
            if (exclusiveValuesByName){
                const oppositeValue = exclusiveValuesByName.get(value.toString());
                
                if (oppositeValue){
                    if (existingValues.has(oppositeValue)){
                        continue;
                    }
                }
            }

            existingValues.add(value);            
        }

        if (exclusiveValuesByName){
            for(const pair of exclusiveValuesByName){
                if (existingValues.has(pair[0]) && existingValues.has(pair[1])){
                    existingValues.delete(pair[1]);
                    throw new CompilationError(`Unable to assign field value to type '${typeName}' due to mutually exclusive values '${pair}'`);
                }
            }
        }

        field.defaultValue = Array.from(existingValues);
    }

    private createPropertyIfNotExists(name:string, typeName:string, type:Type, ...body:Instruction[]){
        const getFieldName = `~get_${name}`;

        if (this.isMethodPresent(getFieldName, type)){
            return false;
        }

        const getField = new Method();
        getField.name = getFieldName;
        getField.returnType = typeName;
        
        getField.body.push(...body);

        type?.methods.push(getField);

        return true;
    }

    private createFieldIfNotExists(name:string, typeName:string, defaultValue:Object, type:Type){

        if (this.isFieldPresent(name, type)){
            return false;
        }

        const field = new Field();
        field.name = name;
        field.typeName = typeName;
        field.defaultValue = defaultValue;
        
        type.fields.push(field);

        return true;
    }

    private transformCustomFields(expression:TypeDeclarationExpression, context:TransformerContext, type:Type){
        for(const fieldExpression of expression.fields){
            const field = new Field();
            field.name = fieldExpression.name;
            field.typeName = fieldExpression.typeName;
            field.type = context.typesByName.get(fieldExpression.typeName);

            if (fieldExpression.initialValue){
                if (field.typeName == StringType.typeName){
                    const value = <string>fieldExpression.initialValue;
                    field.defaultValue = value;
                } else if (field.typeName == NumberType.typeName){
                    const value = Number(fieldExpression.initialValue);
                    field.defaultValue = value;
                } else if (field.typeName == BooleanType.typeName){
                    let value = false;

                    if (typeof fieldExpression.initialValue == 'string'){
                        value = Convert.stringToBoolean(fieldExpression.initialValue);
                    } else if (typeof fieldExpression.initialValue == 'boolean'){
                        value = fieldExpression.initialValue;
                    } else {
                        throw new CompilationError(`Unable to transform field type`);
                    }

                    field.defaultValue = value;                                
                } else {
                    field.defaultValue = fieldExpression.initialValue;
                }
            }

            if (fieldExpression.associatedExpressions.length > 0){
                const getField = new Method();
                getField.name = `~get_${field.name}`;
                getField.parameters.push(new Parameter("~value", field.typeName));
                getField.returnType = field.typeName;
                
                for(const associated of fieldExpression.associatedExpressions){
                    getField.body.push(...ExpressionTransformer.transformExpression(associated));
                }

                getField.body.push(Instruction.return());

                type?.methods.push(getField);
            }

            type?.fields.push(field);    
        }
    }    
}