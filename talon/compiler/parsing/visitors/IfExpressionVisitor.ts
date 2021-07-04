import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { ExpressionVisitor } from "./ExpressionVisitor";
import { IfExpression } from "../expressions/IfExpression";
import { BlockExpressionVisitor } from "./BlockExpressionVisitor";
import { CompilationError } from "../../exceptions/CompilationError";

export class IfExpressionVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        context.expect(Keywords.if);

        const expressionVisitor = new ExpressionVisitor();
        const conditional = expressionVisitor.visit(context);

        context.expect(Keywords.then);

        const blockVisitor = new BlockExpressionVisitor();
        const ifBlock = blockVisitor.visit(context);
        const elseBlock = this.tryVisitElseBlock(context);
        
        if (context.is(Keywords.and)){            
            context.expect(Keywords.and);
            context.expect(Keywords.then);
            context.expect(Keywords.continue);
        } else {
            throw new CompilationError(`You need to end an 'if' expression correctly, not with: ${context.currentToken}`);
        }

        return new IfExpression(conditional, ifBlock, elseBlock);
    }

    private tryVisitElseBlock(context:ParseContext){
        if (!context.is(Keywords.or)){
            return null;
        }
    
        const blockVisitor = new BlockExpressionVisitor();

        context.expect(Keywords.or);
        context.expect(Keywords.else);

        return blockVisitor.visit(context);
    }
}