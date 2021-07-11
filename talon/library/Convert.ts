import { Keywords } from "../compiler/lexing/Keywords";

export class Convert{
    static stringToNumber(value:string){
        return Number(value);
    }

    static stringToBoolean(value:string){
        return value.toLowerCase() == Keywords.true;
    }
}