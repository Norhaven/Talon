export class State<T>{   
    static empty<U>():State<U>{
        return new State<U>();
    }

    readonly preconditions:((currentState:State<T>)=>boolean)[] = [];

    constructor(public readonly state?:T, 
                ...preconditions:((currentState:State<T>)=>boolean)[]){

        if (preconditions){
            preconditions.forEach(x => this.preconditions.push(x));
        }
    }
}