import { ExternCall } from "./ExternCall";

export class Any{        
    static parentTypeName:string = "";
    static typeName:string = "<>any";  
    
    static main = "<>main";
    static externToString = ExternCall.of("<>toString");
}
