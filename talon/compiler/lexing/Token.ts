import { TokenType } from "./TokenType";
import { Place } from "../../library/Place";
import { Any } from "../../library/Any";
import { WorldObject } from "../../library/WorldObject";
import { BooleanType } from "../../library/BooleanType";
import { Item } from "../../library/Item";
import { List } from "../../library/List";
import { Decoration } from "../../library/Decoration";

export class Token{
    static get empty():Token{
        return Token.getTokenWithTypeOf("~empty", TokenType.Unknown);
    }

    static get forAny():Token{
        return Token.getTokenWithTypeOf(Any.typeName, TokenType.Keyword);
    }

    static get forPlace():Token{
        return Token.getTokenWithTypeOf(Place.typeName, TokenType.Keyword);
    }

    static get forItem():Token{
        return Token.getTokenWithTypeOf(Item.typeName, TokenType.Keyword);
    }

    static get forDecoration():Token{
        return Token.getTokenWithTypeOf(Decoration.typeName, TokenType.Keyword);
    }

    static get forWorldObject():Token{
        return Token.getTokenWithTypeOf(WorldObject.typeName, TokenType.Keyword);
    }

    static get forBoolean():Token{
        return Token.getTokenWithTypeOf(BooleanType.typeName, TokenType.Keyword);
    }

    static get forList():Token{
        return Token.getTokenWithTypeOf(List.typeName, TokenType.Keyword);
    }

    private static getTokenWithTypeOf(name:string, type:TokenType){
        const token = new Token(-1,-1,name);
        token.type = type;
        return token;
    }

    type:TokenType = TokenType.Unknown;

    constructor(public readonly line:number,
                public readonly column:number,
                public readonly value:string){
    }

    toString(){
        return `${this.line}, ${this.column}: Found token '${this.value}' of type '${this.type}'`;
    }
}