import { Expression } from "./Expression";
import { TypeDeclarationExpression } from "./TypeDeclarationExpression";
import { BinaryExpression } from "./BinaryExpression";
import { LocationConditionExpression } from "./LocationConditionExpression";

export class FieldDeclarationExpression extends Expression{
    name:string = "";
    typeName:string = "";
    initialValue?:Object;
    type?:TypeDeclarationExpression;
    locationCondition?:LocationConditionExpression;
    associatedExpressions:BinaryExpression[] = [];
}