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

    transform(expression:Expression):Type[]{
        const typesByName = this.createSystemTypes();
        let dynamicTypeCount = 0;

        if (expression instanceof ProgramExpression){
            for(const child of expression.expressions){
                if (child instanceof UnderstandingDeclarationExpression){
                    
                    const type = new Type(`~${Understanding.typeName}_${dynamicTypeCount}`, Understanding.typeName);
                    
                    const action = new Field();
                    action.name = Understanding.action;
                    action.defaultValue = child.value;

                    const meaning = new Field();
                    meaning.name = Understanding.meaning;
                    meaning.defaultValue = child.meaning;
                    
                    type.fields.push(action);
                    type.fields.push(meaning);

                    dynamicTypeCount++;

                    typesByName.set(type.name, type);
                } else if (child instanceof TypeDeclarationExpression){
                    const type = this.transformInitialTypeDeclaration(child);
                    
                    typesByName.set(type.name, type);
                } 
            }

            for(const child of expression.expressions){
                if (child instanceof TypeDeclarationExpression){
                    const type = typesByName.get(child.name);

                    for(const fieldExpression of child.fields){
                        const field = new Field();
                        field.name = fieldExpression.name;
                        field.typeName = fieldExpression.typeName;
                        field.type = typesByName.get(fieldExpression.typeName);

                        if (fieldExpression.initialValue){
                            if (field.typeName == StringType.typeName){
                                const value = <string>fieldExpression.initialValue;
                                field.defaultValue = value;
                            } else if (field.typeName == NumberType.typeName){
                                const value = Number(fieldExpression.initialValue);
                                field.defaultValue = value;
                            } else if (field.typeName == BooleanType.typeName){
                                const value = Boolean(fieldExpression.initialValue);
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
                    
                    let isWorldObject = false;

                    for(let current = type;
                        current;
                        current = typesByName.get(current.baseTypeName)){
                            if (current.name == WorldObject.typeName){
                                isWorldObject = true;
                                break;
                            } 
                    }

                    if (isWorldObject){
                        const describe = new Method();
                        describe.name = WorldObject.describe;
                        describe.body.push(
                            Instruction.loadThis(),
                            Instruction.loadProperty(WorldObject.visible),
                            Instruction.branchRelativeIfFalse(3),
                            Instruction.loadThis(),
                            Instruction.loadProperty(WorldObject.description),
                            Instruction.print(),
                            Instruction.return()
                        );

                        type?.methods.push(describe);

                        const observe = new Method();
                        observe.name = WorldObject.observe;
                        observe.body.push(
                            Instruction.loadThis(),
                            Instruction.loadProperty(WorldObject.visible),
                            Instruction.branchRelativeIfFalse(3),
                            Instruction.loadThis(),
                            Instruction.loadProperty(WorldObject.observation),
                            Instruction.print(),
                            Instruction.return()
                        );

                        type?.methods.push(observe);

                        if (!type?.fields.find(x => x.name == WorldObject.visible)){
                            const visible = new Field();

                            visible.name = WorldObject.visible;
                            visible.typeName = BooleanType.typeName;
                            visible.defaultValue = true;

                            type?.fields.push(visible);
                        }

                        if (!type?.fields.find(x => x.name == WorldObject.contents)){
                            const contents = new Field();

                            contents.name = WorldObject.contents;
                            contents.typeName = List.typeName;
                            contents.defaultValue = [];

                            type?.fields.push(contents);
                        }

                        if (!type?.fields.find(x => x.name == WorldObject.observation)){
                            const observation = new Field();

                            observation.name = WorldObject.observation;
                            observation.typeName = StringType.typeName;
                            observation.defaultValue = "";

                            type?.fields.push(observation);
                        }

                        let duplicateEventCount = 0;

                        for (const event of child.events){
                            const method = new Method();

                            method.name = `~event_${event.actor}_${event.eventKind}_${duplicateEventCount}`;
                            method.eventType = this.transformEventKind(event.eventKind);

                            duplicateEventCount++;

                            const actions = <ActionsExpression>event.actions;

                            for(const action of actions.actions){
                                const body = this.transformExpression(action, ExpressionTransformationMode.IgnoreResultsOfSayExpression);
                                method.body.push(...body);
                            }

                            method.body.push(Instruction.return());

                            type?.methods.push(method);
                        }
                    } 
                }
            }

            const globalSays = expression.expressions.filter(x => x instanceof SayExpression);

            const type = new Type(`~globalSays`, Say.typeName);

            const method = new Method();
            method.name = Say.typeName;
            method.parameters = [];

            const instructions:Instruction[] = [];

            for(const say of globalSays){
                const sayExpression = <SayExpression>say;

                instructions.push(
                    Instruction.loadString(sayExpression.text),
                    Instruction.print()
                );
            }

            instructions.push(Instruction.return());

            method.body = instructions;

            type.methods.push(method);

            typesByName.set(type.name, type);  
        } else {
            throw new CompilationError("Unable to partially transform");
        }

        this.out.write(`Created ${typesByName.size} types...`);
        
        return Array.from(typesByName.values());
    }

    private transformEventKind(kind:string){
        switch(kind){
            case Keywords.enters:{
                return EventType.PlayerEntersPlace;
            }
            case Keywords.exits:{
                return EventType.PlayerExitsPlace;
            }
            default:{
                throw new CompilationError(`Unable to transform unsupported event kind '${kind}'`);
            }
        }
    }

    private transformExpression(expression:Expression, mode?:ExpressionTransformationMode){
        const instructions:Instruction[] = [];

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
                Instruction.instanceCall(List.contains)
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
            } else {
                throw new CompilationError(`Unable to transform unsupported literal expression '${expression}'`);
            }
        } else {
            throw new CompilationError("Unable to transform unsupported expression");
        }

        return instructions;
    }

    private transformInitialTypeDeclaration(expression:TypeDeclarationExpression){
        return new Type(expression.name, expression.baseType!.name);
    }
}