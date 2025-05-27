import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { UnderstandingDeclarationExpression } from "../expressions/UnderstandingDeclarationExpression";

export class UnderstandingDeclarationVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.understand);
        
        const values = context.expectOneOrMoreStrings();

        context.expect(Keywords.as);

        const meaning = context.expectAnyOf(Keywords.describing, 
                                            Keywords.moving,
                                            Keywords.directions,
                                            Keywords.taking,
                                            Keywords.giving,
                                            Keywords.inventory,
                                            Keywords.dropping,
                                            Keywords.using,
                                            Keywords.opening,
                                            Keywords.closing,
                                            Keywords.combining,
                                            Keywords.stateful,
                                            Keywords.options,
                                            Keywords.holding);

        context.expectTerminator();

        return new UnderstandingDeclarationExpression(values.map(x => x.value), meaning.value);        
    }
}