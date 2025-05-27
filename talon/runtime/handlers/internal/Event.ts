import { EventType } from "../../../common/EventType";
import { Instruction } from "../../../common/Instruction";
import { Method } from "../../../common/Method";
import { Parameter } from "../../../common/Parameter";
import { Type } from "../../../common/Type";
import { BooleanType } from "../../../library/BooleanType";
import { Delegate } from "../../../library/Delegate";
import { WorldObject } from "../../../library/WorldObject";
import { Memory } from "../../common/Memory";
import { RuntimeAny } from "../../library/RuntimeAny";
import { RuntimeDelegate } from "../../library/RuntimeDelegate";
import { RuntimeMenu } from "../../library/RuntimeMenu";
import { RuntimeMenuOption } from "../../library/RuntimeMenuOption";
import { RuntimeString } from "../../library/RuntimeString";
import { RuntimeWorldObject } from "../../library/RuntimeWorldObject";
import { Variable } from "../../library/Variable";
import { Thread } from "../../Thread";
import { EventResolver } from "./EventResolver";

export class Event{
    static using(thread:Thread){
        return new Event(thread);
    }

    private constructor(private readonly thread:Thread){

    }

    raiseMenuSelection(menu:RuntimeMenu, selectedOption:RuntimeMenuOption){
        this.raise(resolver => resolver.resolveMenuSelection(menu, selectedOption));
    }

    prepareContextual(eventType:EventType, actor:RuntimeAny, target:RuntimeAny){
        return this.prepare(resolver => resolver.resolve(eventType, actor, target));
    }

    prepareNonContextual(eventType:EventType, target:RuntimeWorldObject){
        return this.prepare(resolver => resolver.resolve(eventType, target));
    }

    raiseContextual(eventType:EventType, actor:RuntimeAny, target:RuntimeAny){
        this.raise(resolver => resolver.resolve(eventType, actor, target));
    }

    raiseContextualDirection(eventType:EventType, actor:RuntimeAny, target:RuntimeAny, direction:RuntimeString){
        this.raise(resolver => resolver.resolve(eventType, actor, target, direction));
    }

    raiseNonContextual(eventType:EventType, target:RuntimeWorldObject){
        this.raise(resolver => resolver.resolve(eventType, target));
    }

    raiseAll(...delegates:RuntimeDelegate[]){
        this.thread.currentMethod.push(Memory.allocateList(delegates || []));
    }

    raiseEmpty(){
        this.thread.currentMethod.push(Memory.allocateList([]));
    }

    private prepare(raise:(resolver:EventResolver)=>RuntimeDelegate[]){
        const resolver = new EventResolver(this.thread);

        return raise(resolver);
    }

    private raise(raise:(resolver:EventResolver)=>RuntimeDelegate[]){
        const eventDelegates = this.prepare(raise);

        this.raiseAll(...eventDelegates);
    }
}