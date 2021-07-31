import { EventType } from "../../../../common/EventType";
import { Field } from "../../../../common/Field";
import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Parameter } from "../../../../common/Parameter";
import { States } from "../../../../common/States";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { Convert } from "../../../../library/Convert";
import { Item } from "../../../../library/Item";
import { List } from "../../../../library/List";
import { NumberType } from "../../../../library/NumberType";
import { Place } from "../../../../library/Place";
import { StringType } from "../../../../library/StringType";
import { WorldObject } from "../../../../library/WorldObject";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Keywords } from "../../../lexing/Keywords";
import { ActionsExpression } from "../../../parsing/expressions/ActionsExpression";
import { ComparisonExpression } from "../../../parsing/expressions/ComparisonExpression";
import { ConcatenationExpression } from "../../../parsing/expressions/ConcatenationExpression";
import { ContainsExpression } from "../../../parsing/expressions/ContainsExpression";
import { Expression } from "../../../parsing/expressions/Expression";
import { FieldDeclarationExpression } from "../../../parsing/expressions/FieldDeclarationExpression";
import { IdentifierExpression } from "../../../parsing/expressions/IdentifierExpression";
import { IfExpression } from "../../../parsing/expressions/IfExpression";
import { LiteralExpression } from "../../../parsing/expressions/LiteralExpression";
import { SayExpression } from "../../../parsing/expressions/SayExpression";
import { SetVariableExpression } from "../../../parsing/expressions/SetVariableExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { ExpressionTransformationMode } from "../../ExpressionTransformationMode";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class GlobalTypeTransformer implements ITypeTransformer{
    transform(expression: Expression, context: TransformerContext): void {
        if (!(expression instanceof TypeDeclarationExpression)){
            return;
        }
        
        const type = context.typesByName.get(expression.name);

        if (!type){
            throw new CompilationError(`Unable to transform type with unknown definition '${expression.name}'`);
        }

        this.transformCustomFields(expression, context, type);
        
        if (this.inheritsFromType(type, context, WorldObject.typeName)){
            const isPlace = this.inheritsFromType(type, context, Place.typeName);
            const defaultState = isPlace ? States.opened : States.closed;

            this.createFieldIfNotExists(WorldObject.state, List.typeName, [defaultState], type);
            this.createFieldIfNotExists(WorldObject.visible, BooleanType.typeName, true, type);
            this.createFieldIfNotExists(WorldObject.contents, List.typeName, [], type);
            this.createFieldIfNotExists(WorldObject.observation, StringType.typeName, "", type);
            this.createFieldIfNotExists(WorldObject.description, StringType.typeName, "", type);

            this.createDescribeMethod(type);
            this.createObserveMethod(type);

            this.createEvents(expression, context, type);            
        } 
    }

    private createEvents(expression:TypeDeclarationExpression, context:TransformerContext, type:Type){
        let eventCount = 0;

        for (const event of expression.events){
            const method = new Method();

            method.name = `~event_${event.actor}_${event.eventKind}_${eventCount}`;
            method.eventType = this.transformEventKind(event.eventKind);

            if (event.target){
                method.parameters.push(
                    new Parameter(WorldObject.contextParameter, event.target)
                );
            }

            eventCount++;

            const actions = <ActionsExpression>event.actions;

            for(const action of actions.actions){
                const body = this.transformExpression(action, ExpressionTransformationMode.IgnoreResultsOfSayExpression);
                method.body.push(
                    ...body                                    
                );
            }

            method.body.push(
                Instruction.return()
            );

            type.methods.push(method);
        }
    }
    
    private createDescribeMethod(type:Type){
        const describe = new Method();
        describe.name = WorldObject.describe;
        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
    
                ...Instruction.joinList(' ',
                    ...Instruction.mapList(WorldObject.observe, WorldObject.contents)
                ),
                Instruction.concatenate(),
                Instruction.print(),
            ),            
            Instruction.return()
        );

        type.methods.push(describe);
    }

    private createObserveMethod(type:Type){
        const observe = new Method();
        observe.name = WorldObject.observe;
        observe.returnType = StringType.typeName;

        observe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                                
                ...Instruction.containsTextValue(States.opened, WorldObject.state),
                ...Instruction.ifTrueThen(
                    Instruction.loadThis(),
                    Instruction.loadProperty(WorldObject.observation),
                    
                    ...Instruction.joinList(' ',
                        ...Instruction.mapList(WorldObject.observe, WorldObject.contents)
                    ),
                    
                    Instruction.concatenate(),
                    Instruction.return(),
                ),
                
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.observation),
                Instruction.return(),
            ),
            Instruction.loadString(""),
            Instruction.return()
        );

        type.methods.push(observe);
    }

    private createFieldIfNotExists(name:string, typeName:string, defaultValue:Object, type:Type){

        if (type.fields.some(x => x.name === name)){
            return;
        }

        const state = new Field();
        state.name = name;
        state.typeName = typeName;
        state.defaultValue = defaultValue;
        
        type.fields.push(state);
    }

    private inheritsFromType(type:Type, context:TransformerContext, typeName:string){
        for(let current = type;
            current;
            current = context.typesByName.get(current.baseTypeName)!){
                if (current.name == typeName){
                    return true;
                } 
        }

        return false;
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
                    getField.body.push(...this.transformExpression(associated));
                }

                getField.body.push(Instruction.return());

                type?.methods.push(getField);
            }

            type?.fields.push(field);    
        }
    }

    private transformEventKind(kind:string){
        switch(kind){
            case Keywords.enters: return EventType.PlayerEntersPlace;
            case Keywords.exits: return EventType.PlayerExitsPlace;
            case Keywords.taken: return EventType.ItIsTaken;
            case Keywords.dropped: return EventType.ItIsDropped;
            case Keywords.used: return EventType.ItIsUsed;
            case Keywords.opened: return EventType.ItIsOpened;
            case Keywords.closed: return EventType.ItIsClosed;
            default:{
                throw new CompilationError(`Unable to transform unsupported event kind '${kind}'`);
            }
        }
    }

    private transformExpression(expression:Expression|null, mode?:ExpressionTransformationMode){
        const instructions:Instruction[] = [];

        if (expression == null){
            return instructions;
        }

        if (expression instanceof IfExpression){            
            const conditional = this.transformExpression(expression.conditional, mode);
            instructions.push(...conditional);

            const ifBlock = this.transformExpression(expression.ifBlock, mode);
            const elseBlock = this.transformExpression(expression.elseBlock, mode);

            ifBlock.push(Instruction.branchRelative(elseBlock.length));

            instructions.push(Instruction.branchRelativeIfFalse(ifBlock.length))
            instructions.push(...ifBlock);
            instructions.push(...elseBlock);
        } else if (expression instanceof SayExpression){
            instructions.push(Instruction.loadString(expression.text));
            instructions.push(Instruction.print());

            if (mode != ExpressionTransformationMode.IgnoreResultsOfSayExpression){
                instructions.push(Instruction.loadString(expression.text));
            }
        } else if (expression instanceof ContainsExpression){
            instructions.push(
                Instruction.loadNumber(expression.count),
                Instruction.loadString(expression.typeName),
                Instruction.loadInstance(expression.targetName),
                Instruction.loadField(WorldObject.contents),
                Instruction.instanceCall(List.containsType)
            );
            
        } else if (expression instanceof ConcatenationExpression){
            const left = this.transformExpression(expression.left!, mode);
            const right = this.transformExpression(expression.right!, mode);

            instructions.push(...left);
            instructions.push(...right);
            instructions.push(Instruction.concatenate());
        } else if (expression instanceof FieldDeclarationExpression){
            instructions.push(
                Instruction.loadThis(),
                Instruction.loadField(expression.name)
            );
        } else if (expression instanceof SetVariableExpression){
            const right = this.transformExpression(expression.evaluationExpression);

            instructions.push(
                ...right,
                Instruction.loadThis(),
                Instruction.loadField(expression.variableName),
                Instruction.assign()
            );
        } else if (expression instanceof LiteralExpression){
            if (expression.typeName == StringType.typeName){
                instructions.push(Instruction.loadString(<string>expression.value));
            } else if (expression.typeName == NumberType.typeName){
                instructions.push(Instruction.loadNumber(Number(expression.value)));
            } else if (expression.typeName == BooleanType.typeName){
                instructions.push(Instruction.loadBoolean(<boolean>(expression.value)));
            } else {
                throw new CompilationError(`Unable to transform unsupported literal expression '${expression}'`);
            }
        } else if (expression instanceof IdentifierExpression){
            instructions.push(
                Instruction.loadThis(),
                Instruction.loadField(expression.variableName));
        } else if (expression instanceof ComparisonExpression){
            const right = this.transformExpression(expression.right!);
            const left = this.transformExpression(expression.left!);

            instructions.push(
                ...left,
                ...right,
                Instruction.compareEqual()
            );
        } else if (expression instanceof ActionsExpression){
            expression.actions.forEach(x => instructions.push(...this.transformExpression(x, mode)));
        } else {
            throw new CompilationError(`Unable to transform unsupported expression: ${expression}`);
        }

        return instructions;
    }
}