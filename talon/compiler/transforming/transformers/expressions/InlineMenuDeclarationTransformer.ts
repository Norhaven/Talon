import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Type } from "../../../../common/Type";
import { List } from "../../../../library/List";
import { Menu } from "../../../../library/Menu";
import { MenuOption } from "../../../../library/MenuOption";
import { StringType } from "../../../../library/StringType";
import { WorldObject } from "../../../../library/WorldObject";
import { CompilationError } from "../../../exceptions/CompilationError";
import { Keywords } from "../../../lexing/Keywords";
import { ActionsExpression } from "../../../parsing/expressions/ActionsExpression";
import { CancelExpression } from "../../../parsing/expressions/CancelExpression";
import { ClosureExpression } from "../../../parsing/expressions/ClosureExpression";
import { Expression } from "../../../parsing/expressions/Expression";
import { IdentifierExpression } from "../../../parsing/expressions/IdentifierExpression";
import { InlineMenuDeclarationExpression } from "../../../parsing/expressions/InlineMenuDeclarationExpression";
import { OptionDeclarationExpression } from "../../../parsing/expressions/OptionDeclarationExpression";
import { SetVariableExpression } from "../../../parsing/expressions/SetVariableExpression";
import { WhenDeclarationExpression } from "../../../parsing/expressions/WhenDeclarationExpression";
import { TransformerContext } from "../../TransformerContext";
import { EventTransformer } from "../events/EventTransformer";
import { GlobalTypeTransformer } from "../type/GlobalTypeTransformer";

export class InlineMenuDeclarationTransformer{
    static transform(expression:InlineMenuDeclarationExpression, context:TransformerContext, instructions:Instruction[]){
        // We're not doing nested types at the moment, so dynamic menus are
        // also created at the global level and just referenced here to show.

        const typeTransformer = new GlobalTypeTransformer(context);

        const menuType = context.addType(expression.menuName, Menu.typeName);
        
        const contents:[number, number|undefined, string][] = [];
        const options:Type[] = [];
        
        menuType.addField(WorldObject.description, StringType.typeName, expression.menuText);
        menuType.addField(WorldObject.contents, List.typeName, contents);
        menuType.addField(Menu.itClosures, List.typeName, []);

        let optionIndex = 1;

        for(const option of expression.options){
            const closureSources = new Set<string>();
            const [optionType, selectedEvent, _] = InlineMenuDeclarationTransformer.transformOption(option, context, menuType, optionIndex);

            optionIndex++;

            options.push(optionType);
            contents.push([1, undefined, optionType.name]);
            menuType.methods.push(selectedEvent);
        }

        typeTransformer.transform(expression, menuType);

        options.map(x => typeTransformer.transform(undefined, x));

        instructions.push(
            Instruction.loadLocal(WorldObject.contextParameter),
            Instruction.loadThis(), // Inline menus close over their enclosing instance in order to reference fields, so pass that in.
            Instruction.newInstance(List.typeName),
            Instruction.instanceCall(List.add),
            Instruction.instanceCall(List.add),
            Instruction.staticCall(expression.menuName, Menu.show, true),
            ...Instruction.ifFalseThen(
                Instruction.loadBoolean(false),
                Instruction.return()
            )
        );
    }

    static transformOption(option: OptionDeclarationExpression, context:TransformerContext, menuType:Type, optionIndex:number):[Type, Method, string[]] {
        
        const optionType = context.addType(option.optionName, MenuOption.typeName);
        
        optionType.addField(WorldObject.description, StringType.typeName, option.text);

        const optionActions:Expression[] = [];
        const closureSources:string[] = [];

        for(const action of option.actions){
            if (action instanceof SetVariableExpression){                                            
                if (action.evaluationExpression instanceof IdentifierExpression){
                    const variableName = action.evaluationExpression.variableName;

                    if (!closureSources.some(x => x == variableName)){
                        closureSources.push(variableName);
                    }

                    const resolvedIdentifier = new IdentifierExpression(WorldObject.closureParameter, variableName);
                    optionActions.push(new SetVariableExpression(action.variableIdentifier, resolvedIdentifier, action.isNegated))
                } else {
                    optionActions.push(action);
                }                    
            } else if (action instanceof CancelExpression) {
                optionActions.push(action);
            } else {
                throw new CompilationError(`Unable to transform inline menu option '${option.text}', actions are restricted at the moment to either 'cancel' or 'set' statements.`);
            }
        }
        
        const actions = new ActionsExpression(optionActions);
        const closures = new ClosureExpression(closureSources);
        const whenSelected = new WhenDeclarationExpression(option.optionName, [Keywords.selected], actions, undefined, undefined, closures, undefined, optionIndex);
        const selectedEvent = EventTransformer.createEventFor(whenSelected, context, menuType);

        return [optionType, selectedEvent, closureSources];
    }
}