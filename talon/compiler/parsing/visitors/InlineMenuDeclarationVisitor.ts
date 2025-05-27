import { CompilationError } from "../../exceptions/CompilationError";
import { Keywords } from "../../lexing/Keywords";
import { TokenType } from "../../lexing/TokenType";
import { CancelExpression } from "../expressions/CancelExpression";
import { Expression } from "../expressions/Expression";
import { InlineMenuDeclarationExpression } from "../expressions/InlineMenuDeclarationExpression";
import { OptionDeclarationExpression } from "../expressions/OptionDeclarationExpression";
import { ParseContext } from "../ParseContext";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { Visitor } from "./Visitor";

export class InlineMenuDeclarationVisitor extends Visitor{
    private static dynamicMenuCount = 0;
    private static dynamicMenuOptionCount = 0;

    constructor(private readonly typeName?:string){
        super();
    }

    visit(context: ParseContext): Expression {
        context.expect(Keywords.menu);

        let menuText = '';

        if (context.isTypeOf(TokenType.String)){
            menuText = context.expectString().value;
        }

        context.expect(Keywords.with);
        context.expect(Keywords.options);
        context.expectOpenMethodBlock();
        
        const options:OptionDeclarationExpression[] = [];
        
        while(context.isTypeOf(TokenType.String)){
            const optionText = context.expectString();

            context.expect(Keywords.will);
            
            const optionName = `dynamicMenuOption:${InlineMenuDeclarationVisitor.dynamicMenuOptionCount}`;

            InlineMenuDeclarationVisitor.dynamicMenuOptionCount++;

            if (context.is(Keywords.cancel)){
                context.expect(Keywords.cancel);
                context.expectSemiTerminator();

                const option = new OptionDeclarationExpression(optionName, optionText.value, [new CancelExpression()]);
                
                options.push(option);
            } else if (context.is(Keywords.set)){
                // This is an inline menu and so we want to restrict the statements allowed
                // within the options to quick and non-verbose ones to avoid dealing with
                // complex closures for the time being.

                const visitor = new ExpressionVisitor(this.typeName);
                const option = visitor.visit(context);
                
                options.push(new OptionDeclarationExpression(optionName, optionText.value, [option]));

                context.expectSemiTerminator();
            } else {
                throw new CompilationError("An inline menu option must use either a 'cancel' or a 'set' statement at the moment.");
            }
        }

        context.expect(Keywords.and);
        context.expect(Keywords.then);
        context.expect(Keywords.hide);
                 
        const menuName = `<~>dynamicMenu:${InlineMenuDeclarationVisitor.dynamicMenuCount}`;

        InlineMenuDeclarationVisitor.dynamicMenuCount++;

        return new InlineMenuDeclarationExpression(menuName, menuText, options);
    }
}