import { Expression } from "../parsing/expressions/Expression";
import { ProgramExpression } from "../parsing/expressions/ProgramExpression";
import { TypeDeclarationExpression } from "../parsing/expressions/TypeDeclarationExpression";
import { Token } from "../lexing/Token";
import { TokenType } from "../lexing/TokenType";
import { IOutput } from "../../runtime/IOutput";

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
            this.player
        ];

        if (expression instanceof ProgramExpression){
            for(let child of expression.expressions){
                if (child instanceof TypeDeclarationExpression){
                    types.push(child);
                }
            }
        }

        const typesByName = new Map<string, TypeDeclarationExpression>(types.map(x => [x.name, x]));

        for(const declaration of types){
            const baseToken = declaration.baseTypeNameToken;

            if (baseToken.type == TokenType.Keyword && !baseToken.value.startsWith("~")){
                const name = `~${baseToken.value}`;
                declaration.baseType = typesByName.get(name);
            } else {
                declaration.baseType = typesByName.get(baseToken.value);
            }

            for(const field of declaration.fields){
                field.type = typesByName.get(field.typeName);
            }
        }

        return expression;
    }
}