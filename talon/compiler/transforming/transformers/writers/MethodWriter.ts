import { EventType } from "../../../../common/EventType";
import { Instruction } from "../../../../common/Instruction";
import { Method } from "../../../../common/Method";
import { Parameter } from "../../../../common/Parameter";
import { State } from "../../../../common/State";
import { Type } from "../../../../common/Type";
import { Any } from "../../../../library/Any";
import { BooleanType } from "../../../../library/BooleanType";
import { List } from "../../../../library/List";
import { Menu } from "../../../../library/Menu";
import { MenuOption } from "../../../../library/MenuOption";
import { StringType } from "../../../../library/StringType";
import { WorldObject } from "../../../../library/WorldObject";
import { Expression } from "../../../parsing/expressions/Expression";
import { ITypeTransformer } from "../../ITypeTransformer";
import { TransformerContext } from "../../TransformerContext";

export class MethodWriter{
    constructor(private readonly context:TransformerContext, private readonly type:Type){

    }

    createMoveMethod(){
        const move = new Method();
        move.name = WorldObject.move;
        move.returnType = BooleanType.typeName;
        move.parameters.push(    
            new Parameter(WorldObject.recipientParameter, WorldObject.typeName),     
            new Parameter(WorldObject.contextParameter, WorldObject.typeName),
            new Parameter(WorldObject.directionParameter, StringType.typeName)
        );

        move.body.push(
            Instruction.loadLocal(WorldObject.directionParameter),
            Instruction.loadLocal(WorldObject.contextParameter),
            Instruction.loadThis(),
            Instruction.raiseContextualDirectionEvent(EventType.ItGoes),
            ...Instruction.raiseAllEvents(false),
            ...Instruction.ifFalseThen(
                Instruction.loadBoolean(false),
                Instruction.return()
            ),
            Instruction.loadLocal(WorldObject.recipientParameter),
            Instruction.loadLocal(WorldObject.contextParameter),
            Instruction.loadThis(),
            Instruction.move(),
            Instruction.loadBoolean(true),
            Instruction.return()        
        );

        this.type.methods.push(move);
    }

    createDescribeMenuOptionMethod(){
        const describe = new Method();
        describe.name = Menu.describe;
        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.print()
            ),            
            Instruction.return()
        );

        this.type.methods.push(describe);
    }

    createDescribeMenuMethod(){
        const describe = new Method();
        describe.name = Menu.describe;
        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.print(),
                Instruction.loadThis(),
                Instruction.loadField(WorldObject.contents),
                ...Instruction.forEach(
                    Instruction.instanceCall(MenuOption.describe)
                ),
            ),            
            Instruction.return()
        );

        this.type.methods.push(describe);
    }

    createMenuMainMethod(){
        const handledCommandLocal = "~handledCommand";

        const main = new Method();
        main.name = Menu.main;
        main.parameters = [];
        main.returnType = BooleanType.typeName;
        main.body.push(
            Instruction.loadThis(),
            Instruction.loadField(Menu.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.instanceCall(WorldObject.describe),
                Instruction.loadThis(),
                Instruction.raiseEvent(EventType.ItIsDescribed),
                ...Instruction.raiseAllEvents(),
                Instruction.readInput(),
                Instruction.parseCommand(),
                Instruction.loadThis(),
                Instruction.handleMenuCommand(),
                Instruction.setLocal(handledCommandLocal),
                Instruction.loadLocal(handledCommandLocal),
                Instruction.isTypeOf(List.typeName),
                ...Instruction.ifTrueThen(
                    Instruction.loadLocal(handledCommandLocal),
                    Instruction.instanceCall(List.count),
                    Instruction.loadNumber(0),
                    Instruction.compareEqual(),
                    ...Instruction.ifTrueThen(
                        Instruction.loadString("That doesn't appear to be one of the options."),
                        Instruction.print(),
                        Instruction.goTo(0)
                    ),
                    Instruction.loadLocal(handledCommandLocal),
                    ...Instruction.raiseAllEvents(false),
                    Instruction.return()
                ),
                Instruction.goTo(0)
            ),
            Instruction.loadBoolean(true),
            Instruction.return()
        );     

        this.type.methods.push(main);
    }

    createShowMethod(){
        const menuInstance = "~menuInstance";

        const show = new Method();
        show.name = Menu.show;        
        show.parameters = [new Parameter(WorldObject.contextParameter, List.typeName)];
        show.returnType = BooleanType.typeName;
        show.body.push(
            Instruction.loadInstance(this.type.name),
            Instruction.setLocal(menuInstance),
            
            // Add the context parameter to the list of things that this menu has closed over
            // so that it can access the appropriate instance fields if needed without fully
            // qualifying the type access.

            Instruction.loadLocal(WorldObject.contextParameter),
            Instruction.loadEmpty(),
            Instruction.compareEqual(),
            ...Instruction.ifFalseThen(
                Instruction.loadLocal(WorldObject.contextParameter),
                Instruction.loadLocal(menuInstance),
                Instruction.loadField(Menu.itClosures),
                Instruction.instanceCall(List.union),
                Instruction.ignore()
            ),

            Instruction.loadBoolean(true),
            Instruction.loadLocal(menuInstance),
            Instruction.loadField(Menu.visible),
            Instruction.assign(),

            Instruction.loadLocal(menuInstance),
            Instruction.instanceCall(Menu.main),
            Instruction.return()
        );

        this.type.methods.push(show);
    }

    createHideMethod(){
        const hide = new Method();
        hide.name = Menu.hide;        
        hide.parameters = [];
        hide.body.push(
            Instruction.loadBoolean(false),
            Instruction.loadThis(),
            Instruction.loadField(WorldObject.visible),
            Instruction.assign(),
            Instruction.return()
        );

        this.type.methods.push(hide);
    }

    createTransferMethod(){
        const transfer = new Method();
        transfer.name = WorldObject.transferContents;
        transfer.returnType = BooleanType.typeName;
        transfer.parameters = [
            new Parameter(WorldObject.recipientParameter, WorldObject.typeName),
            new Parameter(WorldObject.contextParameter, WorldObject.typeName),
            new Parameter(WorldObject.eventTypeParameter, StringType.typeName)
        ];

        transfer.body.push(

            // Invoke matching events, if they're present, on the content and recipient.
      
            Instruction.loadLocal(WorldObject.contextParameter),
            Instruction.loadLocal(WorldObject.recipientParameter),
            Instruction.loadLocal(WorldObject.eventTypeParameter),
            Instruction.raiseContextualEvent(EventType.RuntimeDetermined),
            ...Instruction.raiseAllEvents(false),

            // Early out if we declined any of the events, otherwise go ahead and transfer the content.

            ...Instruction.ifTrueThen(
                // Check to make sure that nothing else already transferred it, if it's still here
                // then go ahead and move it.

                Instruction.loadLocal(WorldObject.contextParameter),                
                Instruction.loadField(WorldObject.currentContainer),
                Instruction.loadInstance(),       
                Instruction.loadThis(),
                Instruction.compareEqual(),
                ...Instruction.ifTrueThen(
                    Instruction.loadLocal(WorldObject.contextParameter),
                    Instruction.loadThis(),
                    Instruction.loadProperty(WorldObject.contents),
                    Instruction.instanceCall(List.containsInstance),
                    ...Instruction.ifTrueThen(
                        Instruction.loadLocal(WorldObject.contextParameter),   
                        Instruction.loadThis(),
                        Instruction.loadProperty(WorldObject.contents),
                        Instruction.instanceCall(List.remove),
                        Instruction.loadLocal(WorldObject.contextParameter),
                        Instruction.loadLocal(WorldObject.recipientParameter),
                        Instruction.loadField(WorldObject.contents),
                        Instruction.instanceCall(List.add),
                        Instruction.ignore()
                    ),
                ),                
                Instruction.loadBoolean(true),
                Instruction.return()
            ),
            Instruction.loadBoolean(false),
            Instruction.return()
        );

        this.type.methods.push(transfer);
    }

    createDescribeMethod(){
        const contentsLocal = "~contents";
        const contentsObservationsLocal = "~contentsObservations";

        const describe = new Method();
        describe.name = WorldObject.describe;
        describe.returnType = BooleanType.typeName;

        describe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.description),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                ...Instruction.containsTextValue(State.opened, WorldObject.state),
                ...Instruction.ifTrueThen(
                    ...Instruction.joinList(' ',
                        Instruction.loadThis(),
                        Instruction.loadProperty(WorldObject.contents),
                        Instruction.setLocal(contentsLocal),
                        ...Instruction.groupList(contentsLocal),
                        ...Instruction.mapList(WorldObject.observe, contentsLocal, contentsObservationsLocal),
                        Instruction.loadLocal(contentsObservationsLocal)
                    ),
                    Instruction.concatenate()
                ),
                Instruction.print(),
            ),            
            Instruction.loadBoolean(true),
            Instruction.return()
        );

        this.type.methods.push(describe);
    }

    createObserveMethod(){
        const contentsLocal = "~contents";
        const contentsObservationsLocal = "~contentsObservations";

        const observe = new Method();
        observe.name = WorldObject.observe;
        observe.returnType = StringType.typeName;

        observe.body.push(
            Instruction.loadThis(),
            Instruction.loadProperty(WorldObject.visible),
            ...Instruction.ifTrueThen(                                
                ...Instruction.containsTextValue(State.opened, WorldObject.state),
                ...Instruction.ifTrueThen(
                    Instruction.loadThis(),
                    Instruction.loadProperty(WorldObject.observation),
                    Instruction.loadThis(),
                    Instruction.interpolateString(),
                    ...Instruction.joinList(' ',
                        Instruction.loadThis(),
                        Instruction.loadProperty(WorldObject.contents),
                        Instruction.setLocal(contentsLocal),
                        ...Instruction.groupList(contentsLocal),
                        ...Instruction.mapList(WorldObject.observe, contentsLocal, contentsObservationsLocal),
                        Instruction.loadLocal(contentsObservationsLocal)
                    ),                    
                    Instruction.concatenate(),
                    Instruction.return(),
                ),                
                Instruction.loadThis(),
                Instruction.loadProperty(WorldObject.observation),
                Instruction.loadThis(),
                Instruction.interpolateString(),
                Instruction.return(),
            ),
            Instruction.loadString(""),
            Instruction.return()
        );

        this.type.methods.push(observe);
    }
}