import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { Token } from "../../lexing/Token";
import { TypeDeclarationExpression } from "../expressions/TypeDeclarationExpression";
import { FieldDeclarationVisitor } from "./FieldDeclarationVisitor";
import { FieldDeclarationExpression } from "../expressions/FieldDeclarationExpression";

export class TypeDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expectAnyOf(Keywords.a, Keywords.an);

        const name = context.expectIdentifier();

        context.expect(Keywords.is);
        context.expect(Keywords.a);
        context.expect(Keywords.kind);
        context.expect(Keywords.of);

        const baseType = this.expectBaseType(context);
        
        context.expectTerminator();

        const fields:FieldDeclarationExpression[] = [];

        while (context.is(Keywords.it)){
            const fieldVisitor = new FieldDeclarationVisitor();
            const field = fieldVisitor.visit(context);

            fields.push(<FieldDeclarationExpression>field);
        }

        const typeDeclaration = new TypeDeclarationExpression(name, baseType);

        typeDeclaration.fields = fields;

        return typeDeclaration;
    }

    private expectBaseType(context:ParseContext){
        if (context.isAnyOf(Keywords.place, Keywords.item)){
            return context.consumeCurrentToken();
        } else {
            return context.expectIdentifier();
        }
    }
}