import { Expression } from "../parsing/expressions/Expression";
import { ProgramExpression } from "../parsing/expressions/ProgramExpression";
import { TypeDeclarationExpression } from "../parsing/expressions/TypeDeclarationExpression";
import { Token } from "../lexing/Token";
import { TokenType } from "../lexing/TokenType";

export class TalonSemanticAnalyzer{

    private readonly any = new TypeDeclarationExpression(Token.forAny, Token.empty);
    private readonly worldObject = new TypeDeclarationExpression(Token.forWorldObject, Token.forAny);
    private readonly place = new TypeDeclarationExpression(Token.forPlace, Token.forWorldObject);
    private readonly item = new TypeDeclarationExpression(Token.forItem, Token.forWorldObject);
    private readonly booleanType = new TypeDeclarationExpression(Token.forBoolean, Token.forAny);
    private readonly list = new TypeDeclarationExpression(Token.forList, Token.forAny);

    analyze(expression:Expression):Expression{
        const types:TypeDeclarationExpression[] = [this.any, this.worldObject, this.place, this.booleanType, this.item];

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

            if (baseToken.type == TokenType.Keyword && !baseToken.value.startsWith("<>")){
                const name = `<>${baseToken.value}`;
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