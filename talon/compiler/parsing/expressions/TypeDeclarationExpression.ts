import { Expression } from "./Expression";
import { Token } from "../../lexing/Token";
import { FieldDeclarationExpression } from "./FieldDeclarationExpression";

export class TypeDeclarationExpression extends Expression{
    name:string = "";
    baseType?:TypeDeclarationExpression;
    fields:FieldDeclarationExpression[] = [];
    
    constructor(readonly nameToken:Token, readonly baseTypeNameToken:Token){
        super();
        this.name = nameToken.value;
    }

}