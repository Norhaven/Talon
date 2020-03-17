export class ExternCall{
    static of(name:string, ...args:string[]){
        return new ExternCall(name, ...args);
    }

    name:string = "";
    args:string[] = [];

    constructor(name:string, ...args:string[]){
        this.name = name;
        this.args = args;
    }
}