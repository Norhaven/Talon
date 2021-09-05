import { Instruction } from "../../../../common/Instruction";
import { BooleanType } from "../../../../library/BooleanType";
import { List } from "../../../../library/List";
import { NumberType } from "../../../../library/NumberType";
import { StringType } from "../../../../library/StringType";
import { WorldObject } from "../../../../library/WorldObject";
import { CompilationError } from "../../../exceptions/CompilationError";
import { AbortEventExpression } from "../../../parsing/expressions/AbortEventExpression";
import { ActionsExpression } from "../../../parsing/expressions/ActionsExpression";
import { ComparisonExpression } from "../../../parsing/expressions/ComparisonExpression";
import { ConcatenationExpression } from "../../../parsing/expressions/ConcatenationExpression";
import { ContainsExpression } from "../../../parsing/expressions/ContainsExpression";
import { Expression } from "../../../parsing/expressions/Expression";
import { FieldDeclarationExpression } from "../../../parsing/expressions/FieldDeclarationExpression";
import { IdentifierExpression } from "../../../parsing/expressions/IdentifierExpression";
import { IfExpression } from "../../../parsing/expressions/IfExpression";
import { LiteralExpression } from "../../../parsing/expressions/LiteralExpression";
import { ReplaceExpression } from "../../../parsing/expressions/ReplaceExpression";
import { SayExpression } from "../../../parsing/expressions/SayExpression";
import { SetVariableExpression } from "../../../parsing/expressions/SetVariableExpression";
import { ExpressionTransformationMode } from "../../ExpressionTransformationMode";

export class ExpressionTransformer{
    static transformExpression(expression:Expression|null, mode?:ExpressionTransformationMode){
        const instructions:Instruction[] = [];

        if (expression == null){
            return instructions;
        }

        if (expression instanceof IfExpression){            
            const conditional = this.transformExpression(expression.conditional, mode);
            instructions.push(...conditional);

            const ifBlock = this.transformExpression(expression.ifBlock, mode);
            const elseBlock = this.transformExpression(expression.elseBlock, mode);

            ifBlock.push(Instruction.branchRelative(elseBlock.length));

            instructions.push(Instruction.branchRelativeIfFalse(ifBlock.length))
            instructions.push(...ifBlock);
            instructions.push(...elseBlock);
        } else if (expression instanceof SayExpression){
            instructions.push(Instruction.loadString(expression.text));
            instructions.push(Instruction.print());

            if (mode != ExpressionTransformationMode.IgnoreResultsOfSayExpression){
                instructions.push(Instruction.loadString(expression.text));
            }
        } else if (expression instanceof ContainsExpression){
            instructions.push(
                Instruction.loadNumber(expression.count),
                Instruction.loadString(expression.typeName),
                Instruction.loadInstance(expression.targetName),
                Instruction.loadField(WorldObject.contents),
                Instruction.instanceCall(List.containsType)
            );
            
        } else if (expression instanceof ConcatenationExpression){
            const left = this.transformExpression(expression.left!, mode);
            const right = this.transformExpression(expression.right!, mode);

            instructions.push(...left);
            instructions.push(...right);
            instructions.push(Instruction.concatenate());
        } else if (expression instanceof FieldDeclarationExpression){
            instructions.push(
                Instruction.loadThis(),
                Instruction.loadField(expression.name)
            );
        } else if (expression instanceof SetVariableExpression){
            const right = this.transformExpression(expression.evaluationExpression);
            const left:Instruction[] = [];
            const assign:Instruction[] = [];

            if (expression.variableName === "~it"){
                left.push(
                    Instruction.loadThis(),
                    Instruction.loadField(WorldObject.state)
                );

                if (expression.isNegated){
                    assign.push(
                        Instruction.instanceCall(List.remove)
                    );
                } else {
                    assign.push(
                        Instruction.instanceCall(List.ensureOne)
                    );
                }
            } else {
                left.push(
                    Instruction.loadThis(),
                    Instruction.loadField(expression.variableName)
                );

                assign.push(Instruction.assign());
            }

            instructions.push(
                ...right,
                ...left,
                ...assign
            );
        } else if (expression instanceof LiteralExpression){
            if (expression.typeName == StringType.typeName){
                instructions.push(Instruction.loadString(<string>expression.value));
            } else if (expression.typeName == NumberType.typeName){
                instructions.push(Instruction.loadNumber(Number(expression.value)));
            } else if (expression.typeName == BooleanType.typeName){
                instructions.push(Instruction.loadBoolean(<boolean>(expression.value)));
            } else {
                throw new CompilationError(`Unable to transform unsupported literal expression '${expression}'`);
            }
        } else if (expression instanceof IdentifierExpression){
            if (expression.variableName === "~it"){
                instructions.push(
                    Instruction.loadThis(),
                    Instruction.loadField(WorldObject.state)
                );
            } else {
                instructions.push(
                    Instruction.loadThis(),
                    Instruction.loadField(expression.variableName));
            }
        } else if (expression instanceof ComparisonExpression){
            const right = this.transformExpression(expression.right!);
            const left = this.transformExpression(expression.left!);

            instructions.push(
                ...left,
                ...right,
                Instruction.compareEqual()
            );
        } else if (expression instanceof ActionsExpression){
            expression.actions.forEach(x => instructions.push(...this.transformExpression(x, mode)));
        } else if (expression instanceof AbortEventExpression){
            instructions.push(
                Instruction.loadBoolean(false),
                Instruction.return()
            );
        } else if (expression instanceof ReplaceExpression){
            for(const identifier of expression.replacedEntities){
                if (identifier.variableName === "~it"){
                    instructions.push(
                        Instruction.loadThis()
                    );
                } else {
                    // TODO: Currently, we're assuming that the only thing that they can replace is the context instance.
                    //       This could be expanded to allow replacing anything within the current player context (e.g. inventory, place, etc).
                    
                    instructions.push(
                        Instruction.loadLocal(WorldObject.contextParameter)
                    );
                }
            }

            instructions.push(
                Instruction.loadNumber(expression.replacedEntities.length),
                Instruction.replaceInstancesWith(expression.newEntity.variableName)
            );

            
        } else {
            throw new CompilationError(`Unable to transform unsupported expression: ${expression}`);
        }

        return instructions;
    }
}