import { EventType } from "../../../../common/EventType";
import { Field } from "../../../../common/Field";
import { Instruction } from "../../../../common/Instruction";
import { Type } from "../../../../common/Type";
import { BooleanType } from "../../../../library/BooleanType";
import { GlobalEvents } from "../../../../library/GlobalEvents";
import { GlobalFields } from "../../../../library/GlobalFields";
import { List } from "../../../../library/List";
import { Menu } from "../../../../library/Menu";
import { MenuOption } from "../../../../library/MenuOption";
import { NumberType } from "../../../../library/NumberType";
import { Player } from "../../../../library/Player";
import { StringType } from "../../../../library/StringType";
import { WorldObject } from "../../../../library/WorldObject";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Keywords } from "../../../lexing/Keywords";
import { AbortEventExpression } from "../../../parsing/expressions/AbortEventExpression";
import { AcceptExpression } from "../../../parsing/expressions/AcceptExpression";
import { ActionsExpression } from "../../../parsing/expressions/ActionsExpression";
import { CancelExpression } from "../../../parsing/expressions/CancelExpression";
import { ClosureExpression } from "../../../parsing/expressions/ClosureExpression";
import { ComparisonExpression } from "../../../parsing/expressions/ComparisonExpression";
import { ConcatenationExpression } from "../../../parsing/expressions/ConcatenationExpression";
import { ContainsExpression } from "../../../parsing/expressions/ContainsExpression";
import { Expression } from "../../../parsing/expressions/Expression";
import { FieldDeclarationExpression } from "../../../parsing/expressions/FieldDeclarationExpression";
import { GameCompletionExpression } from "../../../parsing/expressions/GameCompletionExpression";
import { GiveExpression } from "../../../parsing/expressions/GiveExpression";
import { IdentifierExpression } from "../../../parsing/expressions/IdentifierExpression";
import { IfExpression } from "../../../parsing/expressions/IfExpression";
import { IncrementDecrementExpression } from "../../../parsing/expressions/IncrementDecrementExpression";
import { InlineMenuDeclarationExpression } from "../../../parsing/expressions/InlineMenuDeclarationExpression";
import { LiteralExpression } from "../../../parsing/expressions/LiteralExpression";
import { MoveExpression } from "../../../parsing/expressions/MoveExpression";
import { PlayerCompletionExpression } from "../../../parsing/expressions/PlayerCompletionExpression";
import { QuitExpression } from "../../../parsing/expressions/QuitExpression";
import { RemoveExpression } from "../../../parsing/expressions/RemoveExpression";
import { ReplaceExpression } from "../../../parsing/expressions/ReplaceExpression";
import { SayExpression } from "../../../parsing/expressions/SayExpression";
import { SetPlayerExpression } from "../../../parsing/expressions/SetPlayerExpression";
import { SetVariableExpression } from "../../../parsing/expressions/SetVariableExpression";
import { VisibilityExpression } from "../../../parsing/expressions/VisibilityExpression";
import { WhenDeclarationExpression } from "../../../parsing/expressions/WhenDeclarationExpression";
import { ExpressionTransformationMode } from "../../ExpressionTransformationMode";
import { TransformerContext } from "../../TransformerContext";
import { EventTransformer } from "../events/EventTransformer";
import { GlobalTypeTransformer } from "../type/GlobalTypeTransformer";
import { InlineMenuDeclarationTransformer } from "./InlineMenuDeclarationTransformer";

export class ExpressionTransformer{
    static transformExpression(expression:Expression|null, context:TransformerContext, mode?:ExpressionTransformationMode){
        const instructions:Instruction[] = [];

        if (expression == null){
            return instructions;
        }

        if (expression instanceof IfExpression){            
            const conditional = this.transformExpression(expression.conditional, context, mode);
            instructions.push(...conditional);

            const ifBlock = this.transformExpression(expression.ifBlock, context, mode);
            const elseBlock = this.transformExpression(expression.elseBlock, context, mode);

            ifBlock.push(Instruction.branchRelative(elseBlock.length));

            instructions.push(Instruction.branchRelativeIfFalse(ifBlock.length))
            instructions.push(...ifBlock);
            instructions.push(...elseBlock);
        } else if (expression instanceof SayExpression){
            instructions.push(
                Instruction.loadString(expression.text),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.print()
            );

            if (mode != ExpressionTransformationMode.IgnoreResultsOfSayExpression){
                instructions.push(Instruction.loadString(expression.text));
            }
        } else if (expression instanceof ContainsExpression){
            instructions.push(
                Instruction.loadNumber(expression.count),
                Instruction.loadString(expression.typeName),
                expression.targetName == "~it" ? Instruction.loadThis() : Instruction.loadInstance(expression.targetName),
                Instruction.loadField(WorldObject.contents),
                Instruction.instanceCall(List.containsType)
            );
            
        } else if (expression instanceof ConcatenationExpression){
            const left = this.transformExpression(expression.left!, context, mode);
            const right = this.transformExpression(expression.right!, context, mode);

            instructions.push(...left);
            instructions.push(...right);
            instructions.push(Instruction.concatenate());
        } else if (expression instanceof FieldDeclarationExpression){
            instructions.push(
                Instruction.loadThis(),
                Instruction.loadField(expression.name)
            );
        } else if (expression instanceof SetVariableExpression){
            const right = this.transformExpression(expression.evaluationExpression, context);
            const left:Instruction[] = [];
            const assign:Instruction[] = [];

            if (expression.variableIdentifier.variableName === "~it"){
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
            } else if (expression.variableIdentifier.instanceName == Player.typeName){
                left.push(
                    Instruction.loadPlayer(),
                    ...Instruction.assignToFieldReference(expression.variableIdentifier.variableName)
                );
            } else if (expression.variableIdentifier.instanceName){
                if (expression.variableIdentifier.instanceName == "~it"){
                    left.push(
                        Instruction.loadThis(),
                        ...Instruction.assignToFieldReference(expression.variableIdentifier.variableName)
                    );
                } else {
                    left.push(
                        Instruction.loadInstance(expression.variableIdentifier.instanceName),
                        ...Instruction.assignToFieldReference(expression.variableIdentifier.variableName)
                    );
                }
            } else {
                left.push(
                    Instruction.loadThis(),
                    Instruction.loadFieldReference(expression.variableIdentifier.variableName)
                );

                assign.push(
                    Instruction.assign(),
                    ...Instruction.raiseAllEvents()
                );
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
            } else if (expression.instanceName){
                if (expression.instanceName == WorldObject.closureParameter){
                    instructions.push(
                        Instruction.loadInstance(expression.variableName)
                    );
                } else if (expression.instanceName == "~it"){
                    const label = context.createLabel();

                    instructions.push(
                        Instruction.localExists(WorldObject.contextParameter),
                        ...Instruction.ifTrueThen(
                            Instruction.loadLocal(WorldObject.contextParameter),
                            Instruction.isTypeOf(expression.variableName),
                            ...Instruction.ifTrueThen(
                                Instruction.loadLocal(WorldObject.contextParameter),
                                Instruction.goToLabel(label)
                            )
                        ),
                        Instruction.loadThis(),
                        Instruction.loadFieldReference(expression.variableName),
                        ...Instruction.raiseAllEvents(),
                        Instruction.markAsLabel(label)
                    );
                } else {
                    instructions.push(
                        Instruction.loadInstance(expression.instanceName),
                        Instruction.loadField(expression.variableName)
                    );
                }
            } else {
                instructions.push(
                    Instruction.loadThis(),
                    Instruction.loadField(expression.variableName));
            }
        } else if (expression instanceof ComparisonExpression){
            const right = this.transformExpression(expression.right!, context);
            const left = this.transformExpression(expression.left!, context);

            instructions.push(
                ...left,
                ...right,
                Instruction.compareEqual(expression.isNegated)
            );
        } else if (expression instanceof ActionsExpression){
            expression.actions.forEach(x => instructions.push(...this.transformExpression(x, context, mode)));
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
        } else if (expression instanceof VisibilityExpression){
            if (expression.action.toLowerCase() === 'show'){
                instructions.push(
                    Instruction.loadEmpty(),
                    Instruction.staticCall(expression.target!, Menu.show, true),
                    ...Instruction.ifFalseThen(
                        Instruction.loadBoolean(false),
                        Instruction.return()
                    )
                );
            } else if (expression.action.toLowerCase() === 'hide'){
                instructions.push(
                    Instruction.loadThis(),
                    Instruction.instanceCall(Menu.hide)
                );
            }
        } else if (expression instanceof QuitExpression){
            instructions.push(
                Instruction.loadBoolean(false),
                Instruction.assignStaticField("~globalProgramFields", GlobalFields.canRun),
                Instruction.loadBoolean(false),
                Instruction.return()
            );
        } else if (expression instanceof PlayerCompletionExpression){
            instructions.push(
                Instruction.loadPlayer(),
                Instruction.loadInstance(GlobalEvents.typeName),
                Instruction.raiseContextualEvent(expression.action),
                ...Instruction.raiseAllEvents()          
            );
        } else if (expression instanceof GameCompletionExpression){
            
            if (expression.action){
                instructions.push(
                    Instruction.loadPlayer(),
                    Instruction.loadInstance(GlobalEvents.typeName),
                    Instruction.raiseContextualEvent(expression.action),
                    ...Instruction.raiseAllEvents()
                );
            }

            instructions.push(
                Instruction.loadBoolean(false),
                Instruction.assignStaticField("~globalProgramFields", GlobalFields.canRun)
            );
        } else if (expression instanceof IncrementDecrementExpression){
            const instanceInstruction = expression.instanceName == Player.typeName ? Instruction.loadPlayer() : Instruction.loadThis();

            instructions.push(
                instanceInstruction,
                Instruction.loadField(expression.variableName),
                Instruction.loadNumber(expression.value),
                Instruction.add(),                
                instanceInstruction,
                ...Instruction.assignToFieldReference(expression.variableName)
            );
        } else if (expression instanceof AcceptExpression){
            instructions.push(
                
            );
        } else if (expression instanceof SetPlayerExpression){
            instructions.push(
                Instruction.setPlayer(expression.playerType),
                Instruction.loadInstance(GlobalEvents.typeName),
                Instruction.raiseEvent(EventType.PlayerIsSet),
                ...Instruction.raiseAllEvents()
            );
        } else if (expression instanceof GiveExpression){

            const targetIsSelf = expression.targetName == "~it";
            const targetIsPlayer = expression.targetName == Player.typeName;

            let targetInstruction:Instruction;

            if (targetIsSelf){
                targetInstruction = Instruction.loadThis();
            } else if (targetIsPlayer){
                targetInstruction = Instruction.loadPlayer();
            } else {
                targetInstruction = Instruction.loadInstance(expression.targetName);
            }

            for(const item of expression.items){
                for(let i = 0; i < item.count; i++){
                    instructions.push(
                        Instruction.newInstance(item.typeName),
                        targetInstruction,
                        Instruction.give()
                    );
                }
            }
        
        } else if (expression instanceof InlineMenuDeclarationExpression){
            InlineMenuDeclarationTransformer.transform(expression, context, instructions);            
        } else if (expression instanceof CancelExpression){
            instructions.push(
                Instruction.loadThis(),
                Instruction.instanceCall(Menu.hide),
                Instruction.loadBoolean(false),
                Instruction.return()
            );
        } else if (expression instanceof MoveExpression){

            const getInstructionFor = (typeName:string) => {
                if (typeName == "~it"){
                    return Instruction.loadThis();
                } else if (typeName == Player.typeName){
                    return Instruction.loadPlayer();
                } else {
                    return Instruction.loadInstance(typeName);
                }
            };

            const actorInstruction = getInstructionFor(expression.actor);
            const targetInstruction = getInstructionFor(expression.target);

            instructions.push(
                actorInstruction,
                ...Instruction.loadCurrentContainer(actorInstruction),
                Instruction.loadField(WorldObject.contents),
                Instruction.instanceCall(List.remove),
                actorInstruction,
                targetInstruction,
                Instruction.loadField(WorldObject.contents),
                Instruction.instanceCall(List.add),
                Instruction.ignore(),
                actorInstruction,
                Instruction.getTypeName(),
                actorInstruction,
                Instruction.loadField(WorldObject.currentContainer),
                Instruction.assign()
            );
        } else if (expression instanceof RemoveExpression){
            const getInstructionFor = (typeName:string) => {
                if (typeName == "~it"){
                    return Instruction.loadThis();
                } else if (typeName == Player.typeName){
                    return Instruction.loadPlayer();
                } else {
                    return Instruction.loadInstance(typeName);
                }
            };

            const actorInstruction = getInstructionFor(expression.actor);
            const targetInstruction = getInstructionFor(expression.target);

            instructions.push(
                ...Instruction.loadCurrentContainer(actorInstruction),
                targetInstruction,
                Instruction.compareEqual(),
                ...Instruction.ifTrueThen(
                    actorInstruction,
                    ...Instruction.loadCurrentContainer(actorInstruction),
                    Instruction.loadField(WorldObject.contents),
                    Instruction.instanceCall(List.remove)
                ),
                Instruction.loadString(""),
                actorInstruction,
                Instruction.loadField(WorldObject.currentContainer),
                Instruction.assign()
            ); 
        } else {
            throw new CompilationError(`Unable to transform unsupported expression: ${expression}`);
        }

        return instructions;
    }
}