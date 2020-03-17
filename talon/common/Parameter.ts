import { Type } from "./Type";

export class Parameter{
    
    type?:Type;

    constructor(public readonly name:string,
                public readonly typeName:string){

    }
}