import { Expression } from "../parsing/expressions/Expression";
import { ProgramExpression } from "../parsing/expressions/ProgramExpression";
import { TypeDeclarationExpression } from "../parsing/expressions/TypeDeclarationExpression";
import { Token } from "../lexing/Token";
import { TokenType } from "../lexing/TokenType";
import { IOutput } from "../../runtime/IOutput";
import { WorldObject } from "../../library/WorldObject";
import { FieldDeclarationExpression } from "../parsing/expressions/FieldDeclarationExpression";
import { List } from "../../library/List";
import { ActionsExpression } from "../parsing/expressions/ActionsExpression";
import { InlineMenuDeclarationExpression } from "../parsing/expressions/InlineMenuDeclarationExpression";
import { SetVariableExpression } from "../parsing/expressions/SetVariableExpression";
import { OptionDeclarationExpression } from "../parsing/expressions/OptionDeclarationExpression";
import { ArrayList } from "../../common/ArrayList";
import { IdentifierExpression } from "../parsing/expressions/IdentifierExpression";

export class TalonSemanticAnalyzer{

    private readonly any = new TypeDeclarationExpression(Token.forAny, Token.empty);
    private readonly worldObject = new TypeDeclarationExpression(Token.forWorldObject, Token.forAny);
    private readonly place = new TypeDeclarationExpression(Token.forPlace, Token.forWorldObject);
    private readonly item = new TypeDeclarationExpression(Token.forItem, Token.forWorldObject);
    private readonly booleanType = new TypeDeclarationExpression(Token.forBoolean, Token.forAny);
    private readonly list = new TypeDeclarationExpression(Token.forList, Token.forAny);
    private readonly decoration = new TypeDeclarationExpression(Token.forDecoration, Token.forWorldObject);
    private readonly creature = new TypeDeclarationExpression(Token.forCreature, Token.forWorldObject);
    private readonly menu = new TypeDeclarationExpression(Token.forMenu, Token.forAny);
    private readonly option = new TypeDeclarationExpression(Token.forOption, Token.forAny);
    private readonly player = new TypeDeclarationExpression(Token.forPlayer, Token.forWorldObject);
    private readonly group = new TypeDeclarationExpression(Token.forGroup, Token.forWorldObject);

    constructor(private readonly out:IOutput){

    }
    
    analyze(expression:Expression):Expression{
        const types:TypeDeclarationExpression[] = [
            this.any, 
            this.worldObject, 
            this.place, 
            this.booleanType, 
            this.item, 
            this.decoration, 
            this.creature, 
            this.menu, 
            this.option,
            this.player,
            this.group
        ];

        if (expression instanceof ProgramExpression){
            for(let child of expression.expressions){
                if (child instanceof TypeDeclarationExpression){
                    types.push(child);
                }
            }
        }

        const typesByName = new Map<string, TypeDeclarationExpression>(types.map(x => [x.name, x]));

        this.ensureTypeHierarchyIsValidForAllTypes(typesByName);
        this.ensureDynamicTypesReferenceEitherContextOrClosuresIfNecessary(typesByName);

        return expression;
    }

    private ensureTypeHierarchyIsValidForAllTypes(types:Map<string, TypeDeclarationExpression>){        

        for(const declaration of types.values()){
            const baseToken = declaration.baseTypeNameToken;

            if (baseToken.type == TokenType.Keyword && !baseToken.value.startsWith("~")){
                const name = `~${baseToken.value}`;
                declaration.baseType = types.get(name);
            } else {
                declaration.baseType = types.get(baseToken.value);
            }

            for(const field of declaration.fields){
                field.type = types.get(field.typeName);
            }
        }
    }

    private ensureDynamicTypesReferenceEitherContextOrClosuresIfNecessary(types:Map<string, TypeDeclarationExpression>){
        const typeExpressions = types.values();

        for(const type of typeExpressions){
            for(const actions of type.events.flatMap(x => <ActionsExpression>x.actions)){
                for(const menu of ArrayList.from(actions.actions).ofType(InlineMenuDeclarationExpression)){
                    for(const option of menu.options){
                        const actions = option.actions;
                        for(let i = 0; i < option.actions.length; i++){
                            const action = option.actions[i];

                            if (action.isOfType(SetVariableExpression)){
                                const instanceTypeName = action.variableIdentifier.instanceName || type.name;
                                const variableName = action.variableIdentifier.variableName;

                                const setExpression = new SetVariableExpression(new IdentifierExpression(instanceTypeName, variableName), action.evaluationExpression, action.isNegated);

                                actions[i] = setExpression;         
                            }                   
                        }
                    }
                }
            }
        }
    }
}