import { Visitor } from "./Visitor";
import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";
import { Keywords } from "../../lexing/Keywords";
import { TypeDeclarationVisitor } from "./TypeDeclarationVisitor";
import { ProgramExpression } from "../expressions/ProgramExpression";
import { CompilationError } from "../../exceptions/CompilationError";
import { UnderstandingDeclarationVisitor } from "./UnderstandingDeclarationVisitor";
import { SayExpressionVisitor } from "./SayExpressionVisitor";
import { WhenDeclarationVisitor } from "./WhenDeclarationVisitor";

export class ProgramVisitor extends Visitor{
    visit(context: ParseContext): Expression {
        let expressions:Expression[] = [];

        while(!context.isDone){
            if (context.is(Keywords.understand)){
                const understandingDeclaration = new UnderstandingDeclarationVisitor();
                const expression = understandingDeclaration.visit(context);

                expressions.push(expression);
            } else if (context.isAnyOf(Keywords.a, Keywords.an)){
                const typeDeclaration = new TypeDeclarationVisitor();
                const expression = typeDeclaration.visit(context);

                expressions.push(expression);
            } else if (context.is(Keywords.say)){
                const sayExpression = new SayExpressionVisitor();
                const expression = sayExpression.visit(context);

                // At the top level, a say expression must have a terminator. We're evaluating it out here
                // because a say expression normally doesn't require one.

                context.expectTerminator();

                expressions.push(expression);
            } else if (context.is(Keywords.when)){
                const whenClause = new WhenDeclarationVisitor();
                const expression = whenClause.visit(context);

                expressions.push(expression);
            } else{
                throw new CompilationError(`Found unexpected token '${context.currentToken}'`);
            }            
        }

        return new ProgramExpression(expressions);
    }
}