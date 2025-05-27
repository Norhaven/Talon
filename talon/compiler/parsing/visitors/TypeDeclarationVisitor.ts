import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { Token } from "../../lexing/Token";
import { TypeDeclarationExpression } from "../expressions/TypeDeclarationExpression";
import { FieldDeclarationVisitor } from "./FieldDeclarationVisitor";
import { FieldDeclarationExpression } from "../expressions/FieldDeclarationExpression";
import { WhenDeclarationExpression } from "../expressions/WhenDeclarationExpression";
import { WhenDeclarationVisitor } from "./WhenDeclarationVisitor";
import { MenuFieldDeclarationVisitor } from "./MenuFieldDeclarationVisitor";
import { MenuWhenDeclarationVisitor } from "./MenuWhenDeclarationVisitor";
import { OptionFieldDeclarationVisitor } from "./OptionFieldDefinitionVisitor";
import { OptionWhenDeclarationVisitor } from "./OptionWhenDefinitionVisitor";

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

        let fieldVisitor:Visitor;
        let whenVisitor:Visitor;

        if (baseType.value === Keywords.menu){
            fieldVisitor = new MenuFieldDeclarationVisitor();
            whenVisitor = new MenuWhenDeclarationVisitor();
        } else if (baseType.value === Keywords.option){
            fieldVisitor = new OptionFieldDeclarationVisitor();
            whenVisitor = new OptionWhenDeclarationVisitor();
        } else {
            fieldVisitor = new FieldDeclarationVisitor();
            whenVisitor = new WhenDeclarationVisitor(name.value);
        }
        
        const fields:FieldDeclarationExpression[] = [];

        while (context.is(Keywords.it)){
            const field = fieldVisitor.visit(context);

            fields.push(<FieldDeclarationExpression>field);
        }

        const events:WhenDeclarationExpression[] = [];

        while (context.is(Keywords.when)){
            const when = whenVisitor.visit(context);

            events.push(<WhenDeclarationExpression>when);
        }

        const typeDeclaration = new TypeDeclarationExpression(name, baseType);

        typeDeclaration.fields = fields;
        typeDeclaration.events = events;

        return typeDeclaration;        
    }

    private expectBaseType(context:ParseContext){
        if (context.isAnyOf(Keywords.place, Keywords.item, Keywords.decoration, Keywords.creature, Keywords.menu, Keywords.option, Keywords.player, Keywords.group)){
            return context.consumeCurrentToken();
        } else {
            return context.expectIdentifier();
        }
    }
}