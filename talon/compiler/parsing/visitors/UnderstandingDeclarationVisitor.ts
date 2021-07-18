import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { UnderstandingDeclarationExpression } from "../expressions/UnderstandingDeclarationExpression";

export class UnderstandingDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.understand);
        
        const value = context.expectString();

        context.expect(Keywords.as);

        const meaning = context.expectAnyOf(Keywords.describing, 
                                            Keywords.moving,
                                            Keywords.directions,
                                            Keywords.taking,
                                            Keywords.inventory,
                                            Keywords.dropping,
                                            Keywords.using);

        context.expectTerminator();

        return new UnderstandingDeclarationExpression(value.value, meaning.value);        
    }
}