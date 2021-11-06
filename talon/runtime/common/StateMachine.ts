import { RuntimeError } from "../errors/RuntimeError";
import { State } from "./State";

export class StateMachine<T>{
    private currentState:State<T>;
    private readonly statesByContent:Map<T|undefined, State<T>>;

    constructor(...states:State<T>[]){
        this.currentState = State.empty<T>();
        this.statesByContent = new Map<T|undefined, State<T>>(states.map(x => [x.state, x]));
    }

    private getState(state:T){
        const current = this.statesByContent.get(state);

        if (!current){
            throw new RuntimeError(`Unable to get unknown state '${state}`);
        }

        return current;
    }

    is(state:T){
        return state === this.currentState.state;
    }

    initializeTo(state:T){        
        this.currentState = this.getState(state);
    }

    tryMoveTo(state:T){
        const attemptedState = this.getState(state);

        if (!attemptedState.preconditions!.every(x => x(this.currentState))){
            return false;
        }
        
        this.currentState = attemptedState;

        return true;
    }
}