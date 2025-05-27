import { Field } from "../../../../common/Field";
import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Parameter } from "../../../../common/Parameter";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { Convert } from "../../../../library/Convert";
import { List } from "../../../../library/List";
import { NumberType } from "../../../../library/NumberType";
import { StringType } from "../../../../library/StringType";
import { CompilationError } from "../../../exceptions/CompilationError";
import { FieldDeclarationExpression } from "../../../parsing/expressions/FieldDeclarationExpression";
import { TypeDeclarationExpression } from "../../../parsing/expressions/TypeDeclarationExpression";
import { TransformerContext } from "../../TransformerContext";
import { ExpressionTransformer } from "../expressions/ExpressionTransformer";

export class FieldWriter{
    constructor(private readonly context:TransformerContext, private readonly type:Type){

    }

    getOrAdd(fieldName:string, fieldTypeName:string, defaultValue:Object){
        const field = this.type.getField(fieldName);

        if (field){
            return field;
        }

        return this.add(fieldName, fieldTypeName, defaultValue);
    }

    add(fieldName:string, fieldTypeName:string, defaultValue:Object){
        const field = new Field();
        field.name = fieldName;
        field.typeName = fieldTypeName;
        field.defaultValue = defaultValue;
        
        this.type.fields.push(field);

        return field;
    }

    mergeOrOverrideField(fieldName:string, defaultValue:Object){
        
        const field = this.type.getField(fieldName);

        if (!field){
            throw new CompilationError(`Unable to create or find field '${fieldName}' in type '${this.type.name}'`);
        }

        const isList = field.type?.isTypeOf(List.typeName);

        if (isList){
            const baseField = this.type.base?.getField(fieldName);
            const fieldContents = <Object[]>field.defaultValue || [];

            if (baseField){
                fieldContents.push(...<Object[]>baseField.defaultValue);
            }

            fieldContents.push(...<Object[]>defaultValue);

            field.defaultValue = fieldContents;
        } else {
            field.defaultValue = defaultValue;
        }

        return true;
    }

    createFieldIfNotExistsOrAppend(name:string, typeName:string, defaultValues:Object[], exclusiveValuesByName:Map<string, Object>){
        if (this.createFieldIfNotExists(name, typeName, defaultValues)){
            return;
        }

        const field = this.type.getField(name);

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

    createFieldIfNotExists(name:string, typeName:string, defaultValue:Object){

        if (this.type.hasOverriddenField(name)){
            return false;
        }

        const field = new Field();
        field.name = name;
        field.typeName = typeName;
        field.type = this.context.getType(typeName);

        this.type.fields.push(field);

        this.mergeOrOverrideField(name, defaultValue);

        return true;
    }

    transformCustomFields(expression:TypeDeclarationExpression|undefined){
        if (!expression){
            return;
        }

        for(const fieldExpression of expression.fields){

            // In the case where this field specifically applies to particular locations,
            // we're expanding out the definition into a field per location to make it
            // easier to just look the field up by name at runtime and not have to sift 
            // through all of the fields to find the applicable one.

            if (fieldExpression.locationCondition){
                for(const location of fieldExpression.locationCondition.locationNames){
                    this.createCustomField(expression.name, fieldExpression, location);
                }
            } else {
                this.createCustomField(expression.name, fieldExpression);
            }
        }
    }

    private createCustomField(enclosingTypeName:string, fieldExpression:FieldDeclarationExpression, location?:string){
        const actualFieldName = location ? `${fieldExpression.name}@${location}` : fieldExpression.name;

        if (!this.type.hasOverriddenField(actualFieldName)){
            const field = new Field();
            field.typeName = fieldExpression.typeName;
            field.type = this.context.getType(fieldExpression.typeName);
            field.enclosingTypeName = enclosingTypeName;
            field.name = actualFieldName;

            this.type.fields.push(field);
        }

        const field = this.type.getField(actualFieldName);

        if (!field){
            throw new CompilationError(`Unable to locate overridden field '${actualFieldName}' in type '${this.type.name}'`);
        }
        
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
            } else if (field.typeName == List.typeName && this.type.hasField(field.name)){
                this.mergeOrOverrideField(field.name, fieldExpression.initialValue);
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
                getField.body.push(...ExpressionTransformer.transformExpression(associated, this.context));
            }

            getField.body.push(Instruction.return());

            this.type?.methods.push(getField);
        }
    }
}