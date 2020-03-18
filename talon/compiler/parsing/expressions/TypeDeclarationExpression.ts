import { Expression } from "./Expression";
import { Token } from "../../lexing/Token";
import { FieldDeclarationExpression } from "./FieldDeclarationExpression";
import { WhenDeclarationExpression } from "./WhenDeclarationExpression";

export class TypeDeclarationExpression extends Expression{
    name:string = "";
    baseType?:TypeDeclarationExpression;
    fields:FieldDeclarationExpression[] = [];
    events:WhenDeclarationExpression[] = [];
    
    constructor(readonly nameToken:Token, readonly baseTypeNameToken:Token){
        super();
        this.name = nameToken.value;
    }

}