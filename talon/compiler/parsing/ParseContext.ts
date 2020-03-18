import { Token } from "../lexing/Token";
import { CompilationError } from "../exceptions/CompilationError";
import { TokenType } from "../lexing/TokenType";

export class ParseContext{
    tokens:Token[] = [];
    index:number = 0;

    get isDone(){
        return this.index >= this.tokens.length;
    }

    get currentToken(){
        return this.tokens[this.index];
    }

    constructor(tokens:Token[]){
        this.tokens = tokens;
    }

    consumeCurrentToken(){
        const token = this.currentToken;

        this.index++;

        return token;
    }

    is(tokenValue:string){
        return this.currentToken?.value == tokenValue;
    }

    isAnyOf(...tokenValues:string[]){
        for(let value of tokenValues){
            if (this.is(value)){
                return true;
            }
        }

        return false;
    }

    isTerminator(){
        return this.currentToken.type == TokenType.Terminator;
    }

    expectAnyOf(...tokenValues:string[]){
        if (!this.isAnyOf(...tokenValues)){
            throw new CompilationError("Expected tokens");
        }
        
        return this.consumeCurrentToken();
    }

    expect(tokenValue:string){
        if (this.currentToken.value != tokenValue){
            throw new CompilationError(`Expected token '${tokenValue}'`);
        }

        return this.consumeCurrentToken();
    }

    expectString(){
        if (this.currentToken.type != TokenType.String){
            throw new CompilationError("Expected string");
        }

        const token = this.consumeCurrentToken();

        // We need to strip off the double quotes from their string after we consume it.
        
        return new Token(token.line, token.column, token.value.substring(1, token.value.length - 1));
    }

    expectNumber(){
        if (this.currentToken.type != TokenType.Number){
            throw new CompilationError("Expected number");
        }

        return this.consumeCurrentToken();
    }

    expectIdentifier(){
        if (this.currentToken.type != TokenType.Identifier){
            throw new CompilationError("Expected identifier");
        }

        return this.consumeCurrentToken();
    }

    expectTerminator(){
        if (this.currentToken.type != TokenType.Terminator){
            throw new CompilationError("Expected expression terminator");
        }

        return this.consumeCurrentToken();
    }

    expectSemiTerminator(){
        if (this.currentToken.type != TokenType.SemiTerminator){
            throw new CompilationError("Expected semi expression terminator");
        }

        return this.consumeCurrentToken();
    }

    expectOpenMethodBlock(){
        if (this.currentToken.type != TokenType.OpenMethodBlock){
            throw new CompilationError("Expected open method block");
        }

        return this.consumeCurrentToken();
    }
}