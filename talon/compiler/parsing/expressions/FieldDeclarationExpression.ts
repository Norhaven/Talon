import { Expression } from "./Expression";
import { TypeDeclarationExpression } from "./TypeDeclarationExpression";
import { BinaryExpression } from "./BinaryExpression";

export class FieldDeclarationExpression extends Expression{
    name:string = "";
    typeName:string = "";
    initialValue?:Object;
    type?:TypeDeclarationExpression;
    associatedExpressions:BinaryExpression[] = [];
}