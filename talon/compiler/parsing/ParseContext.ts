import { Token } from "../lexing/Token";
import { CompilationError } from "../exceptions/CompilationError";
import { TokenType } from "../lexing/TokenType";
import { IOutput } from "../../runtime/IOutput";

export class ParseContext{
    index:number = 0;

    get isDone(){
        return this.index >= this.tokens.length;
    }

    get currentToken(){
        return this.tokens[this.index];
    }

    get nextToken(){
        return this.tokens[this.index + 1];
    }

    constructor(private readonly tokens:Token[], private readonly out:IOutput){
        this.out.write(`${tokens.length} tokens discovered, parsing...`);
    }

    consumeCurrentToken(){
        const token = this.currentToken;

        this.index++;

        return token;
    }

    is(tokenValue:string){
        return this.currentToken?.value == tokenValue;
    }

    isFollowedBy(tokenValue:string){
        return this.nextToken?.value == tokenValue;
    }

    isTypeOf(type:TokenType){
        return this.currentToken.type == type;
    }

    isAnyTypeOf(...types:TokenType[]){
        for(const type of types){
            if (this.isTypeOf(type)){
                return true;
            }
        }

        return false;
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
        const token = this.expectAndConsume(TokenType.String, "Expected string");

        // We need to strip off the double quotes from their string after we consume it.
        
        return new Token(token.line, token.column, token.value.substring(1, token.value.length - 1));
    }

    expectOneOrMoreStrings(){
        const stringTokens = [this.expectString()];

        while(this.isTypeOf(TokenType.ListSeparator)){
            this.consumeCurrentToken();

            stringTokens.push(this.expectString());
        }

        return stringTokens;
    }

    expectNumber(){
        return this.expectAndConsume(TokenType.Number, "Expected number");
    }

    expectBoolean(){
        return this.expectAndConsume(TokenType.Boolean, "Expected boolean");
    }

    expectIdentifier(){
        return this.expectAndConsume(TokenType.Identifier, "Expected identifier");
    }

    expectTerminator(){
        this.expectAndConsume(TokenType.Terminator, "Expected expression terminator");
    }

    expectSemiTerminator(){
        this.expectAndConsume(TokenType.SemiTerminator, "Expected semi expression terminator");
    }

    expectOpenMethodBlock(){
        this.expectAndConsume(TokenType.OpenMethodBlock, "Expected open method block");
    }

    private expectAndConsume(tokenType:TokenType, errorMessage:string){
        if (this.currentToken.type != tokenType){
            throw this.createCompilationErrorForCurrentToken(errorMessage);
        }

        return this.consumeCurrentToken();
    }

    private createCompilationErrorForCurrentToken(message:string):CompilationError{
        return new CompilationError(`${message}: ${this.currentToken}`);
    }
}