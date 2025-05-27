import { Constructor } from "./Constructor";

export class ArrayListIterator<T> implements Iterator<T>{

    private index = 0;

    constructor(private readonly array:T[]){
        
    }

    next(): IteratorResult<T>{
        return {
            done: this.index >= this.array.length,
            value: this.array[this.index++]
        };
    }
}

export class ArrayList<T> implements Iterable<T>{
    
    static from<T>(iterable:Iterable<T>){
        return new ArrayList(Array.from(iterable));
    }

    [Symbol.iterator](): Iterator<T, any, any> {
        return new ArrayListIterator(this.array);
    }

    constructor(private readonly array:T[]){

    }    

    map<U>(select:(value:T)=>U){
        return new ArrayList(this.array.map(select));
    }

    filter(where:(value: T, index: number, array: T[])=>value is T){
        return new ArrayList(this.array.filter(where));
    }

    ofType<U extends T>(type:Constructor<U>){
        return new ArrayList(this.array.filter(x => x instanceof type).map(x => <U>x));
    }

    cast<U extends T>(){
        return new ArrayList(this.array.map(x => <U>x));
    }
}