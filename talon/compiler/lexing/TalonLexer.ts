import { Token } from "./Token";
import { Keywords } from "./Keywords";
import { Punctuation } from "./Punctuation";
import { TokenType } from "./TokenType";

export class Tokenizer{
    private static readonly allKeywords = Keywords.getAll();

    tokenize(code:string):Token[]{
        let currentLine = 1;
        let currentColumn = 1;

        const tokens:Token[] = [];

        for(let index = 0; index < code.length; ){
            const currentChar = code.charAt(index);

            if (currentChar == " "){
                currentColumn++;
                index++;
                continue;
            }

            if (currentChar == "\n"){
                currentColumn = 1;
                currentLine++;
                index++;
                continue;
            }

            let tokenValue = this.consumeTokenCharsAt(code, index);
            
            if (tokenValue.length > 0){
                const token = new Token(currentLine, currentColumn, tokenValue);
                tokens.push(token);
            }

            currentColumn += tokenValue.length;
            index += tokenValue.length;
        }

        return this.classify(tokens);
    }

    private classify(tokens:Token[]):Token[]{
        for(let token of tokens){
            if (token.value == Punctuation.period){
                token.type = TokenType.Terminator;
            } else if (token.value == Punctuation.semicolon){
                token.type = TokenType.SemiTerminator;
            } else if (token.value == Punctuation.colon){
                token.type = TokenType.OpenMethodBlock;
            } else if (Tokenizer.allKeywords.has(token.value)){
                token.type = TokenType.Keyword;
            } else if (token.value.startsWith("\"") && token.value.endsWith("\"")){
                token.type = TokenType.String;
            } else if (!isNaN(Number(token.value))) {
                token.type = TokenType.Number;
            } else {
                token.type = TokenType.Identifier;
            }
        }

        return tokens;
    }

    private consumeTokenCharsAt(code:string, index:number):string{
        const tokenChars:string[] = [];
        const stringDelimiter = "\"";

        let isConsumingString = false;

        for(let readAheadIndex = index; readAheadIndex < code.length; readAheadIndex++){
            const currentChar = code.charAt(readAheadIndex);

            if (isConsumingString && currentChar != stringDelimiter){
                tokenChars.push(currentChar);
                continue;
            }

            if (currentChar == stringDelimiter){                
                tokenChars.push(currentChar);                

                isConsumingString = !isConsumingString;

                if (isConsumingString){
                    continue;                   
                } else {
                    break;
                }
            }

            if (currentChar == " " || currentChar == "\n" || currentChar == Punctuation.period || currentChar == Punctuation.colon || currentChar == Punctuation.semicolon){
                if (tokenChars.length == 0){
                    tokenChars.push(currentChar);
                }
                break;
            }

            tokenChars.push(currentChar);
        }

        return tokenChars.join("");
    }
}